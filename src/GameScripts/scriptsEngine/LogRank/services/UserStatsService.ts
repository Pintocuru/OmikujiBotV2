// src/GameScripts/scriptsEngine/LogRank/services/UserStatsService.ts
import { GameLogSchema, GameLogType, GameStateType, UserStatsSchema, UserStatsType } from '@/types/GameScript/'
import { GameParams } from '../types'

/**
 * 今回の実行記録（GameRecord）を作成
 */
export const createGameRecord = (params: GameParams): GameLogType => {
  const { user, result } = params

  return GameLogSchema.parse({
    userId: user.userId,
    score: result.score,
    ...(result.item && { item: result.item }),
    ...(result.flag && { flag: result.flag }),
  })
}

/**
 * ユーザーの累計統計を更新
 * userMapを更新して返す
 */
export const updateUserStats = (params: GameParams, gameState: GameStateType): Record<string, UserStatsType> => {
  const { user, result } = params

  // 既存統計を取得または初期化
  const current = gameState.userMap[user.userId] || UserStatsSchema.parse({ userId: user.userId })

  // 勝利判定
  const isWin = result.type === 'win'

  // 統計を更新
  const updated: UserStatsType = {
    ...current,
    totalDraws: current.totalDraws + 1,
    totalPoints: current.totalPoints + result.score,
    totalWins: isWin ? current.totalWins + 1 : current.totalWins,
    bestScore: Math.max(current.bestScore, result.score),
  }

  return {
    ...gameState.userMap,
    [user.userId]: updated,
  }
}
