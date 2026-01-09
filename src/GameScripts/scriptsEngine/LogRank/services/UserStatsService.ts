// src/common/GameScripts/scriptsEngine/LogRank/services/UserStatsService.ts
import { v4 } from 'uuid'
import { GameRecordType, UserStatsType } from '../GameScriptSchema'
import { GameContext } from '../types'

/**
 * 今回の実行記録（GameRecord）を作成
 */
export const createGameRecord = (context: GameContext): GameRecordType => {
  const { params } = context
  const { userId, userName, result } = params

  return {
    id: v4(),
    userId,
    userName,
    score: result.score,
    ...(result.itemValue1 && { itemValue1: result.itemValue1 }),
    ...(result.itemValue2 && { itemValue2: result.itemValue2 }),
    ...(result.itemValue3 && { itemValue3: result.itemValue3 }),
    createdAt: new Date().toISOString(),
  }
}

/**
 * ユーザーの累計統計を更新
 * userMapを更新して返す
 */
export const updateUserStats = (context: GameContext): Record<string, UserStatsType> => {
  const { params, gameState } = context
  const { userId, userName, result } = params

  // 既存統計を取得または初期化
  const current = gameState.userMap[userId] || {
    userId,
    userName,
    totalDraws: 0,
    totalPoints: 0,
    totalWins: 0,
    bestScore: 0,
  }

  // 勝利判定
  const isWin = result.type === 'win'

  // 統計を更新
  const updated: UserStatsType = {
    ...current,
    userName, // 最新の名前で上書き
    totalDraws: current.totalDraws + 1,
    totalPoints: current.totalPoints + result.score,
    totalWins: isWin ? current.totalWins + 1 : current.totalWins,
    bestScore: Math.max(current.bestScore, result.score),
  }

  return {
    ...gameState.userMap,
    [userId]: updated,
  }
}
