// src/GameScripts/scriptsEngine/RankingMessage/RankingMessage.ts
import { BotMessageCommentSchema, BotMessageRankingSchema, BotMessageType } from '@/types/'
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
export function buildBotMessages(params: BuildBotMessageParams): BotMessageType[] {
  const { user, bubbleText, scriptKey, score, symbol, delaySeconds = 3.5, logResult } = params
  const messages: BotMessageType[] = []

  // 1. 吹き出しメッセージ (comment) の構築
  const commentMessage = BotMessageCommentSchema.parse({
    type: 'comment',
    delaySeconds,
    bubble: {
      name: user.userName,
      message: bubbleText,
      isToast: false,
      characterKey: params.characterKey,
      color: {}, // TODO: キャラクター依存
    },
    // ここで display 状態の初期値を設定可能
    display: { visible: true },
  })
  messages.push(commentMessage)

  // 2. ランキングメッセージ (ranking) の構築
  // logResult がある場合のみ生成する
  if (logResult) {
    const stats = logResult.currentUserStats
    const currentRecord = logResult.currentRecord

    const rankingMessage = BotMessageRankingSchema.parse({
      type: 'ranking',
      // ランキング表示を少し遅らせる場合は delaySeconds に加算するなどの調整が可能
      delaySeconds: delaySeconds + 0.5,
      user,
      ranking: {
        scriptKey,
        listName: stats?.userName ?? user.userName,
        scoreText: String(score),
        scoreValue: currentRecord?.score ?? score,
        symbol,
        isRank: !logResult.isOverLimit,
        isUniqueUser: true, // 必要に応じて判定
      },
    })
    messages.push(rankingMessage)
  }

  return messages
}
