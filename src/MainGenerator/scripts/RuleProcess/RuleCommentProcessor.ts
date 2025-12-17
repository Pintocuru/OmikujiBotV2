// src/MainGenerator/script/RuleProcess/RuleCommentProcessor.ts
import { BotMessage } from '@/types/'
import { processUserComment } from '@/MainGenerator/scripts/RuleProcess/UserCommentProcessor'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { Comment } from '@onecomme.com/onesdk/'

const TIME_THRESHOLD = 10000 // これ以上経過した古いコメントは判定しない

/**
 * メイン処理: コメントを処理して拡張コメントを作成
 */
export function respondToComments(comments: Comment[]): BotMessage[] {
  if (!comments.length) return []
  const botMessages: BotMessage[] = []
  // 最新が末尾なので反転してから先頭5件を取得
  const limitedComments = comments.slice().reverse().slice(0, 5)

  for (const comment of limitedComments) {
    // BOTのコメントがあった時点で処理終了(既に処理されたものなので)
    if (isBotComment(comment.data.userId)) return []

    // 除外条件をチェック
    if (isOldComment(comment.data.timestamp)) continue

    const processedMessages = processUserComment(comment)
    if (processedMessages.length > 0) {
      botMessages.push(...processedMessages)
    }
  }

  return botMessages
}

/**
 * Botのコメントかどうかを判定
 */
function isBotComment(userId: string): boolean {
  return userId === POST_SETTINGS.botUserId
}

/**
 * 古いコメント（時間閾値を超過）かどうかを判定
 */
function isOldComment(timestamp: string): boolean {
  const currentTime = Date.now()
  const sinceComment = currentTime - new Date(timestamp).getTime()
  return sinceComment > TIME_THRESHOLD
}
