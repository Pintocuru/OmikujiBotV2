// src/common/GameScripts/scriptsEngine/LogRank/execute.ts
import { GameStateType, GameStateSchema, UserStatsType } from './GameScriptSchema'
import { GameParams, GameParamsSchema, GameContext, GameResult } from './types'
import { updateUserStats, createGameRecord } from './services/UserStatsService'
import { createPostActions } from './services/MessageService'
import { getScoreRank } from './services/RankingService'

export class LogRankScript {
  private gameState!: GameStateType

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

      // 1. 今回の実行記録を作成
      const currentRecord = createGameRecord(context)

      // 2. ユーザーの累計統計を更新
      const updatedUserStats = updateUserStats(context)

      // 3. 上限チェック
      const isOverLimit = this.checkDrawLimit(validatedParams.maxDrawsPerUser, updatedUserStats[validatedParams.userId])

      // 4. 上限内の場合のみログに追加
      if (!isOverLimit) {
        this.gameState.logs.push(currentRecord)
      }

      // 5. userMapを更新
      this.gameState.userMap = updatedUserStats

      // ランク生成
      const rank = isOverLimit ? undefined : getScoreRank(this.gameState.logs, currentRecord.score)

      // 6. 投稿アクション作成

      const finalUserStats = updatedUserStats[validatedParams.userId]
      const postActions = createPostActions(params.characterKey, finalUserStats, currentRecord, isOverLimit, rank)

      return {
        currentRecord,
        currentUserStats: finalUserStats,
        isOverLimit,
        postActions,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラー'
      console.error('Game execution error:', errorMessage, error)
      throw new Error(`ゲーム実行中にエラーが発生しました: ${errorMessage}`)
    }
  }

  /**
   * ゲームデータを返す
   */
  getGameState(): GameStateType {
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
  private checkDrawLimit(maxDraws: number, userStats: UserStatsType): boolean {
    if (maxDraws <= 0) return false // 0は無制限
    return userStats.totalDraws > maxDraws
  }
}
