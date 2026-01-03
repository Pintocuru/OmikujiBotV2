// src/common/GameScripts/scriptsEngine/LogRank/services/MessageService.ts
import { PostActionMessageType } from '@/types/'
import { GameRecordType, UserStatsType } from '../GameScriptSchema'

/**
 * PostActionType型のメッセージを作成
 */
export const createPostActions = (
  characterKey: string,
  userStats: UserStatsType,
  record: GameRecordType,
  isOverLimit: boolean,
  rank?: number
): PostActionMessageType[] => {
  return [
    {
      actionType: 'message',
      delaySeconds: 8,
      characterKey,
      iconKey: 'default',
      message: {
        toast: rank
          ? createRankingMessage(userStats.name, record.score, rank, isOverLimit)
          : createMessage(userStats, record, isOverLimit),
      },
      sound: 'cute',
    },
  ]
}

/**
 * ユーザー統計と記録からメッセージを作成
 */
const createMessage = (stats: UserStatsType, record: GameRecordType, isOverLimit: boolean): string => {
  const { name } = stats
  const { score } = record

  if (isOverLimit) {
    return `${name}さんは上限を超えているから、参考記録だよ。`
  }

  // ランキング情報は外部で取得する想定
  // ここではシンプルなメッセージのみ
  if (score > 0) {
    return `${name}さんの${score}ポイントを記録したよ。`
  }

  return `${name}さんの記録を登録したよ。`
}

/**
 * ランキング情報を含むメッセージを作成
 */
export const createRankingMessage = (userName: string, score: number, rank: number, isOverLimit: boolean): string => {
  if (isOverLimit) {
    return `${userName}さんは上限を超えているから、参考記録だよ。`
  }

  return `${userName}さんの${score}ポイントは、${rank}位だよ。`
}
