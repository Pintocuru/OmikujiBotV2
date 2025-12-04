// src/game.ts
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
  playGame(): GameResult {
    // 複数回試行してベスト結果を探す
    for (let attempt = 1; attempt <= GAME_CONFIG.MAX_ATTEMPTS; attempt++) {
      const boost = this.calculateBoost()
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
  private calculateBoost(): number {
    if (Math.random() < GAME_CONFIG.BOOST_PROBABILITY) {
      const totalWeight = TOTAL_WEIGHT
      return Math.floor((Math.random() * totalWeight * 2) / 3)
    }
    return 0
  }
}
