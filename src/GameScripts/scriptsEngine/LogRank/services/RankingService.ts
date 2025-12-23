// src/common/GameScripts/scriptsEngine/LogRank/services/RankingService.ts
import { GameRecordType, UserStatsType } from '../GameScriptSchema'
import { GameContext, RankingEntry, isHighScoreMode } from '../types'

/**
 * ランキングを動的に生成
 * logs配列をソートして順位を付与
 */
export const generateRankings = (context: GameContext): RankingEntry[] => {
  return isHighScoreMode(context.params) ? generateHighScoreRankings(context) : generateWinBasedRankings(context)
}

/**
 * ハイスコアモード: 全記録をスコアでランキング
 * 同じユーザーが複数回ランクインする
 */
const generateHighScoreRankings = (context: GameContext): RankingEntry[] => {
  const { gameState, params } = context

  // logsをスコア降順でソート
  const sortedLogs = [...gameState.logs].sort((a, b) => b.score - a.score)

  // 順位を付与
  const rankings: RankingEntry[] = sortedLogs.map((log, index) => {
    const userStats = gameState.userMap[log.userId]
    return {
      ...log,
      rank: index + 1,
      totalDraws: userStats?.totalDraws,
      totalPoints: userStats?.totalPoints,
    }
  })

  // 現在のユーザーの最新記録を先頭に移動
  const currentUserId = params.userId
  const latestRecordIndex = rankings.findIndex(
    (entry, idx) => entry.userId === currentUserId && rankings.findIndex((e) => e.userId === currentUserId) === idx
  )

  if (latestRecordIndex > 0) {
    const [latest] = rankings.splice(latestRecordIndex, 1)
    rankings.unshift(latest)
  }

  return rankings
}

/**
 * 勝数/勝率モード: ユーザーごとに1エントリ
 * userMapから集計してランキング化
 */
const generateWinBasedRankings = (context: GameContext): RankingEntry[] => {
  const { gameState, params } = context

  // userMapをランキング形式に変換
  const entries = Object.values(gameState.userMap).map((stats): RankingEntry => {
    const winRate = stats.totalDraws > 0 ? (stats.totalWins / stats.totalDraws) * 100 : 0
    const sortValue = params.rankingMode === 'win_rate' ? winRate : stats.totalWins

    // 最新のログから表示項目を取得
    const latestLog = [...gameState.logs].reverse().find((log) => log.userId === stats.userId)

    return {
      id: `aggregate-${stats.userId}`,
      userId: stats.userId,
      userName: stats.name,
      score: sortValue,
      itemValue1: latestLog?.itemValue1,
      itemValue2: latestLog?.itemValue2,
      itemValue3: latestLog?.itemValue3,
      createdAt: latestLog?.createdAt || new Date().toISOString(),
      rank: 0, // 後で設定
      totalDraws: stats.totalDraws,
      totalPoints: stats.totalPoints,
    }
  })

  // ソートして順位付与
  const sortedEntries = entries.sort((a, b) => b.score - a.score)
  const rankings = sortedEntries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }))

  // 現在のユーザーを先頭に移動
  const currentIndex = rankings.findIndex((e) => e.userId === params.userId)
  if (currentIndex > 0) {
    const [current] = rankings.splice(currentIndex, 1)
    rankings.unshift(current)
  }

  return rankings
}

/**
 * 特定のユーザーまたはレコードの順位を取得
 */
export const getRank = (context: GameContext, userId?: string, recordId?: string): number => {
  const rankings = generateRankings(context)

  if (recordId) {
    const entry = rankings.find((r) => r.id === recordId)
    return entry?.rank || rankings.length + 1
  }

  if (userId) {
    const entry = rankings.find((r) => r.userId === userId)
    return entry?.rank || rankings.length + 1
  }

  return rankings.length + 1
}

/**
 * スコア順位を計算する（1位始まり）
 * 同スコアは同順位（dense rank）
 */
export const getScoreRank = (logs: GameRecordType[], targetScore: number): number => {
  // スコアを降順に並べ、重複を除外
  const uniqueScoresDesc = Array.from(new Set(logs.map((l) => l.score))).sort((a, b) => b - a)

  const index = uniqueScoresDesc.findIndex((score) => score === targetScore)

  // 見つからない場合は最下位扱い
  return index === -1 ? uniqueScoresDesc.length : index + 1
}
