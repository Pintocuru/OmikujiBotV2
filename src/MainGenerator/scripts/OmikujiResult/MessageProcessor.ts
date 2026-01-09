// src/MainGenerator/scripts/OmikujiResult/MessageProcessor.ts
import { RankingMessageSchema } from '@/types/OmikujiData/'
import {
  ProcessedMessageAction,
  ProcessedAction,
  ProcessedMessageContent,
  MessageTypeFlags,
} from './OmikujiResultHelper'

export class MessageProcessor {
  /**
   * 処理済みデータをProcessedMessageContentに変換
   */
  extractMessageContent(action: ProcessedAction): ProcessedMessageContent {
    if (action.actionType !== 'message') {
      return {
        finalBubble: null,
        ranking: undefined,
      }
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
      finalBubble: processed.bubble,
      ranking,
    }
  }

  /**
   * メッセージタイプを判定
   */
  determineMessageTypes(action: ProcessedMessageAction, processedContent: ProcessedMessageContent): MessageTypeFlags {
    const { finalBubble, ranking } = processedContent
    const { isToast } = action.message

    return {
      hasBubble: this.hasContent(finalBubble) && !isToast,
      hasToast: this.hasContent(finalBubble) && isToast,
      hasRanking: !!ranking,
    }
  }

  private hasContent(content: string | null | undefined): boolean {
    return !!content?.trim()
  }
}
