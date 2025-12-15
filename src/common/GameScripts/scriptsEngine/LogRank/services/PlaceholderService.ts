// src\common\GameScripts\scriptsEngine\LogRank\services\PlaceholderService.ts
import { GamePlaceholder, GamePlaceholderSchema, GameContext } from '../types'
import { calculateRank } from './RankingService'

export const createPlaceholders = (context: GameContext): GamePlaceholder => {
  const { settings, gameState, currentUser } = context
  const userStats = gameState.userStats[currentUser.userId]

  const draws = userStats?.draws ?? 0
  const isOverLimit = settings.enableCount > 0 && draws > settings.enableCount

  return settings.rankMode === 'point'
    ? createPointModePlaceholders(context, isOverLimit)
    : createWinnerModePlaceholders(context, isOverLimit)
}

const createPointModePlaceholders = (context: GameContext, isOverLimit: boolean): GamePlaceholder => {
  const { gameState, currentUser } = context
  const records = gameState.userRecords?.[currentUser.userId] || []
  const latest = records[records.length - 1]

  if (!latest) {
    return GamePlaceholderSchema.parse({})
  }

  const rank = calculateRank(context, latest)

  return {
    announceMessage: isOverLimit
      ? `${latest.name}さんは上限を超えているから、参考記録だよ。`
      : `${latest.name}さんの${latest.points}は、${rank}位だよ。`,
    winsCount: latest.wins ?? 0,
    winsRank: rank,
    winsRate: '0.0',
    totalDraws: records.length,
    totalPoints: gameState.userStats[currentUser.userId]?.totalPoints ?? 0,
  }
}

const createWinnerModePlaceholders = (context: GameContext, isOverLimit: boolean): GamePlaceholder => {
  const { gameState, currentUser } = context
  const stats = gameState.userStats[currentUser.userId]

  const draws = stats?.draws ?? 0
  const rank = calculateRank(context, stats)
  const winRate = draws > 0 ? (((stats?.wins || 0) / draws) * 100).toFixed(1) : '0.0'

  return {
    announceMessage: isOverLimit
      ? `${stats?.name}さんは上限を超えているから、参考記録だよ。`
      : `${stats?.name}さんの順位は、${rank}位だよ。`,
    winsCount: stats?.wins ?? 0,
    winsRank: rank,
    winsRate: winRate,
    totalDraws: draws,
    totalPoints: stats?.totalPoints ?? 0,
  }
}
