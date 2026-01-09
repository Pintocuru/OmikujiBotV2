// src/MainGenerator/scripts/OmikujiResult/MessageProcessor.ts
import { PostActionMessageType, RankingMessageSchema } from '@/types/OmikujiData/'

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

/**
 * メッセージ処理を担当するクラス
 *
 * ⚠️ 重要: 変数プレースホルダーは OmikujiResultProcessor で既に1回だけ処理されており、
 * 処理結果は message._processed に格納されています。
 * このクラスでは処理済みデータを取り出すだけで、再処理は行いません。
 */
export class MessageProcessor {
  constructor() {
    // variableProcessorは不要になったため削除
  }

  /**
   * 処理済みメッセージコンテンツの抽出
   *
   * OmikujiResultProcessorで処理された結果を取り出します。
   */
  extractMessageContent(message: PostActionMessageType['message']): ProcessedMessageContent {
    // _processedフィールドから処理済みデータを取得
    const processed = (message as any)._processed

    if (!processed) {
      // 処理されていない場合（通常は発生しない）
      return {
        finalBubble: message.bubble || null,
        ranking: undefined,
      }
    }

    // ランキング情報の生成
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
   * メッセージタイプの判定
   */
  determineMessageTypes(
    postAction: PostActionMessageType,
    processedContent: ProcessedMessageContent
  ): MessageTypeFlags {
    const { finalBubble, ranking } = processedContent
    const { isToast } = postAction.message

    return {
      hasBubble: this.hasContent(finalBubble) && !isToast,
      hasToast: this.hasContent(finalBubble) && isToast,
      hasRanking: !!ranking,
    }
  }

  /**
   * コンテンツの有無チェック
   */
  private hasContent(content: string | null | undefined): boolean {
    return !!content?.trim()
  }
}
