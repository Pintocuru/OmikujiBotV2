// src/MainGenerator/script/RuleProcess/RuleCommentProcessor.ts
import { BotMessage } from '@/types/'
import { OmikujiDataType } from '@/types/'
import { RuleCommentExecutor } from '@/MainGenerator/scripts/RuleProcess/RuleCommentExecutor'
import { GameScriptManager } from '@/MainGenerator/scripts/GameScript/GameScriptManager'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { Comment } from '@onecomme.com/onesdk/'

export class RuleCommentProcessor {
  private readonly timeThreshold = 5000 // これ以上経過した古いコメントは判定しない
  private readonly userCommentProcessor: RuleCommentExecutor

  constructor(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
    this.userCommentProcessor = new RuleCommentExecutor(omikujiData, scriptManager)
  }

  /**
   * メイン処理: コメントを処理して拡張コメントを作成
   */
  respondToComments(comments: Comment[]): BotMessage[] {
    if (!comments.length) return []

    const botMessages: BotMessage[] = []

    for (const comment of comments) {
      // 除外条件をチェック（古いコメントまたはBotコメントは弾く）
      if (this.isOldComment(comment.data.timestamp) || this.isBotComment(comment.data.userId)) continue

      const processedMessages = this.userCommentProcessor.generateBotMessages(comment)
      if (processedMessages) botMessages.push(...processedMessages)
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
  private isOldComment(timestamp: string): boolean {
    const currentTime = Date.now()
    const sinceComment = currentTime - new Date(timestamp).getTime()
    return sinceComment > this.timeThreshold
  }
}
