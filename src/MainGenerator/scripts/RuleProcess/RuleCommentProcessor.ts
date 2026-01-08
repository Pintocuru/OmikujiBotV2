// src/MainGenerator/script/RuleProcess/RuleCommentProcessor.ts
import { BotMessageType } from '@/types/'
import { processUserComment } from '@/MainGenerator/scripts/RuleProcess/UserCommentProcessor'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'

const TIME_THRESHOLD = 10000 // これ以上経過した古いコメントは判定しない

export class RuleCommentProcessor {
  private appliedCommentIds = new Set<string>()

  /**
   * メイン処理: コメントを処理して拡張コメントを作成
   */
  respondToComments(omikens: OmikenCommentType[]): BotMessageType[] {
    if (!omikens.length) return []

    const botMessages: BotMessageType[] = []
    // 最新が末尾なので反転してから先頭5件を取得
    const limitedComments = omikens.slice().reverse().slice(0, 5)

    for (const omiken of limitedComments) {
      const { userVisitManager } = useAppStore()
      const { id, userId, timestamp } = omiken

      // BOTのコメントがあった時点で処理終了(既に処理されたものなので)
      if (this.isBotComment(userId)) return botMessages

      // 既に処理済みのコメントは処理終了
      if (this.appliedCommentIds.has(id)) return botMessages

      // 除外条件をチェック
      if (this.isOldComment(timestamp)) return botMessages

      // ユーザー情報を記録する
      userVisitManager.recordLiveComment(UserNameSchema.parse(omiken))

      // おみくじチェック
      this.appliedCommentIds.add(id)
      const processedMessages = processUserComment(omiken)

      if (processedMessages.length > 0) {
        botMessages.push(...processedMessages)
      }
    }

    return botMessages
  }

  /**
   * Botのコメントかどうかを判定
   */
  private isBotComment(userId: string): boolean {
    return userId === POST_SETTINGS.botUserId
  }

  /**
   * 古いコメント（時間閾値を超過）かどうかを判定
   */
  private isOldComment(timestamp: number): boolean {
    const currentTime = Date.now()
    const sinceComment = currentTime - timestamp
    return sinceComment > TIME_THRESHOLD
  }
}
