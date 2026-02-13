// src/common/GameScripts/scriptsEngine/LogRank/services/MessageService.ts
import { PostActionMessageSchema, PostActionMessageType } from '@/types/'
import { GameRecordType, UserStatsType } from '../GameScriptSchema'

/**
 * PostActionType型のメッセージを作成
 */
export const createPostActions = (
  characterKey: string | null,
  userStats: UserStatsType,
  record: GameRecordType,
  isOverLimit: boolean,
  rank?: number
): PostActionMessageType[] => {
  return [
    PostActionMessageSchema.parse({
      delaySeconds: 8,
      characterKey,
      message: {
        bubble: rank
          ? createRankingMessage(userStats.userName, record.score, rank, isOverLimit)
          : createMessage(userStats, record, isOverLimit),
        isToast: true,
      },
      sound: 'cute',
    }),
  ]
}

/**
 * ユーザー統計と記録からメッセージを作成
 */
const createMessage = (stats: UserStatsType, record: GameRecordType, isOverLimit: boolean): string => {
  const { userName } = stats
  const { score } = record

  if (isOverLimit) return `${userName}さんは上限を超えているから、参考記録だよ。`

  // ランキング情報は外部で取得する想定
  // ここではシンプルなメッセージのみ
  if (score > 0) return `${userName}さんの${score}ポイントを記録したよ。`
  return `${userName}さんの記録を登録したよ。`
}

/**
 * ランキング情報を含むメッセージを作成
 */
export const createRankingMessage = (userName: string, score: number, rank: number, isOverLimit: boolean): string => {
  if (isOverLimit) return `${userName}さんは上限を超えているから、参考記録だよ。`
  return `${userName}さんの${score}ポイントは、${rank}位だよ。`
}
