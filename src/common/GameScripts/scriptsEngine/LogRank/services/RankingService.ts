// src/common/GameScripts/scriptsEngine/LogRank/services/RankingService.ts
import { UserStatsType } from '@/types/'
import { GameContext, isPointMode } from '../types'

/**
 * ランキングを生成
 */
export const generateRankings = (context: GameContext): UserStatsType[] => {
  return isPointMode(context.params) ? generatePointModeRankings(context) : generateWinnerModeRankings(context)
}

/**
 * ポイントモード: 全記録をランキング化
 */
const generatePointModeRankings = (context: GameContext): UserStatsType[] => {
  const { gameState, params } = context

  // 全レコードを収集してソート
  const allRecords = Object.values(gameState.userRecords || {}).flat()
  const rankedRecords = allRecords
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  // 現在のユーザーの最新記録を先頭に移動
  const userRecords = gameState.userRecords?.[params.userId] || []
  if (userRecords.length === 0) return rankedRecords

  const latest = userRecords[userRecords.length - 1]
  const index = rankedRecords.findIndex((e) => e.userId === params.userId && e.points === latest.points)

  if (index <= 0) return rankedRecords

  const result = [...rankedRecords]
  const [entry] = result.splice(index, 1)
  result.unshift(entry)

  return result
}

/**
 * 勝数/勝率モード: ユーザー統計をランキング化
 */
const generateWinnerModeRankings = (context: GameContext): UserStatsType[] => {
  const { params, gameState } = context
  const previous = gameState.userRankings || []

  // ランキングエントリーを作成
  const entries = Object.entries(gameState.userStats).map(([uid, stats]) => {
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

  // ソートキーを決定してソート
  const sortKey = params.rankMode === 'rate' ? 'rate' : 'wins'
  const rankedEntries = entries
    .sort((a, b) => (b[sortKey] ?? 0) - (a[sortKey] ?? 0))
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  // 現在のユーザーを先頭に移動
  const index = rankedEntries.findIndex((e) => e.userId === params.userId)
  if (index <= 0) return rankedEntries

  const result = [...rankedEntries]
  const [entry] = result.splice(index, 1)
  result.unshift(entry)

  return result
}

/**
 * ユーザーの順位を計算
 */
export const calculateRank = (context: GameContext, userStats?: UserStatsType): number | 'ランキング外' => {
  const { gameState, params } = context
  const rankings = gameState.userRankings || []
  const target = userStats || gameState.userStats[params.userId]

  if (!target) return 'ランキング外'

  if (isPointMode(context.params)) {
    return rankings.filter((r) => (r.points ?? 0) > (target.points ?? 0)).length + 1
  }

  const index = rankings.findIndex((r) => r.userId === target.userId)
  return index >= 0 ? index + 1 : 'ランキング外'
}
