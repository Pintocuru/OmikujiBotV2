// src/MainGenerator/script/omikujiProcess/UserVisitManager.ts
import { UserNameType } from '@/types'
import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'

/**
 * ユーザーの訪問記録を管理するインターフェース
 */

/**
 * OmikenCommentTypeのomikujiRecordsを更新するためのコールバック型
 * omikujiRecords全体を Record<ruleId, count> の形式で渡す
 */
export type OmikujiRecordsUpdateCallback = (userId: string, omikujiRecords: Record<string, number>) => void

/**
 * ユーザーの訪問回数と抽選制限を管理するクラス
 * OmikenCommentTypeのomikujiRecordsフィールドへの後入れ更新に対応
 */
export class UserVisitManager {
  private static instance: UserVisitManager | null = null
  private readonly userVisits = new Map<string, UserVisitRecord>()
  private readonly sessionId: string
  private updateCallbacks: OmikujiRecordsUpdateCallback[] = []

  private constructor() {
    this.sessionId = this.generateSessionId()
  }

  // シングルトンパターン
  public static getInstance(): UserVisitManager {
    if (!UserVisitManager.instance) {
      UserVisitManager.instance = new UserVisitManager()
    }
    return UserVisitManager.instance
  }

  /**
   * 配信セッション用の一意IDを生成
   */
  private generateSessionId(): string {
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    return `session_${timestamp}_${randomSuffix}`
  }

  getSessionId(): string {
    return this.sessionId
  }

  /**
   * omikujiRecords更新用のコールバックを登録
   */
  registerUpdateCallback(callback: OmikujiRecordsUpdateCallback): void {
    this.updateCallbacks.push(callback)
  }

  /**
   * 登録されたコールバックをクリア
   */
  clearUpdateCallbacks(): void {
    this.updateCallbacks = []
  }

  /**
   * セッションをリセット（新しい配信開始時などに使用）
   */
  resetSession(): void {
    this.userVisits.clear()
    this.updateCallbacks = []
  }

  /**
   * ユーザーの訪問を記録し、コールバックを通じてomikujiRecordsを更新
   */
  recordVisit(ruleId: string, user: UserNameType): void {
    const { userId, name, timestamp } = user

    const key = this.createKey(userId, ruleId)
    const existingRecord = this.userVisits.get(key)

    if (existingRecord) {
      existingRecord.name = name // 名前変更に対応
      existingRecord.visitCount++
      existingRecord.timestamp = timestamp
    } else {
      this.userVisits.set(key, {
        ...user,
        ruleId,
        visitCount: 1,
      })
    }

    // コールバックを実行してomikujiRecordsを更新
    const omikujiRecords = this.getOmikujiRecords(userId)
    this.notifyUpdate(userId, omikujiRecords)
  }

  /**
   * 登録されたコールバックに更新を通知
   */
  private notifyUpdate(userId: string, omikujiRecords: Record<string, number>): void {
    for (const callback of this.updateCallbacks) {
      try {
        callback(userId, omikujiRecords)
      } catch (error) {
        console.error('UserVisitManager: コールバック実行エラー', error)
      }
    }
  }

  /**
   * 指定ユーザーのomikujiRecordsを生成
   * OmikenCommentTypeのomikujiRecordsフィールドに直接セット可能
   */
  getOmikujiRecords(userId: string): Record<string, number> {
    const records: Record<string, number> = {}

    for (const [key, record] of this.userVisits.entries()) {
      if (record.userId === userId) {
        records[record.ruleId] = record.visitCount
      }
    }

    return records
  }

  /**
   * 指定ユーザー・ルールの訪問回数を取得
   */
  getVisitCount(userId: string, ruleId: string): number {
    const record = this.userVisits.get(this.createKey(userId, ruleId))
    return record?.visitCount ?? 0
  }

  /**
   * 指定ユーザー・ルールの訪問記録を取得
   */
  getVisitRecord(userId: string, ruleId: string): UserVisitRecord | null {
    return this.userVisits.get(this.createKey(userId, ruleId)) ?? null
  }

