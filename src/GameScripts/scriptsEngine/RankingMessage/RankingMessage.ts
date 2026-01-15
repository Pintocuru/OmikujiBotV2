// src/GameScripts/scriptsEngine/RankingMessage/RankingMessage.ts
import { BotMessageRankingSchema, BotMessageRankingType } from '@/types/'
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
  isUniqueUser?: boolean
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
 * 吹き出し(comment)とランキング(ranking)を個別のメッセージとして出力する
 */
export function buildBotMessageRanking(params: BuildBotMessageParams): BotMessageRankingType[] {
  const { user, scriptKey, score, symbol, delaySeconds = 3.5, isUniqueUser = false, logResult } = params
  const messages: BotMessageRankingType[] = []

  if (logResult) {
    const stats = logResult.currentUserStats
    const currentRecord = logResult.currentRecord

    const rankingMessage = BotMessageRankingSchema.parse({
      type: 'ranking',
      delaySeconds: delaySeconds,
      user,
      ranking: {
        scriptKey,
        listName: stats?.userName ?? user.userName,
        scoreText: String(score),
        scoreValue: currentRecord?.score ?? score,
        symbol,
        isRank: !logResult.isOverLimit,
        isUniqueUser,
      },
    })
    messages.push(rankingMessage)
  }

  return messages
}
