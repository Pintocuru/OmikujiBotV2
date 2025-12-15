// src\common\GameScripts\scriptsEngine\LogRank\services\RankingService.ts
import { GameContext } from '../types'
import { UserStatsType } from '@/types/'

export const generateRankings = (context: GameContext): UserStatsType[] => {
  const { settings } = context
  return settings.rankMode === 'point' ? generatePointModeRankings(context) : generateWinnerModeRankings(context)
}

const generatePointModeRankings = (context: GameContext): UserStatsType[] => {
  const { gameState, currentUser } = context
  const allRecords: UserStatsType[] = []

  if (gameState.userRecords) {
    Object.values(gameState.userRecords).forEach((records) => {
      allRecords.push(...records)
    })
  }

  const sorted = allRecords
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  const currentUserRecords = gameState.userRecords?.[currentUser.userId] || []
  if (currentUserRecords.length > 0) {
    const latest = currentUserRecords[currentUserRecords.length - 1]
    const index = sorted.findIndex((e) => e.userId === currentUser.userId && e.points === latest.points)
    if (index !== -1) {
      const [entry] = sorted.splice(index, 1)
      sorted.unshift(entry)
    }
  }

  return sorted
}

const generateWinnerModeRankings = (context: GameContext): UserStatsType[] => {
  const { currentUser, settings } = context
  const entries = createRankingEntries(context)
  const sortKey = settings.rankMode === 'rate' ? 'rate' : 'wins'

  const sorted = entries
    .sort((a, b) => (b[sortKey] ?? 0) - (a[sortKey] ?? 0))
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  const index = sorted.findIndex((e) => e.userId === currentUser.userId)
  if (index > 0) {
    const [entry] = sorted.splice(index, 1)
    sorted.unshift(entry)
  }

  return sorted
}

const createRankingEntries = (context: GameContext): UserStatsType[] => {
  const { gameState } = context
  const previous = gameState.userRankings || []

  return Object.entries(gameState.userStats).map(([uid, stats]) => {
    const prev = previous.find((e) => e.userId === uid)
    const draws = stats.draws ?? prev?.draws ?? 0
    const wins = stats.wins ?? prev?.wins ?? 0

    return {
      userId: uid,
      name: stats.name || 'Unknown',
      draws,
      wins,
      points: stats.points ?? prev?.points ?? 0,
      totalPoints: stats.totalPoints ?? prev?.totalPoints ?? 0,
      rank: stats.rank ?? prev?.rank ?? 0,
      rate: draws > 0 ? (wins / draws) * 100 : 0,
    }
  })
}

export const calculateRank = (context: GameContext, userStats?: UserStatsType): number | 'ランキング外' => {
  const { gameState, currentUser, settings } = context
  const rankings = gameState.userRankings || []
  const target = userStats || gameState.userStats[currentUser.userId]

  if (!target) return 'ランキング外'

  if (settings.rankMode === 'point') {
    const points = target.points ?? 0
    return rankings.filter((r) => (r.points ?? 0) > points).length + 1
  }

  const index = rankings.findIndex((r) => r.userId === target.userId)
  return index >= 0 ? index + 1 : 'ランキング外'
}
