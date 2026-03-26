// src/MainGenerator/stores/UserManager/UserVisitManager.ts

import { UserVisitRecord, UserVisitRecordSchema } from '@/types'
import { UserNameType } from '@shared/types'

type UserId = string
type EventKey = string

type VisitEventListener = (record: UserVisitRecord) => void

/**
 * eventKey 単位のユーザー訪問回数と抽選制限を管理するクラス
 */
export class UserVisitManager {
  /**
   * 訪問記録
   * eventKey → userId → record
   */
  private readonly visits = new Map<EventKey, Map<UserId, UserVisitRecord>>()

  /**
   * イベントリスナー（eventKey別）
   */
  private readonly listeners = new Map<EventKey, Set<VisitEventListener>>()

  // =========================
  // 訪問記録
  // =========================

  /**
   * 訪問を記録してリスナーに通知
   */
  record(eventKey: EventKey, user: UserNameType, count = 1): UserVisitRecord {
    const { userId, userName, timestamp } = user

    // eventKey単位のMapを初期化
    if (!this.visits.has(eventKey)) {
      this.visits.set(eventKey, new Map())
    }

    const userMap = this.visits.get(eventKey)!
    const existing = userMap.get(userId)

    const record: UserVisitRecord = existing
      ? UserVisitRecordSchema.parse({
          ...existing,
          userName,
          timestamp,
          visits: existing.visits + 1,
          visitValue: existing.visitValue + count,
        })
      : UserVisitRecordSchema.parse({
          ...user,
          eventKey,
          visits: 1,
          visitValue: count,
        })

    userMap.set(userId, record)
    this.notifyListeners(eventKey, record)

    return record
  }

  /**
   * 指定ユーザー・イベントの訪問回数を取得
   */
  getCount(userId: UserId, eventKey: EventKey): number {
    return this.getRecord(userId, eventKey)?.visits ?? 0
  }

  /**
   * 指定ユーザー・イベントの訪問記録を取得
   */
  getRecord(userId: UserId, eventKey: EventKey): UserVisitRecord | null {
    return this.visits.get(eventKey)?.get(userId) ?? null
  }

  /**
   * 抽選回数制限チェック
   */
  isDrawLimitExceeded(userId: UserId, eventKey: EventKey, drawLimit: number): boolean {
    if (drawLimit <= 0) return false
    return this.getCount(userId, eventKey) >= drawLimit
  }

  // =========================
  // 集計系
  // =========================

  /**
   * 指定イベントの訪問記録一覧を取得
   */
  getByEvent(eventKey: EventKey): UserVisitRecord[] {
    return Array.from(this.visits.get(eventKey)?.values() ?? [])
  }

  /**
   * 指定イベントのユニーク訪問者数
   */
  getUniqueCount(eventKey: EventKey): number {
    return this.visits.get(eventKey)?.size ?? 0
  }

  /**
   * 指定イベントの総訪問回数
   */
  getTotal(eventKey: EventKey): number {
    return this.getByEvent(eventKey).reduce((sum, r) => sum + r.visits, 0)
  }

  /**
   * 指定イベントの最新訪問ユーザーを取得
   */
  getLatest(eventKey: EventKey): UserVisitRecord | null {
    return this.getByEvent(eventKey).sort((a, b) => b.timestamp - a.timestamp)[0] ?? null
  }

  /**
   * 指定イベントの訪問回数ランキングを取得
   */
  getRanking(eventKey: EventKey, limit?: number): UserVisitRecord[] {
    const sorted = this.getByEvent(eventKey).sort((a, b) => b.visits - a.visits)
    return limit ? sorted.slice(0, limit) : sorted
  }

  // =========================
  // 抽選
  // =========================

  /**
   * 指定イベントからランダムに当選者を選出
   * @param count 当選者数（最大9）
   * @param eventKey 対象イベントID
   */
  drawWinners(
    eventKey: EventKey,
    count = 1
  ): {
    commenter: number
    winners: UserVisitRecord[]
  } {
    const userList = this.getByEvent(eventKey)
    const commenter = userList.length

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

  // =========================
  // 外部連携
  // =========================

  /**
   * 指定ユーザーの全イベント訪問記録を Record<eventKey, visitCount> 形式で取得
   * OmikenCommentType.omikujiRecords に直接セット可能
   */
  getOmikujiRecords(userId: UserId): Record<EventKey, number> {
    const records: Record<EventKey, number> = {}

    for (const [eventKey, userMap] of this.visits.entries()) {
      const record = userMap.get(userId)
      if (record) records[eventKey] = record.visits
    }

    return records
  }

  /**
   * 全訪問記録をeventKey別にグループ化して取得
   */
  getGrouped(): Record<EventKey, UserVisitRecord[]> {
    const result: Record<EventKey, UserVisitRecord[]> = {}

    for (const [eventKey, userMap] of this.visits.entries()) {
      result[eventKey] = Array.from(userMap.values())
    }

    return result
  }

  /**
   * 統計情報（デバッグ・分析用）
   */
  getStatistics(eventKey?: EventKey): {
    totalRecords: number
    totalVisits: number
    uniqueUsers: number
    averageVisitsPerUser: number
  } {
    const records = eventKey
      ? this.getByEvent(eventKey)
      : Array.from(this.visits.values()).flatMap((m) => Array.from(m.values()))

    const totalVisits = records.reduce((sum, r) => sum + r.visits, 0)
    const uniqueUsers = records.length

    return {
      totalRecords: records.length,
      totalVisits,
      uniqueUsers,
      averageVisitsPerUser: uniqueUsers > 0 ? totalVisits / uniqueUsers : 0,
    }
  }

  // =========================
  // リセット
  // =========================

  /**
   * 指定ユーザー・イベントの記録を削除
   */
  resetUser(userId: UserId, eventKey: EventKey): void {
    this.visits.get(eventKey)?.delete(userId)
  }

  /**
   * 指定イベントの記録を全削除
   */
  resetEvent(eventKey: EventKey): void {
    console.log('[resetEvent] before', eventKey, this.visits.get(eventKey))
    this.visits.delete(eventKey)
    console.log('[resetEvent] after', eventKey, this.visits.get(eventKey))
  }

  /**
   * 全訪問記録をクリア
   */
  resetAll(): void {
    this.visits.clear()
  }

  // =========================
  // リスナー
  // =========================

  /**
   * イベントリスナーを登録（解除用関数を返す）
   */
  onVisit(eventKey: EventKey, listener: VisitEventListener): () => void {
    if (!this.listeners.has(eventKey)) {
      this.listeners.set(eventKey, new Set())
    }

    this.listeners.get(eventKey)!.add(listener)

    return () => this.listeners.get(eventKey)?.delete(listener)
  }

  private notifyListeners(eventKey: EventKey, record: UserVisitRecord): void {
    this.listeners.get(eventKey)?.forEach((l) => l(record))
  }
}
