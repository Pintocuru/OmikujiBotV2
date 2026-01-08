// src/GameScripts/scriptsEngine/RankingMessage/RankingMessage.ts
import {
  BotMessageSchema,
  BotMessageType,
  PostActionMessageSchema,
  PostActionType,
  RankingMessageSchema,
} from '@/types/'
import { LogRankScript } from '../LogRank/execute'
import { OmikenCommentType, UserNameType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'

const UNKNOWN_NAME = 'おみくじBOT'

/**
 * BotMessage構築のパラメータ
 */
export interface BuildBotMessageParams {
  user: UserNameType
  bubbleText: string
  scriptKey: string
  score: number
  symbol: string
  delaySeconds?: number
  characterKey: string
  logResult: ReturnType<LogRankScript['run']> | null
}

/**
 * ランキングメッセージを構築（既存の関数 - 後方互換性のために残す）
 * @deprecated 新しいコードでは buildBotMessage を使用してください
 */
export function buildRankingMessage(params: BuildBotMessageParams): PostActionType {
  const { user, logResult } = params
  const stats = logResult?.currentUserStats
  const currentRecord = logResult?.currentRecord

  const ranking = logResult
    ? RankingMessageSchema.parse({
        scriptKey: params.scriptKey,
        listName: stats?.userName,
        scoreText: String(params.score),
        scoreValue: currentRecord?.score,
        symbol: params.symbol,
        isRank: !logResult.isOverLimit,
      })
    : undefined

  return PostActionMessageSchema.parse({
    delaySeconds: 3.5,
    characterKey: params.characterKey,
    message: {
      bubble: params.bubbleText,
      user,
      ranking,
    },
    sound: 'decision',
  })
}

/**
 * ユーザー情報を準備（omikenの有無を吸収）
 */
export function prepareUserInfo(omiken?: OmikenCommentType): UserNameType {
  return UserNameSchema.parse({
    userName: UNKNOWN_NAME,
    userId: UNKNOWN_NAME,
    ...omiken,
  })
}
/**
 * BotMessageを構築する共通関数
 */
export function buildBotMessage(params: BuildBotMessageParams): BotMessageType {
  const { user, bubbleText, scriptKey, score, symbol, delaySeconds = 3.5, logResult } = params

  const stats = logResult?.currentUserStats
  const currentRecord = logResult?.currentRecord

  const ranking = logResult
    ? {
        scriptKey,
        listName: stats?.userName ?? user.userName,
        scoreText: String(score),
        scoreValue: currentRecord?.score ?? score,
        symbol,
        isRank: !logResult.isOverLimit,
      }
    : undefined

  return BotMessageSchema.parse({
    delaySeconds,
    type: 'comment',
    bubble: {
      name: user.userName,
      message: bubbleText,
      isToast: false,
      characterKey: params.characterKey,
      // TODO:colorはキャラクターに依存
      color: {},
    },
    user,
    ranking,
  })
}
