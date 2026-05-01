// src/GameScripts/scriptsEngine/RankingMessage/RankingMessage.ts
import { BotMessageExtraSchema, BotMessageExtraType } from '@/types'
import { OmikenCommentType, UserNameType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'

const UNKNOWN_NAME = 'おみくじBOT'

/**
 * BotMessage構築のパラメータ
 */
interface BuildBotMessageParams {
  user: UserNameType
  bubbleText: string
  componentKey: string
  score: number
  symbol: string
  delaySeconds?: number
  isUnique?: boolean
  isOverLimit: boolean
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
 * 吹き出し(comment)とランキング(extra)を個別のメッセージとして出力する
 */
export function buildBotMessageRanking(params: BuildBotMessageParams): BotMessageExtraType {
  const { user, componentKey, score, symbol, delaySeconds = 3.5, isUnique = false, isOverLimit } = params

  return BotMessageExtraSchema.parse({
    delaySeconds,
    user,
    scriptKey: componentKey,
    lists: {
      listName: user.userName,
      symbol,
      text: String(score),
      order: score,
      isVisible: !isOverLimit,
      isUnique,
    },
  })
}
