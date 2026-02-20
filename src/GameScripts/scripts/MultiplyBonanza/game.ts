// src/GameScripts/scripts/MultiplyBonanza/game.ts
import { GAME_CONFIG, GameResult, TOTAL_WEIGHT } from './gameConfig'
import { ReelGenerator } from './reelGenerator'
import { PayoutCalculator } from './payoutCalculator'
import { MessageFormatter } from './messageFormatter'

export class GameEngine {
  private reelGenerator = new ReelGenerator()
  private payoutCalculator = new PayoutCalculator()
  private messageFormatter = new MessageFormatter()

  /**
   * ゲームを実行してベストな結果を返す
   * 最大試行回数分試行し、配当が出た時点で結果を返す
   */
  playGame(mode: string = ''): GameResult {
    let attempt = 1
    let luckyBoost = false
    if (mode === '風神') {
      attempt = 2
    } else if (mode === '雷神') {
      luckyBoost = true
      attempt = 2
    } else if (mode === '風雷神') {
      attempt = 3
    }

    // 複数回試行してベスト結果を探す
    for (attempt; attempt <= GAME_CONFIG.MAX_ATTEMPTS; attempt++) {
      const boost = this.calculateBoost(luckyBoost)
      const reels = this.reelGenerator.generateReels(attempt, boost)
      const result = this.payoutCalculator.calculateBestResult(reels, attempt)

      if (result.payout > 0) {
        return { ...result, hasBoost: boost > 0 }
      }
    }

    // 配当なしの場合
    const emptyResult = this.payoutCalculator.calculateBestResult([], 0)
    return { ...emptyResult, hasBoost: false }
  }

  /**
   * ゲーム結果からメッセージを生成する
   */
  createMessage(user: string, result: GameResult): string {
    return this.messageFormatter.createMessage(user, result)
  }

  /**
   * ブースト値を計算する（確率でボーナスを付与）
   */
  private calculateBoost(luckyBoost: boolean = false): number {
    const totalWeight = TOTAL_WEIGHT
    if (luckyBoost || Math.random() < GAME_CONFIG.BOOST_PROBABILITY) {
      return Math.floor((Math.random() * totalWeight * 2) / 3)
    }
    return 0
  }
}
