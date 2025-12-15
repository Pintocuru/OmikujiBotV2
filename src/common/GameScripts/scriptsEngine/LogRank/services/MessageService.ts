// src/common/GameScripts/scriptsEngine/LogRank/services/MessageService.ts
import { PostActionType, UserStatsType } from '@/types'

/**
 * PostActionType型のメッセージを作成
 */
export const createPostActions = (characterKey: string, userStats: UserStatsType): PostActionType[] => {
  return [
    {
      actionType: 'message',
      delaySeconds: 8,
      characterKey,
      iconKey: 'default',
      message: {
        toast: createMessage(userStats),
      },
      sound: 'cute',
    },
  ]
}

/**
 * ユーザー統計からメッセージを作成
 */
const createMessage = (stats: UserStatsType): string => {
  const { name, points, rank, isOverLimit } = stats

  if (isOverLimit) {
    return `${name}さんは上限を超えているから、参考記録だよ。`
  }

  if (points !== undefined && rank !== undefined) {
    return `${name}さんの${points}は、${rank}位だよ。`
  }

  if (rank !== undefined) {
    return `${name}さんの順位は、${rank}位だよ。`
  }

  return `${name}さんの記録を登録したよ。`
}
