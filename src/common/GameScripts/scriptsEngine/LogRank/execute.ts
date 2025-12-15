// src\common\GameScripts\scriptsEngine\LogRank\execute.ts
// ユーザーの勝敗・ポイント・ランキングを管理するゲームシステム
import { GameState, GameStateSchema } from '@/types'
import { GameSettings, GameParams, GameSettingsSchema, GameParamsSchema, GameContext, GameResult } from './types'
import { updateUserStats } from './services/UserStatsService'
import { generateRankings } from './services/RankingService'
import { createPlaceholders } from './services/PlaceholderService'
import { Comment } from '@onecomme.com/onesdk/'

export class ExecuteScript {
  private settings!: GameSettings
  private gameState!: GameState

  /**
   * 設定を初期化する
   */
  setup(settings: GameSettings, ruleId: string): void {
    this.settings = GameSettingsSchema.parse(settings)
    this.gameState = GameStateSchema.parse({ ruleId })
  }

  /**
   * ゲームを実行する
   */
  run(comment: Comment, characterKey: string, params: GameParams): GameResult {
    try {
      // コンテキストオブジェクトを作成
      const context: GameContext = {
        settings: this.settings,
        params: GameParamsSchema.parse(params),
        gameState: this.gameState,
        currentUser: {
          userId: comment.data.userId,
          name: comment.data.name,
        },
      }

      // ユーザー統計を更新
      const updatedUserStats = updateUserStats(context)

      // ゲーム状態を更新
      const updatedGameState = {
        ...context.gameState,
        userStats: updatedUserStats,
      }

      // ランキングを生成
      const updatedContext = { ...context, gameState: updatedGameState }
      const userRankings = generateRankings(updatedContext)

      // 上限チェック
      const currentUserStats = updatedUserStats[context.currentUser.userId]
      const isOverLimit = this.settings.enableCount > 0 && (currentUserStats?.draws || 0) > this.settings.enableCount

      if (!isOverLimit) {
        this.gameState = { ...updatedGameState, userRankings }
      }

      return {
        placeholder: createPlaceholders(),
        postActions: [
          {
            actionType: 'message',
            delaySeconds: 8,
            characterKey,
            iconKey: 'default',
            message: {
              bubble: '',
            },
          },
        ],
      }
    } catch (error) {
      console.error('Game execution error:', error)
      throw new Error('ゲーム実行中にエラーが発生しました')
    }
  }

  /**
   * ゲームデータを返す
   */
  getGameState(): GameState {
    return this.gameState
  }
}
