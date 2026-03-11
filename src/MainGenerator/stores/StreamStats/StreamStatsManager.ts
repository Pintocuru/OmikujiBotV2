// src/MainGenerator/stores/StreamStats/StreamStatsManager.ts
import { OmikenCommentType } from '@shared/types'

export interface StreamStats {
  liveComments: number
  syoken: number
  totalPrice: number
}

/**
 * 配信全体の集計値を管理するクラス
 */
export class StreamStatsManager {
  private liveComments = 0
  private totalPrice = 0
  private syoken = 0

  record(omiken: OmikenCommentType): void {
    const { tc, lc } = omiken.meta
    const giftPrice = omiken.giftPrice ?? 0

    if (tc === 1) this.syoken++
    this.liveComments = lc
    this.totalPrice += giftPrice
  }

  getStats(): StreamStats {
    return {
      liveComments: this.liveComments,
      syoken: this.syoken,
      totalPrice: this.totalPrice,
    }
  }

  reset(): void {
    this.liveComments = 0
    this.totalPrice = 0
    this.syoken = 0
  }
}
