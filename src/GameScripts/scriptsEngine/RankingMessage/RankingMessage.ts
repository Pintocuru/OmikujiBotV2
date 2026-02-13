// src/GameScripts/scriptsEngine/RankingMessage/RankingMessage.ts
import { BotMessageExtraSchema, BotMessageExtraType } from '@/types/'
import { LogRankScript } from '../LogRank/execute'
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
  logResult: ReturnType<LogRankScript['run']> | null
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
export function buildBotMessageRanking(params: BuildBotMessageParams): BotMessageExtraType[] {
  const { user, componentKey, score, symbol, delaySeconds = 3.5, isUnique = false, logResult } = params
  const messages: BotMessageExtraType[] = []

  if (logResult) {
    const stats = logResult.currentUserStats
    const currentRecord = logResult.currentRecord

    const rankingMessage = BotMessageExtraSchema.parse({
      delaySeconds: delaySeconds,
      user,
      componentKey,
      lists: {
        listName: stats?.userName ?? user.userName,
        symbol,
        text: String(score),
        order: currentRecord?.score ?? score,
        isVisible: !logResult.isOverLimit,
        isUnique,
      },
    })
    messages.push(rankingMessage)
  }

  return messages
}
