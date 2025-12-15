// src/common/GameScripts/scriptsEngine/LogRank/services/UserStatsResultService.ts
import { UserStatsType } from '@/types/'
import { GameContext, isPointMode } from '../types'
import { calculateRank } from './RankingService'

/**
 * 返り値用の現在のユーザー統計を作成
 */
export const createCurrentUserStats = (context: GameContext, isOverLimit: boolean): UserStatsType => {
  return isPointMode(context.params)
    ? createPointModeUserStats(context, isOverLimit)
    : createWinnerModeUserStats(context, isOverLimit)
}

/**
 * ポイントモード用のユーザー統計
 */
const createPointModeUserStats = (context: GameContext, isOverLimit: boolean): UserStatsType => {
  const { gameState, params } = context
  const records = gameState.userRecords?.[params.userId] || []

  if (records.length === 0) {
    return createEmptyUserStats(params.userId, params.name, isOverLimit)
  }

  const latest = records[records.length - 1]
  const rank = calculateRank(context, latest)
  const totalPoints = gameState.userStats[params.userId]?.totalPoints ?? 0

  return {
    userId: params.userId,
    name: latest.name,
    draws: records.length,
    wins: latest.wins ?? 0,
    points: latest.points ?? 0,
    totalPoints,
    rank: typeof rank === 'number' ? rank : undefined,
    rate: 0,
    isOverLimit,
    itemValue1: latest.itemValue1,
    itemValue2: latest.itemValue2,
    itemValue3: latest.itemValue3,
  }
}

/**
 * 勝数/勝率モード用のユーザー統計
 */
const createWinnerModeUserStats = (context: GameContext, isOverLimit: boolean): UserStatsType => {
  const { gameState, params } = context
  const stats = gameState.userStats[params.userId]

  if (!stats) {
    return createEmptyUserStats(params.userId, params.name, isOverLimit)
  }

  const draws = stats.draws ?? 0
  const wins = stats.wins ?? 0
  const rank = calculateRank(context, stats)

  return {
    userId: params.userId,
    name: stats.name,
    draws,
    wins,
    points: stats.points ?? 0,
    totalPoints: stats.totalPoints ?? 0,
    rank: typeof rank === 'number' ? rank : undefined,
    rate: draws > 0 ? (wins / draws) * 100 : 0,
    isOverLimit,
    itemValue1: stats.itemValue1,
    itemValue2: stats.itemValue2,
    itemValue3: stats.itemValue3,
  }
}

/**
 * 空のユーザー統計を作成
 */
const createEmptyUserStats = (userId: string, name: string, isOverLimit: boolean): UserStatsType => ({
  userId,
  name,
  draws: 0,
  wins: 0,
  points: 0,
  totalPoints: 0,
  rate: 0,
  isOverLimit,
})
