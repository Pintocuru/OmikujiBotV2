// src/GameScripts/scriptsEngine/LogRank/execute.ts
import { GameStateType, GameStateSchema, GameLogType, UserStatsType } from '@/types/GameScript/'
import { GameParams, GameParamsSchema } from './types'
import { updateUserStats, createGameRecord } from './services/UserStatsService'
import { createPostActions } from './services/MessageService'
import { PostFlowType } from '@/types'

// ゲーム実行結果
interface GameResult {
  gameLog: GameLogType
  userStats: UserStatsType
  isOverLimit: boolean
  postActions: PostFlowType[]
}

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
      const userId = validatedParams.user.userId

      // 1. 今回の実行記録を作成
      const gameLog = createGameRecord(validatedParams)

      // 2. ユーザーの累計統計を更新
      const updatedUserStats = updateUserStats(params, this.gameState)

      // 3. 上限チェック
      const isOverLimit = checkDrawLimit(validatedParams.maxDraws, updatedUserStats[userId].totalDraws)

      // 4. 上限内の場合のみログに追加
      if (!isOverLimit) this.gameState.logs.push(gameLog)

      // 5. userMapを更新
      this.gameState.userMap = updatedUserStats

      // スコア順位を計算
      const rank = !isOverLimit ? getScoreRank(this.gameState.logs, gameLog.score) : undefined

      // 6. 投稿アクション作成
      const postActions = createPostActions(params, gameLog.score, isOverLimit, rank)

      return {
        gameLog,
        userStats: updatedUserStats[userId],
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
}

/**
 * 試行回数が上限を超えているかチェック
 */
const checkDrawLimit = (maxDraws: number, totalDraws: number): boolean => {
  if (maxDraws <= 0) return false // 0は無制限
  return totalDraws > maxDraws
}

/**
 * スコア順位を計算する（1位始まり）
 * 同スコアは同順位（dense rank）
 */
const getScoreRank = (logs: { score: number }[], targetScore: number): number => {
  // スコアを降順に並べ、重複を除外
  const uniqueScoresDesc = Array.from(new Set(logs.map((l) => l.score))).sort((a, b) => b - a)
  const index = uniqueScoresDesc.findIndex((score) => score === targetScore)

  // 見つからない場合は最下位扱い
  return index === -1 ? uniqueScoresDesc.length : index + 1
}
