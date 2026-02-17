// src/MainGenerator/script/omikujiProcess/UserVisitManager.ts
import { UserStatsRecord, UserVisitRecord } from '@/types/MainGenerator/UserVisits'
import { UserNameType } from '@shared/types/OmikenComment/OmikenCommentSchema'

// 定数 liveComments ユーザーの参加者リスト(commenter)とランダム(winner)用
const BOT_STATS_RULE_ID = 'liveComments'

// イベントリスナーの型定義
type VisitEventListener = (record: UserVisitRecord) => void

/**
 * ユーザーの訪問回数と抽選制限を管理するクラス
 * OmikenCommentTypeのomikujiRecordsフィールドへの後入れ更新に対応
 */
export class UserVisitManager {
  private readonly userStats = new Map<string, UserStatsRecord>() // 全体の訪問情報
  private readonly userVisits = new Map<string, UserVisitRecord>() // ruleId別 訪問情報
  private readonly listeners = new Map<string, Set<VisitEventListener>>() // イベントリスナー（ruleId別）
  private readonly sessionId: string // 配信用id

  constructor() {
    this.sessionId = this.generateSessionId()
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
   * セッションをリセット（新しい配信開始時などに使用）
   */
  resetSession(): void {
    this.userVisits.clear()
  }

  /**
   * ユーザーの訪問を記録し、リスナーに通知
   */
  recordVisit(ruleId: string, user: UserNameType): void {
    const { userId, userName, timestamp } = user

    const key = this.createKey(userId, ruleId)
    const existingRecord = this.userVisits.get(key)

    let record: UserVisitRecord

    if (existingRecord) {
      existingRecord.userName = userName // 名前変更に対応
      existingRecord.visitCount++
      existingRecord.timestamp = timestamp
      record = existingRecord
    } else {
      record = {
        ...user,
        ruleId,
        visitCount: 1,
      }
      this.userVisits.set(key, record)
    }

    // リスナーに通知（新規・既存どちらも）
    this.notifyListeners(ruleId, record)
  }

  /**
   * コメント受取時に呼び出す専用メソッド
   */
  recordLiveComment(user: UserNameType): void {
    this.recordVisit(BOT_STATS_RULE_ID, user)
  }

  /**
   * イベントリスナーを登録
   */
  onVisit(ruleId: string, listener: VisitEventListener): () => void {
    if (!this.listeners.has(ruleId)) {
      this.listeners.set(ruleId, new Set())
    }
    this.listeners.get(ruleId)!.add(listener)

    // 解除用関数を返す
    return () => {
      this.listeners.get(ruleId)?.delete(listener)
    }
  }

  /**
   * リスナーに通知
   */
  private notifyListeners(ruleId: string, record: UserVisitRecord): void {
    const ruleListeners = this.listeners.get(ruleId)
    if (ruleListeners) ruleListeners.forEach((listener) => listener(record))
  }

  // リスナー数とランダムリスナーの呼び出し
  getLiveComment(count = 1, ruleId = BOT_STATS_RULE_ID): { commenter: number; winners: UserVisitRecord[] } {
    const commenter = this.getUniqueVisitorCountByRuleId(ruleId)
    const userList = this.getVisitsByRuleId(ruleId)

    // 0人の場合は "Null" を返す
    if (userList.length === 0) return { commenter, winners: [] }

    // シャッフル（Fisher–Yates）
    const shuffled = [...userList]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // count 人だけ切り出す（最大4人など制限可能）
    const winners = shuffled.slice(0, Math.min(count, 9)).map((u) => u)
    return { commenter, winners }
  }

  /**
   * 指定ユーザーのomikujiRecordsを生成
   * OmikenCommentTypeのomikujiRecordsフィールドに直接セット可能
   */
  getOmikujiRecords(userId: string): Record<string, number> {
    const records: Record<string, number> = {}
    for (const [key, record] of this.userVisits.entries()) {
      if (record.userId === userId) records[record.ruleId] = record.visitCount
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
  getVisitRecord(userId: string, ruleId = BOT_STATS_RULE_ID): UserVisitRecord | null {
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
      if (!result[record.ruleId]) result[record.ruleId] = []
      result[record.ruleId].push(record)
    }
    return result
  }

  /**
   * 指定ルールの訪問記録一覧を取得
   */
  getVisitsByRuleId(ruleId?: string): UserVisitRecord[] {
    const effectiveRuleId = ruleId || BOT_STATS_RULE_ID
    return Array.from(this.userVisits.values()).filter((record) => record.ruleId === effectiveRuleId)
  }

  /**
   * 指定ルールの総訪問回数を取得
   */
  getTotalVisitsByRuleId(ruleId = BOT_STATS_RULE_ID): number {
    return Array.from(this.userVisits.values())
      .filter((record) => record.ruleId === ruleId)
      .reduce((total, record) => total + record.visitCount, 0)
  }

  /**
   * 指定ルールの最新訪問ユーザーを取得
   */
  getLatestVisitorByRuleId(ruleId = BOT_STATS_RULE_ID): UserVisitRecord | null {
    const records = Array.from(this.userVisits.values())
      .filter((r) => r.ruleId === ruleId)
      .sort((a, b) => b.timestamp - a.timestamp)

    return records[0] ?? null
  }

  /**
   * 指定ルールの訪問者数（ユニークユーザー数）を取得
   */
  getUniqueVisitorCountByRuleId(ruleId = BOT_STATS_RULE_ID): number {
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
  }

  /**
   * 指定ルールの記録を全削除
   */
  resetRuleVisits(ruleId: string): void {
    const affectedUsers = new Set<string>()

    for (const key of this.userVisits.keys()) {
      if (key.endsWith(`:${ruleId}`)) {
        const record = this.userVisits.get(key)
        if (record) affectedUsers.add(record.userId)
        this.userVisits.delete(key)
      }
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
