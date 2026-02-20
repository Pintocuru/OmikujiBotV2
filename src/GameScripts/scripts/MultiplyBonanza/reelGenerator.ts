// src/GameScripts/scripts/MultiplyBonanza/reelGenerator.ts
import { GAME_CONFIG, SYMBOLS, TOTAL_WEIGHT } from './gameConfig'

/**
 * リール生成を管理するクラス
 */
export class ReelGenerator {
  /**
   * 全リールを生成する
   * 試行回数に応じてシンボル数と倍率が増加
   */
  generateReels(attempt: number, boost: number): number[][] {
    return Array.from({ length: GAME_CONFIG.REEL_COUNT }, () => this.generateSingleReel(attempt, boost))
  }

  /**
   * 単一のリールを生成する
   */
  private generateSingleReel(attempt: number, boost: number): number[] {
    const symbolCounts = new Array(SYMBOLS.length).fill(0)
    const maxSymbolsPerReel =
      GAME_CONFIG.BASE_SYMBOLS_PER_REEL + attempt * attempt * GAME_CONFIG.ATTEMPT_MULTIPLIER_SYMBOLS
    const numSymbols = Math.floor(Math.random() * maxSymbolsPerReel) + 1
    const multiplier = Math.max(
      Math.floor(Math.random() * attempt * GAME_CONFIG.MAX_MULTIPLIER_FACTOR),
      GAME_CONFIG.MIN_MULTIPLIER
    )

    for (let i = 0; i < numSymbols; i++) {
      const selectedSymbolIdx = this.selectSymbolByWeight(boost)
      symbolCounts[selectedSymbolIdx] += multiplier
    }

    return symbolCounts
  }

  /**
   * 重み付けでシンボルを選択する
   * ブースト値分だけ高レアリティが出やすくなる
   */
  private selectSymbolByWeight(boost: number): number {
    let randomValue = Math.floor(Math.random() * (TOTAL_WEIGHT - boost)) + boost

    for (let symbolIdx = 0; symbolIdx < SYMBOLS.length; symbolIdx++) {
      randomValue -= SYMBOLS[symbolIdx].weight
      if (randomValue < 0) {
        return symbolIdx
      }
    }

    return SYMBOLS.length - 1 // フォールバック
  }
}
