// src\common\GameScripts\scriptsEngine\LogRank\services\UserStatsService.ts
import { UserStatsType, UserStatsTypeSchema } from '@/types/GameScript/GameScriptSchema'
import { GameContext } from '../types'

export const updateUserStats = (context: GameContext): Record<string, UserStatsType> => {
  return context.settings.rankMode === 'point' ? updatePointModeStats(context) : updateWinnerModeStats(context)
}

/**
 * ポイントモード: 1ゲーム単位の記録
 */
const updatePointModeStats = (context: GameContext): Record<string, UserStatsType> => {
  const { gameState, currentUser, params } = context
  const { getPoint, itemValue1, itemValue2, itemValue3 } = params

  gameState.userRecords ??= {}
  gameState.userRecords[currentUser.userId] ??= []

  const newRecord: UserStatsType = UserStatsTypeSchema.parse({
    userId: currentUser.userId,
    name: currentUser.name,
    draws: 1,
    wins: 0,
    points: getPoint,
    totalPoints: getPoint,
    ...(itemValue1 && { itemValue1 }),
    ...(itemValue2 && { itemValue2 }),
    ...(itemValue3 && { itemValue3 }),
  })

  const records = gameState.userRecords[currentUser.userId]
  records.push(newRecord)

  const updated: UserStatsType = {
    userId: currentUser.userId,
    name: currentUser.name,
    draws: records.length,
    wins: 0,
    points: getPoint,
    totalPoints: records.reduce((sum, r) => sum + (r.points ?? 0), 0),
    rank: 0,
    rate: 0,
    ...(itemValue1 && { itemValue1 }),
    ...(itemValue2 && { itemValue2 }),
    ...(itemValue3 && { itemValue3 }),
  }

  return { ...gameState.userStats, [currentUser.userId]: updated }
}

/**
 * 勝数モード: ユーザー集計
 */
const updateWinnerModeStats = (context: GameContext): Record<string, UserStatsType> => {
  const { gameState, currentUser, params } = context
  const { isWin, getPoint, itemValue1, itemValue2, itemValue3 } = params

  const current =
    gameState.userStats[currentUser.userId] ??
    UserStatsTypeSchema.parse({
      userId: currentUser.userId,
      name: currentUser.name,
      draws: 0,
    })

  const updated: UserStatsType = { ...current }

  if (getPoint > 0) {
    updated.points = (updated.points || 0) + getPoint
    updated.totalPoints = (updated.totalPoints || 0) + getPoint
  }

  if (isWin) updated.wins = (updated.wins || 0) + 1
  updated.draws = (updated.draws || 0) + 1

  if (itemValue1) updated.itemValue1 = itemValue1
  if (itemValue2) updated.itemValue2 = itemValue2
  if (itemValue3) updated.itemValue3 = itemValue3

  return { ...gameState.userStats, [currentUser.userId]: updated }
}
