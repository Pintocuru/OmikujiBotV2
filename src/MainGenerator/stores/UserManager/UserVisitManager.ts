// src/MainGenerator/stores/UserManager/UserVisitManager.ts
import { UserVisitRecord } from '@/types'
import { UserNameType } from '@shared/types'

type VisitEventListener = (record: UserVisitRecord) => void

/**
 * ruleId 単位のユーザー訪問回数と抽選制限を管理するクラス
 */
export class UserVisitManager {
  private readonly visits = new Map<string, UserVisitRecord>() // key: userId:ruleId
  private readonly listeners = new Map<string, Set<VisitEventListener>>() // ruleId別

  /** 訪問を記録してリスナーに通知 */
  record(eventKey: string, user: UserNameType): UserVisitRecord {
    const { userId, userName, timestamp } = user
    const key = this.createKey(userId, eventKey)
    const existing = this.visits.get(key)

    const record: UserVisitRecord = existing
      ? { ...existing, userName, timestamp, visitCount: existing.visitCount + 1 }
      : { ...user, ruleId: eventKey, visitCount: 1 }

    this.visits.set(key, record)
    this.notifyListeners(eventKey, record)
    return record
  }

  /** 指定ユーザー・ルールの訪問回数を取得 */
  getCount(eventKey: string, ruleId: string): number {
    return this.visits.get(this.createKey(eventKey, ruleId))?.visitCount ?? 0
  }

  /** 指定ユーザー・ルールの訪問記録を取得 */
  getRecord(eventKey: string, ruleId: string): UserVisitRecord | null {
    return this.visits.get(this.createKey(eventKey, ruleId)) ?? null
  }

  /** 抽選回数制限チェック */
  isDrawLimitExceeded(eventKey: string, ruleId: string, drawLimit: number): boolean {
    if (drawLimit <= 0) return false
    return this.getCount(eventKey, ruleId) >= drawLimit
  }

  /** 指定ルールの訪問記録一覧を取得 */
  getByRuleId(eventKey: string): UserVisitRecord[] {
    return Array.from(this.visits.values()).filter((r) => r.ruleId === eventKey)
  }

  /** 指定ルールのユニーク訪問者数 */
  getUniqueCountByRuleId(eventKey: string): number {
    return this.getByRuleId(eventKey).length
  }

  /** 指定ルールの総訪問回数 */
  getTotalByRuleId(eventKey: string): number {
    return this.getByRuleId(eventKey).reduce((sum, r) => sum + r.visitCount, 0)
  }

  /** 指定ルールの最新訪問ユーザーを取得 */
  getLatestByRuleId(eventKey: string): UserVisitRecord | null {
    return this.getByRuleId(eventKey).sort((a, b) => b.timestamp - a.timestamp)[0] ?? null
  }

  /** 指定ルールの訪問回数ランキングを取得 */
  getRankingByRuleId(eventKey: string, limit?: number): UserVisitRecord[] {
    const sorted = this.getByRuleId(eventKey).sort((a, b) => b.visitCount - a.visitCount)
    return limit ? sorted.slice(0, limit) : sorted
  }

  /**
   * 指定ルールからランダムに当選者を選出
   * @param count 当選者数（最大9）
   * @param eventKey 対象ルールID
   */
  drawWinners(eventKey: string, count = 1): { commenter: number; winners: UserVisitRecord[] } {
    const commenter = this.getUniqueCountByRuleId(eventKey)
    const userList = this.getByRuleId(eventKey)

    if (userList.length === 0) return { commenter, winners: [] }

    // Fisher–Yates シャッフル
    const shuffled = [...userList]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    const winners = shuffled.slice(0, Math.min(count, 9))
    return { commenter, winners }
  }

  /**
   * 指定ユーザーの全ルール訪問記録を Record<eventKey, visitCount> 形式で取得
   * OmikenCommentType.omikujiRecords に直接セット可能
   */
  getOmikujiRecords(userId: string): Record<string, number> {
    const records: Record<string, number> = {}
    for (const record of this.visits.values()) {
      if (record.userId === userId) records[record.ruleId] = record.visitCount
    }
    return records
  }

  /** 全訪問記録をruleId別にグループ化して取得 */
  getGroupedByRule(): Record<string, UserVisitRecord[]> {
    const result: Record<string, UserVisitRecord[]> = {}
    for (const record of this.visits.values()) {
      if (!result[record.ruleId]) result[record.ruleId] = []
      result[record.ruleId].push(record)
    }
    return result
  }

  /** 統計情報（デバッグ・分析用） */
  getStatistics(eventKey?: string): {
    totalRecords: number
    totalVisits: number
    uniqueUsers: number
    averageVisitsPerUser: number
  } {
    const records = eventKey ? this.getByRuleId(eventKey) : Array.from(this.visits.values())
    const totalVisits = records.reduce((sum, r) => sum + r.visitCount, 0)
    const uniqueUsers = records.length
    return {
      totalRecords: records.length,
      totalVisits,
      uniqueUsers,
      averageVisitsPerUser: uniqueUsers > 0 ? totalVisits / uniqueUsers : 0,
    }
  }

  /** 指定ユーザー・ルールの記録を削除 */
  resetUser(userId: string, ruleId: string): void {
    this.visits.delete(this.createKey(userId, ruleId))
  }

  /** 指定ルールの記録を全削除 */
  resetRule(eventKey: string): void {
    for (const key of this.visits.keys()) {
      if (key.endsWith(`:${eventKey}`)) this.visits.delete(key)
    }
  }

  /** 全訪問記録をクリア */
  resetAll(): void {
    this.visits.clear()
  }

  /** イベントリスナーを登録（解除用関数を返す） */
  onVisit(eventKey: string, listener: VisitEventListener): () => void {
    if (!this.listeners.has(eventKey)) this.listeners.set(eventKey, new Set())
    this.listeners.get(eventKey)!.add(listener)
    return () => this.listeners.get(eventKey)?.delete(listener)
  }

  private notifyListeners(eventKey: string, record: UserVisitRecord): void {
    this.listeners.get(eventKey)?.forEach((l) => l(record))
  }

  private createKey(userId: string, ruleId: string): string {
    return `${userId}:${ruleId}`
  }
}
