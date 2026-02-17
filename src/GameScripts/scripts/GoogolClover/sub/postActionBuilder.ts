// src/GameScripts/GoogolClover/sub/postActionBuilder.ts
import { PostActionType, PostActionMessageSchema, BotMessageExtraType } from '@/types'

/**
 * PostActionの構築ロジック
 */

interface PostActionBuildParams {
  bubble: string
  score: number
  characterKey: string | null
}

/**
 * ゲーム結果に基づいてPostActionを構築
 */
export function buildPostActions(params: PostActionBuildParams): PostActionType[] {
  const { bubble, score, characterKey } = params

  // メッセージアクション
  const messageAction = PostActionMessageSchema.parse({
    delaySeconds: 3.5,
    characterKey,
    message: {
      bubble,
    },
    sound: 'decision',
  })

  // 共通アクション
  const commonActions: PostActionType[] = [
    { actionType: 'wordParty', delaySeconds: -1, wordParty: 'MaidenOmikujiLottery' },
  ]

  // 成功時のアクション
  const successActions: PostActionType[] = [
    { actionType: 'wordParty', delaySeconds: 0, wordParty: 'MaidenOmikuji01' },
    { actionType: 'sound', delaySeconds: 1, sound: 'carnival' },
  ]

  // 失敗時のアクション
  const failureActions: PostActionType[] = [
    { actionType: 'wordParty', delaySeconds: 0, wordParty: 'MaidenOmikuji08' },
    { actionType: 'sound', delaySeconds: 1, sound: 'fail' },
    { actionType: 'wordParty', delaySeconds: 1, wordParty: 'GoogolCloverFail' },
  ]

  // Score が0より大きければ成功、そうでなければ失敗
  const isSuccess = score > 0
  const resultActions = isSuccess ? successActions : failureActions

  return [...commonActions, ...resultActions, messageAction]
}
