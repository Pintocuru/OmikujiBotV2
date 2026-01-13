// src/MainGenerator/scripts/OmikujiResult/OmikujiResultHelper.ts
import { RankingMessageSchema, RankingMessageType } from '@/types'

/**
 * 変数プレースホルダー処理結果
 */
export interface VariablePlaceholderResult {
  bubble: string
  rankingData?: {
    name: string
    text: string
    symbol?: string
    variant?: string
    unique?: string
  }
}

/**
 * 変数プレースホルダー処理済みメッセージの中身
 */
export interface ProcessedMessageContent {
  bubble: string
  isToast: boolean
  ranking?: RankingMessageType
}

/**
 * VariablePlaceholderResultをProcessedMessageContentに変換
 */
export const createProcessedMessageContent = (
  result: VariablePlaceholderResult,
  isToast: boolean
): ProcessedMessageContent => {
  const ranking = result.rankingData
    ? RankingMessageSchema.parse({
        scriptKey: 'basicList',
        listName: result.rankingData.name,
        scoreText: result.rankingData.text,
        symbol: result.rankingData.symbol,
        variant: result.rankingData.variant,
        isUniqueUser: result.rankingData.unique !== 'false',
      })
    : undefined

  return {
    bubble: result.bubble,
    isToast,
    ranking,
  }
}
