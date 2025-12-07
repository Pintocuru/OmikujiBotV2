// src/execute.ts
// ユーザーの勝敗・ポイント・ランキングを管理するゲームシステム
import { Comment } from '@onecomme.com/onesdk/'
import { GameScript, GameScriptResult } from './GameScript'
import { GameState, GameStateSchema } from '@/types'
import { GameSettings, GameParams, GamePlaceholder, GameSettingsSchema, GameParamsSchema } from './params'

// Services
import { UserStatsService } from './services/UserStatsService'
import { RankingService } from './services/RankingService'
import { PlaceholderService } from './services/PlaceholderService'
import { GameContext } from './GameContext'

/**
 * ゲームスクリプトの実装（ジェネリック不使用）
 */
export class ExecuteScript implements GameScript {
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
  run(comment: Comment, params: GameParams): GameScriptResult {
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
      const updatedUserStats = UserStatsService.updateUserStats(context)

      // ゲーム状態を更新
      const updatedGameState = {
        ...context.gameState,
        userStats: updatedUserStats,
      }

      // ランキングを生成
      const updatedContext = { ...context, gameState: updatedGameState }
      const userRankings = RankingService.generateRankings(updatedContext)

      // 上限チェック
      const currentUserStats = updatedUserStats[context.currentUser.userId]
      const isOverLimit = this.settings.enableCount > 0 && (currentUserStats?.draws || 0) > this.settings.enableCount

      if (!isOverLimit) {
        this.gameState = { ...updatedGameState, userRankings }
      }

      // postActionsのみを返す
      return {
        postActions: [],
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

  /**
   * エディター用のサンプル表示
   */
  sampleRun(): GamePlaceholder {
    // デフォルト設定でサンプルコンテキストを作成
    const sampleContext: GameContext = {
      settings: this.settings || {
        rankMode: 'wins',
        enableCount: 5,
      },
      params: {
        isWin: true,
        getPoint: 100,
      },
      gameState: this.gameState || GameStateSchema.parse({ ruleId: 'sample' }),
      currentUser: {
        userId: 'sample-user',
        name: 'サンプルユーザー',
      },
    }

    // サンプルデータでプレースホルダーを生成
    return PlaceholderService.createPlaceholders(sampleContext)
  }

  /**
   * 現在のプレースホルダーを取得（内部用）
   */
  getCurrentPlaceholders(comment: Comment): GamePlaceholder {
    const context: GameContext = {
      settings: this.settings,
      params: { isWin: false, getPoint: 0 }, // ダミー
      gameState: this.gameState,
      currentUser: {
        userId: comment.data.userId,
        name: comment.data.name,
      },
    }

    return PlaceholderService.createPlaceholders(context)
  }
}

// プリセットから利用できるようにインスタンス化してエクスポート
const execute = new ExecuteScript()
export default execute
