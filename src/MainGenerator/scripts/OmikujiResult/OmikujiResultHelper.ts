// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\MainGenerator\scripts\OmikujiResult\OmikujiResultHelper.ts
import { PostActionMessageType, PostActionType, RankingMessageSchema } from '@/types'

/**
 * 変数プレースホルダー処理結果
 */
export interface VariablePlaceholderResult {
  bubble: string | null
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
    bubble: string | null
    isToast: boolean
    processed: VariablePlaceholderResult
  }
}

/**
 * 処理済みアクション（メッセージ以外は元のまま）
 */
export type ProcessedAction = ProcessedMessageAction | Exclude<PostActionType, PostActionMessageType>

/**
 * 処理済みメッセージコンテンツ
 */
export interface ProcessedMessageContent {
  finalBubble: string | null
  ranking: ReturnType<typeof RankingMessageSchema.parse> | undefined
}

/**
 * メッセージタイプの判定結果
 */
export interface MessageTypeFlags {
  hasBubble: boolean
  hasToast: boolean
  hasRanking: boolean
}
