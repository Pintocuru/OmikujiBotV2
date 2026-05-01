// src/GameScripts/scriptsEngine/LogRank/services/MessageService.ts
import { PostFlowMessageSchema, PostFlowMessageType } from '@/types'
import { GameParams } from '../types'

/**
 * PostActionType型のメッセージを作成
 */
export const createPostActions = (
  params: GameParams,
  score: number,
  isOverLimit: boolean,
  rank?: number
): PostFlowMessageType[] => {
  const { user, characterKey } = params

  return [
    PostFlowMessageSchema.parse({
      delaySeconds: 8,
      characterKey,
      message: {
        bubble: rank
          ? createRankingMessage(user.userName, score, rank, isOverLimit)
          : createMessage(user.userName, score, isOverLimit),
        isToast: true,
      },
      sound: 'cute',
    }),
  ]
}

/**
 * ランキング情報を含むメッセージを作成
 */
const createRankingMessage = (userName: string, score: number, rank: number, isOverLimit: boolean): string => {
  if (isOverLimit) return `${userName}さんは上限を超えているから、参考記録だよ。`
  return `${userName}さんの${score}ポイントは、${rank}位だよ。`
}

/**
 * ユーザー統計と記録からメッセージを作成
 */
const createMessage = (userName: string, score: number, isOverLimit: boolean): string => {
  if (isOverLimit) return `${userName}さんは上限を超えているから、参考記録だよ。`

  // ランキング情報は外部で取得する想定
  // ここではシンプルなメッセージのみ
  if (score > 0) return `${userName}さんの${score}ポイントを記録したよ。`
  return `${userName}さんの記録を登録したよ。`
}
