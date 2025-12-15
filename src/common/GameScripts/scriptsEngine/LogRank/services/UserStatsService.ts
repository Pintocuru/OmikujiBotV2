// src/common/GameScripts/scriptsEngine/LogRank/services/UserStatsService.ts
import { UserStatsType, UserStatsTypeSchema } from '@/types'
import { GameContext, isPointMode } from '../types'

/**
 * ユーザー統計を更新
 */
export const updateUserStats = (context: GameContext): Record<string, UserStatsType> => {
  return isPointMode(context.params) ? updatePointModeStats(context) : updateWinnerModeStats(context)
}

/**
 * ポイントモード: 1ゲーム単位の記録を追加
 */
const updatePointModeStats = (context: GameContext): Record<string, UserStatsType> => {
  const { gameState, params } = context
  const { getPoint, itemValue1, itemValue2, itemValue3 } = params

  gameState.userRecords ??= {}
  gameState.userRecords[params.userId] ??= []

  const records = gameState.userRecords[params.userId]

  // 新規レコード作成
  const newRecord = UserStatsTypeSchema.parse({
    userId: params.userId,
    name: params.name,
    draws: 1,
    wins: 0,
    points: getPoint,
    totalPoints: getPoint,
    ...(itemValue1 && { itemValue1 }),
    ...(itemValue2 && { itemValue2 }),
    ...(itemValue3 && { itemValue3 }),
  })

  records.push(newRecord)

  // 集計データ作成
  const totalPoints = records.reduce((sum, r) => sum + (r.points ?? 0), 0)

  const aggregatedStats: UserStatsType = {
    userId: params.userId,
    name: params.name,
    draws: records.length,
    wins: 0,
    points: getPoint,
    totalPoints,
    rank: 0,
    rate: 0,
    ...(itemValue1 && { itemValue1 }),
    ...(itemValue2 && { itemValue2 }),
    ...(itemValue3 && { itemValue3 }),
  }

  return {
    ...gameState.userStats,
    [params.userId]: aggregatedStats,
  }
}

/**
 * 勝数モード: ユーザー単位の集計を更新
 */
const updateWinnerModeStats = (context: GameContext): Record<string, UserStatsType> => {
  const { gameState, params } = context
  const { isWin, getPoint, itemValue1, itemValue2, itemValue3 } = params

  // 既存統計を取得または初期化
  const current =
    gameState.userStats[params.userId] ??
    UserStatsTypeSchema.parse({
      userId: params.userId,
      name: params.name,
      draws: 0,
    })

  // 統計を更新
  const updated: UserStatsType = {
    ...current,
    draws: (current.draws || 0) + 1,
    wins: isWin ? (current.wins || 0) + 1 : current.wins,
    points: getPoint > 0 ? (current.points || 0) + getPoint : current.points,
    totalPoints: getPoint > 0 ? (current.totalPoints || 0) + getPoint : current.totalPoints,
    ...(itemValue1 && { itemValue1 }),
    ...(itemValue2 && { itemValue2 }),
    ...(itemValue3 && { itemValue3 }),
  }

  return {
    ...gameState.userStats,
    [params.userId]: updated,
  }
}
