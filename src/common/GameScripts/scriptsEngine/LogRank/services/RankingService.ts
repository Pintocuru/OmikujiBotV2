// src/services/RankingService.ts
import { GameContext } from '../GameContext'
import { UserStatsType } from '@/types/'

export class RankingService {
  // 引数を簡素化
  static generateRankings(context: GameContext): UserStatsType[] {
    const { settings } = context

    return settings.rankMode === 'point'
      ? this.generatePointModeRankings(context)
      : this.generateWinnerModeRankings(context)
  }

  private static generatePointModeRankings(context: GameContext): UserStatsType[] {
    const { gameState, currentUser } = context
    const allRecords: UserStatsType[] = []

    // 全記録を収集
    if (gameState.userRecords) {
      Object.values(gameState.userRecords).forEach((records) => {
        allRecords.push(...records)
      })
    }

    // ポイント順で並べ替え
    const sorted = allRecords
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
      .map((entry, index) => ({ ...entry, rank: index + 1 }))

    // 現在ユーザーの最新記録を先頭に移動
    const currentUserRecords = gameState.userRecords?.[currentUser.userId] || []
    if (currentUserRecords.length > 0) {
      const latestRecord = currentUserRecords[currentUserRecords.length - 1]
      const currentIndex = sorted.findIndex(
        (entry) => entry.userId === currentUser.userId && entry.points === latestRecord.points
      )
      if (currentIndex !== -1) {
        const [currentUserEntry] = sorted.splice(currentIndex, 1)
        sorted.unshift(currentUserEntry)
      }
    }

    return sorted
  }

  private static generateWinnerModeRankings(context: GameContext): UserStatsType[] {
    const { currentUser, settings } = context
    const entries = this.createRankingEntries(context)
    const sortKey = settings.rankMode === 'rate' ? 'rate' : 'wins'

    const sorted = entries
      .sort((a, b) => (b[sortKey] ?? 0) - (a[sortKey] ?? 0))
      .map((entry, index) => ({ ...entry, rank: index + 1 }))

    // 現在ユーザーを先頭に移動
    const currentIndex = sorted.findIndex((entry) => entry.userId === currentUser.userId)
    if (currentIndex > 0) {
      const [currentUser] = sorted.splice(currentIndex, 1)
      sorted.unshift(currentUser)
    }

    return sorted
  }

  private static createRankingEntries(context: GameContext): UserStatsType[] {
    const { gameState } = context
    const previousRankings = gameState.userRankings || []

    return Object.entries(gameState.userStats).map(([uid, stats]) => {
      const prev = previousRankings.find((entry) => entry.userId === uid)
      const draws = stats.draws ?? prev?.draws ?? 0
      const wins = stats.wins ?? prev?.wins ?? 0
      const points = stats.points ?? prev?.points ?? 0
      const totalPoints = stats.totalPoints ?? prev?.totalPoints ?? 0

      return {
        userId: uid,
        name: stats.name || 'Unknown',
        draws,
        wins,
        points,
        totalPoints,
        rank: stats.rank ?? prev?.rank ?? 0,
        rate: draws > 0 ? (wins / draws) * 100 : 0,
      }
    })
  }

  // 順位計算も統一
  static calculateRank(context: GameContext, userStats?: UserStatsType): number | 'ランキング外' {
    const { gameState, currentUser, settings } = context
    const rankings = gameState.userRankings || []
    const targetStats = userStats || gameState.userStats[currentUser.userId]

    if (!targetStats) return 'ランキング外'

    if (settings.rankMode === 'point') {
      const points = targetStats.points ?? 0
      const betterCount = rankings.filter((rank) => (rank.points ?? 0) > points).length
      return betterCount + 1
    }

    const index = rankings.findIndex((rank) => rank.userId === targetStats.userId)
    return index >= 0 ? index + 1 : 'ランキング外'
  }
}
