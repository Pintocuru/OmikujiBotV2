// src/MainGenerator/scripts/OmikujiResult/OmikujiResultHelper.ts
import { PostActionMessageType, PostActionType, RankingMessageSchema } from '@/types'

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
 * 変数プレースホルダー処理済みメッセージアクション
 */
export interface ProcessedMessageAction extends Omit<PostActionMessageType, 'message'> {
  actionType: 'message'
  message: {
    bubble: string
    isToast: boolean
    processed: VariablePlaceholderResult
  }
}

/**
 * 処理済みアクション（メッセージ以外は元のまま）
 */
export type ProcessedAction = ProcessedMessageAction | Exclude<PostActionType, PostActionMessageType>

/**
 * 処理済みメッセージの内容
 */
export interface MessageContent {
  bubble: string | null
  ranking: ReturnType<typeof RankingMessageSchema.parse> | undefined
}

/**
 * 処理済みデータをMessageContentに変換
 */
export const extractMessageContent = (action: ProcessedAction): MessageContent => {
  if (action.actionType !== 'message') {
    return { bubble: null, ranking: undefined }
  }

  const { processed } = action.message

  const ranking = processed.rankingData
    ? RankingMessageSchema.parse({
        scriptKey: 'basicList',
        listName: processed.rankingData.name,
        scoreText: processed.rankingData.text,
        symbol: processed.rankingData.symbol,
        variant: processed.rankingData.variant,
        isUniqueUser: processed.rankingData.unique === 'false' ? false : true,
      })
    : undefined

  return {
    bubble: processed.bubble,
    ranking,
  }
}
