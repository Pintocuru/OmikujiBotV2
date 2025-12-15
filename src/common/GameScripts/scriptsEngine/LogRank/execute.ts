// src/common/GameScripts/scriptsEngine/LogRank/execute.ts
import { GameState, GameStateSchema, UserStatsType } from '@/types'
import { GameParams, GameParamsSchema, GameContext, GameResult } from './types'
import { updateUserStats } from './services/UserStatsService'
import { generateRankings } from './services/RankingService'
import { createCurrentUserStats } from './services/UserStatsResultService'
import { createPostActions } from './services/MessageService'

export class LogRankScript {
  private gameState!: GameState

  /**
   * 設定を初期化する
   */
  setup(ruleId: string): void {
    this.gameState = GameStateSchema.parse({ ruleId })
  }

  /**
   * ゲームを実行する
   */
  run(params: GameParams): GameResult {
    try {
      const validatedParams = GameParamsSchema.parse(params)
      const context = this.createContext(validatedParams)

      // ユーザー統計を更新
      const updatedUserStats = updateUserStats(context)
      const updatedGameState = {
        ...context.gameState,
        userStats: updatedUserStats,
      }

      // 上限チェック
      const isOverLimit = this.checkDrawLimit(validatedParams.enableCount, updatedUserStats[context.params.userId])

      // 上限内の場合のみランキング更新
      if (!isOverLimit) {
        const updatedContext = { ...context, gameState: updatedGameState }
        const userRankings = generateRankings(updatedContext)
        this.gameState = { ...updatedGameState, userRankings }
      } else {
        this.gameState = updatedGameState
      }

      // 現在のユーザー統計と投稿アクションを作成
      const finalContext = { ...context, gameState: this.gameState }
      const currentUserStats = createCurrentUserStats(finalContext, isOverLimit)
      const postActions = createPostActions(params.characterKey, currentUserStats)

      return { currentUserStats, postActions }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラー'
      console.error('Game execution error:', errorMessage, error)
      throw new Error(`ゲーム実行中にエラーが発生しました: ${errorMessage}`)
    }
  }

  /**
   * ゲームデータを返す
   */
  getGameState(): GameState {
    return this.gameState
  }

  /**
   * コンテキストを作成
   */
  private createContext(params: GameParams): GameContext {
    return {
      params,
      gameState: this.gameState,
    }
  }

  /**
   * 試行回数が上限を超えているかチェック
   */
  private checkDrawLimit(enableCount: number, userStats: UserStatsType): boolean {
    if (enableCount <= 0) return false
    const draws = userStats?.draws ?? 0
    return draws > enableCount
  }
}