  /**
   * 抽選回数制限チェック
   */
  isDrawLimitExceeded(userId: string, ruleId: string, drawLimit: number): boolean {
    if (drawLimit <= 0) return false
    return this.getVisitCount(userId, ruleId) >= drawLimit
  }

  /**
   * 全訪問記録をruleId別にグループ化して取得
   */
  getVisitsByRule(): Record<string, UserVisitRecord[]> {
    const result: Record<string, UserVisitRecord[]> = {}

    for (const record of this.userVisits.values()) {
      if (!result[record.ruleId]) {
        result[record.ruleId] = []
      }
      result[record.ruleId].push(record)
    }

    return result
  }

  /**
   * 指定ルールの訪問記録一覧を取得
   */
  getVisitsByRuleId(ruleId: string): UserVisitRecord[] {
    return Array.from(this.userVisits.values()).filter((record) => record.ruleId === ruleId)
  }

  /**
   * 指定ルールの総訪問回数を取得
   */
  getTotalVisitsByRuleId(ruleId: string): number {
    return Array.from(this.userVisits.values())
      .filter((record) => record.ruleId === ruleId)
      .reduce((total, record) => total + record.visitCount, 0)
  }

  /**
   * 指定ルールの最新訪問ユーザーを取得
   */
  getLatestVisitorByRuleId(ruleId: string): UserVisitRecord | null {
    const records = Array.from(this.userVisits.values())
      .filter((r) => r.ruleId === ruleId)
      .sort((a, b) => b.timestamp - a.timestamp)

    return records[0] ?? null
  }

  /**
   * 指定ルールの訪問者数（ユニークユーザー数）を取得
   */
  getUniqueVisitorCountByRuleId(ruleId: string): number {
    return Array.from(this.userVisits.values()).filter((record) => record.ruleId === ruleId).length
  }

  /**
   * 指定ルールの訪問回数でソートしたランキングを取得
   */
  getRankingByRuleId(ruleId: string, limit?: number): UserVisitRecord[] {
    const ranking = Array.from(this.userVisits.values())
      .filter((record) => record.ruleId === ruleId)
      .sort((a, b) => b.visitCount - a.visitCount)

    return limit ? ranking.slice(0, limit) : ranking
  }

  /**
   * 指定ユーザー・ルールの記録を削除
   */
  resetUserVisit(userId: string, ruleId: string): void {
    this.userVisits.delete(this.createKey(userId, ruleId))
    // リセット後の状態を通知
    const omikujiRecords = this.getOmikujiRecords(userId)
    this.notifyUpdate(userId, omikujiRecords)
  }

  /**
   * 指定ルールの記録を全削除
   */
  resetRuleVisits(ruleId: string): void {
    const affectedUsers = new Set<string>()

    for (const key of this.userVisits.keys()) {
      if (key.endsWith(`:${ruleId}`)) {
        const record = this.userVisits.get(key)
        if (record) {
          affectedUsers.add(record.userId)
        }
        this.userVisits.delete(key)
      }
    }

    // 影響を受けたユーザーに通知
    for (const userId of affectedUsers) {
      const omikujiRecords = this.getOmikujiRecords(userId)
      this.notifyUpdate(userId, omikujiRecords)
    }
  }

  /**
   * 全ての訪問記録をクリア
   */
  resetAllVisits(): void {
    this.userVisits.clear()
  }

  /**
   * 統計情報を取得（デバッグ・分析用）
   */
  getStatistics(ruleId?: string): {
    totalRecords: number
    totalVisits: number
    uniqueUsers: number
    averageVisitsPerUser: number
  } {
    const records = ruleId
      ? Array.from(this.userVisits.values()).filter((r) => r.ruleId === ruleId)
      : Array.from(this.userVisits.values())

    const totalVisits = records.reduce((sum, r) => sum + r.visitCount, 0)
    const uniqueUsers = records.length

    return {
      totalRecords: records.length,
      totalVisits,
      uniqueUsers,
      averageVisitsPerUser: uniqueUsers > 0 ? totalVisits / uniqueUsers : 0,
    }
  }

  /**
   * userId:ruleIdの複合キーを作成
   */
  private createKey(userId: string, ruleId: string): string {
    return `${userId}:${ruleId}`
  }
}
