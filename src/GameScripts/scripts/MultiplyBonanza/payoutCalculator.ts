// src/GameScripts/scripts/MultiplyBonanza/payoutCalculator.ts
import { GAME_CONFIG, SYMBOLS, GameResult } from './gameConfig'

/**
 * 配当計算を管理するクラス
 */
export class PayoutCalculator {
  /**
   * リールから最適な結果を計算する
   * 全シンボルについて配当を計算し、最高配当を返す
   */
  calculateBestResult(reels: number[][], attempt: number): Omit<GameResult, 'hasBoost'> {
    let bestResult = this.createEmptyResult()

    for (let symbolIdx = 0; symbolIdx < SYMBOLS.length; symbolIdx++) {
      const ways = this.calculateWays(reels, symbolIdx)

      if (ways.length < GAME_CONFIG.MIN_REELS_FOR_WIN) {
        continue
      }

      const payout = this.calculatePayout(symbolIdx, ways)

      if (payout > bestResult.payout) {
        bestResult = {
          symbolIdx,
          symbol: this.generateSymbolDisplay(symbolIdx, attempt),
          attempt,
          party: SYMBOLS[symbolIdx].party,
          name: SYMBOLS[symbolIdx].name,
          ways,
          payout,
          hasBoost: false,
        }
      }
    }

    return bestResult
  }

  /**
   * 指定シンボルのウェイ数を計算する
   * 最初の3リールに必須、連続するリール数をカウント
   */
  private calculateWays(reels: number[][], symbolIdx: number): number[] {
    const ways: number[] = []

    // 最初の3リールに必要
    if (!reels[0][symbolIdx] || !reels[1][symbolIdx] || !reels[2][symbolIdx]) {
      return ways
    }

    // 連続するリール数を計算
    for (let reelIdx = 0; reelIdx < reels.length && reels[reelIdx][symbolIdx]; reelIdx++) {
      ways.push(reels[reelIdx][symbolIdx])
    }

    return ways
  }

  /**
   * 配当を計算する（基本配当 × ライン数）
   * 上限額で制限される
   */
  private calculatePayout(symbolIdx: number, ways: number[]): number {
    const symbol = SYMBOLS[symbolIdx]
    const payoutIdx = Math.min(ways.length - GAME_CONFIG.MIN_REELS_FOR_WIN, symbol.payouts.length - 1)
    const basePayout = symbol.payouts[payoutIdx]
    const totalLines = ways.reduce((total, lineCount) => total * lineCount, 1)

    return Math.min(Math.floor(basePayout * totalLines), GAME_CONFIG.MAX_WIN)
  }

  /**
   * シンボル表示を生成する（試行回数分繰り返し）
   */
  private generateSymbolDisplay(symbolIdx: number, attempt: number): string {
    return SYMBOLS[symbolIdx].icon.repeat(attempt)
  }

  /**
   * 空の結果を作成する（配当なしの場合）
   */
  private createEmptyResult(): GameResult {
    return {
      symbolIdx: 0,
      symbol: '',
      attempt: 0,
      party: 'MultiplyBonanzaZugara10',
      name: '',
      ways: [],
      payout: 0,
      hasBoost: false,
    }
  }
}
