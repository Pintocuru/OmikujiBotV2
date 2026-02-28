// src/MainGenerator/stores/UserManager/UserStatsManager.ts
import { UserStatsRecord } from '@/types'
import { UserNameType } from '@shared/types'

type StatsEventListener = (record: UserStatsRecord) => void

/**
 * 配信全体のユーザー統計を管理するクラス
 * コメント受信のたびに更新され、lastVisit・liveComments を保持する
 */
export class UserStatsManager {
  private readonly stats = new Map<string, UserStatsRecord>()
  private liveComments = 0
  private totalPrice = 0
  private readonly listeners = new Set<StatsEventListener>()
  private syoken = 0

  /** コメントを受け取った時に呼び出す */
  recordComment(user: UserNameType, tc: number, lc: number, giftPrice = 0): UserStatsRecord {
    if (tc === 1) this.syoken++ // 1回目のコメントなら初見さん
    this.liveComments = lc
    this.totalPrice += giftPrice
    const { userId, userName, profileImage, timestamp } = user

    const existing = this.stats.get(userId)
    const record: UserStatsRecord = existing
      ? {
          ...existing,
          timestamp,
          userName,
          profileImage,
          giftPrice: existing.giftPrice + giftPrice,
          lastVisit: timestamp,
        }
      : {
          userId,
          userName,
          profileImage,
          timestamp,
          team: 'error',
          score: 0,
          tags: [],
          badges: [],
          giftPrice,
          lastVisit: timestamp,
        }

    this.stats.set(userId, record)
    this.notifyListeners(record)
    return record
  }

  /** stats からランダムに当選者を選出 */
  drawWinners(count = 1): { commenter: number; winners: UserStatsRecord[] } {
    const commenter = this.stats.size
    const userList = Array.from(this.stats.values())
    if (userList.length === 0) return { commenter, winners: [] }

    const shuffled = [...userList]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return { commenter, winners: shuffled.slice(0, Math.min(count, 9)) }
  }

  // 指定ユーザーの統計を取得
  get(userId: string): UserStatsRecord | null {
    return this.stats.get(userId) ?? null
  }

  // 全ユーザーの統計一覧を取得
  getAll(): UserStatsRecord[] {
    return Array.from(this.stats.values())
  }

  // 配信の累計コメント数
  getLiveComments(): number {
    return this.liveComments
  }

  // 配信の累計ギフト金額
  getTotalPrice(): number {
    return this.totalPrice
  }

  // ユニークユーザー数（コメントしたことがある人）
  getUniqueCount(): number {
    return this.stats.size
  }

  // 初見さんを返す
  getSyoken(): number {
    return this.syoken
  }

  /** 最新コメントユーザーを取得 */
  getLatest(): UserStatsRecord | null {
    return Array.from(this.stats.values()).sort((a, b) => b.lastVisit - a.lastVisit)[0] ?? null
  }

  /** ユーザー統計を部分更新（score・team・tagsなど） */
  update(userId: string, patch: Partial<UserStatsRecord>): UserStatsRecord | null {
    const existing = this.stats.get(userId)
    if (!existing) return null
    const updated = { ...existing, ...patch }
    this.stats.set(userId, updated)
    return updated
  }

  /** セッションリセット */
  reset(): void {
    this.stats.clear()
    this.liveComments = 0
  }

  /** イベントリスナーを登録（解除用関数を返す） */
  onUpdate(listener: StatsEventListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(record: UserStatsRecord): void {
    this.listeners.forEach((l) => l(record))
  }
}
