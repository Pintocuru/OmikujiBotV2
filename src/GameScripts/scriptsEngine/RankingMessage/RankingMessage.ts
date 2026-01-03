// src\GameScripts\scriptsEngine\RankingMessage\RankingMessage.ts
import { PostActionMessageSchema, PostActionType, RankingMessageSchema } from '@/types/'
import { LogRankScript } from '../LogRank/execute'
import { OmikenCommentType, UserNameType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'

const UNKNOWN_NAME = 'おみくじBOT'

export function buildRankingMessage(params: {
  user: UserNameType
  characterKey: string
  scriptKey: string
  score: number
  symbol: string
  bubbleText: string
  logResult: ReturnType<LogRankScript['run']> | null
}): PostActionType {
  const { user, logResult } = params
  const stats = logResult?.currentUserStats
  const currentRecord = logResult?.currentRecord

  const ranking = logResult
    ? RankingMessageSchema.parse({
        scriptKey: params.scriptKey,
        listName: stats?.name,
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
    name: omiken?.userName ?? UNKNOWN_NAME,
    userId: omiken?.userId ?? UNKNOWN_NAME,
    profileImage: omiken?.profileImage,
  })
}
