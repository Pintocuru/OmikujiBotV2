// src/MainGenerator/stores/StreamStats/StreamStatsManager.ts
import { OmikenCommentType } from '@shared/types'

export interface StreamStats {
  liveComments: number
  totalComments: number
  syoken: number
  totalPrice: number
}

/**
 * 配信全体の集計値を管理するクラス（シングルトン）
 */
export class StreamStatsManager {
  private static instance: StreamStatsManager | null = null
  private onReset: (() => void) | null = null

  private liveComments = 0
  private totalPrice = 0
  private syoken = 0
  private totalComments = 0
  private seenUsers = new Set<string>()

  static getInstance(): StreamStatsManager {
    if (!StreamStatsManager.instance) {
      StreamStatsManager.instance = new StreamStatsManager()
    }
    return StreamStatsManager.instance
  }

  /** テスト用：インスタンスをリセット */
  static resetInstance(): void {
    StreamStatsManager.instance = null
  }

  record(omiken: OmikenCommentType): void {
    const { tc, lc } = omiken.meta
    const giftPrice = omiken.giftPrice ?? 0
    const userId = omiken.userId

    if (tc === 1) this.syoken++

    if (!this.seenUsers.has(userId)) {
      this.totalComments += tc
      this.seenUsers.add(userId)
    } else {
      this.totalComments += 1
    }

    this.liveComments = lc
    this.totalPrice += giftPrice
  }

  getStats(): StreamStats {
    return {
      liveComments: this.liveComments,
      syoken: this.syoken,
      totalPrice: this.totalPrice,
      totalComments: this.totalComments,
    }
  }

  setOnReset(callback: (() => void) | null): void {
    this.onReset = callback
  }

  reset(): void {
    this.liveComments = 0
    this.totalPrice = 0
    this.syoken = 0
    this.totalComments = 0
    this.seenUsers.clear()
    this.onReset?.()
  }
}
