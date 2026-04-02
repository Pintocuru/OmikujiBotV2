// src/MainGenerator/stores/StreamStats/StreamStatsManager.ts
import { OmikenCommentType } from '@shared/types'

export interface StreamStats {
  liveComments: number
  totalComments: number
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
  private totalComments = 0 // 追加

  record(omiken: OmikenCommentType): void {
    const { tc, lc, no } = omiken.meta
    const giftPrice = omiken.giftPrice ?? 0

    // 初見判定
    if (tc === 1) this.syoken++

    // コメント累計（ユニーク考慮）
    if (no === 1) {
      this.totalComments += tc
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
      totalComments: this.totalComments, // 追加
    }
  }

  reset(): void {
    this.liveComments = 0
    this.totalPrice = 0
    this.syoken = 0
    this.totalComments = 0 // 追加
  }
}
