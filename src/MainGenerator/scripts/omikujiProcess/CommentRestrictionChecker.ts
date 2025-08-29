// src/MainGenerator/utils/commentProcessor/CommentRestrictionChecker.ts
// 制限チェッカー
import { BotMessage, BotMessageSchema, CharacterType, CommentRuleType } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/types/Comment'
import { useAppStore } from '@/MainGenerator/stores'

interface RestrictionCheckResult {
  isBlocked: boolean
  toastMessages: BotMessage[]
  seed?: number
}

export class CommentRestrictionChecker {
  constructor(private readonly firstCharacter: CharacterType | null) {}

  /**
   * 制限チェック（重複チェック、クールダウンチェック）
   */
  checkRestrictions(comment: Comment, rule: CommentRuleType): RestrictionCheckResult {
    const { cooldownManager } = useAppStore()

    const isCommentBased = rule.threshold.conditions.includes('comment')
    const userName = comment.data.displayName || comment.data.name

    // 1. 重複処理（クールダウン）チェック
    if (this.isCooldownBlocked(rule)) {
      const message = getMessageOrDefault(
        rule.limits.cooldownMessage,
        `コメントが被って、「${rule.name}」ができなかったよ。またコメントしてね。`
      )
      return { isBlocked: true, toastMessages: this.createErrorToast(message) }
    }

    // 2. 連投制限チェック（コメントベースのルールのみ）
    if (isCommentBased && this.isRepeatBlocked(comment, rule)) {
      if (!rule.limits.isRepeatAllowed) {
        const message = getMessageOrDefault(
          rule.limits.repeatMessage,
          `${userName}さんは、連投制限で「${rule.name}」ができなかったよ。`
        )
        return { isBlocked: true, toastMessages: this.createErrorToast(message) }
      }
      return { isBlocked: false, toastMessages: [] } // 重複が許可されている場合はブロックしない
    }

    // 3. 回数制限チェック
    if (isCommentBased && this.isDrawLimitExceeded(comment, rule)) {
      switch (rule.limits.drawLimitExceeded) {
        case 'showMessage':
          const message = getMessageOrDefault(
            rule.limits.drawLimitMessage,
            `${userName}さんの「${rule.name}」は上限の${rule.limits.drawLimit}回を超えているよ。`
          )
          return { isBlocked: true, toastMessages: this.createErrorToast(message) }
        case 'showLastResult':
          // 最後の有効な結果(sessionId+userId+最後の回数)を返す
          const userDrawCount = rule.limits.drawLimit
          const sessionId = cooldownManager.getSessionId()
          const seedStr = `${sessionId}-${comment.data.userId}-${userDrawCount}`
          const seed = stringToSeed(seedStr)
          return {
            isBlocked: false,
            toastMessages: [],
            seed,
          }
        case 'doNothing':
        default:
          return { isBlocked: true, toastMessages: [] }
      }
    }

    // すべての制限をクリア
    // seedをsessionId+userId+おみくじ回数にする
    const currentDrawCount = cooldownManager.getUserDrawCount(comment.data.userId, rule.id)
    const sessionId = cooldownManager.getSessionId()
    // seed生成は回数制限がある時だけ
    const seed =
      rule.limits.drawLimit > 0 ? stringToSeed(`${sessionId}-${comment.data.userId}-${currentDrawCount}`) : undefined

    return {
      isBlocked: false,
      toastMessages: [],
      seed,
    }
  }

  // 連投制限
  private isRepeatBlocked(comment: Comment, rule: CommentRuleType): boolean {
    const { cooldownManager } = useAppStore()
    return cooldownManager.isRepeatBlocked(comment.data.userId, rule.limits.isRepeatAllowed)
  }

  // クールダウン制限
  private isCooldownBlocked(rule: CommentRuleType): boolean {
    const { cooldownManager } = useAppStore()
    const cooldownSeconds = rule.limits.cooldownSeconds
    return cooldownManager.isCooldownBlocked(cooldownSeconds)
  }

  // 回数制限
  private isDrawLimitExceeded(comment: Comment, rule: CommentRuleType): boolean {
    const { cooldownManager } = useAppStore()
    return cooldownManager.isDrawLimitExceeded(comment.data.userId, rule.id, rule.limits.drawLimit)
  }

  /**
   * エラー用のトーストメッセージを作成
   */
  private createErrorToast(message: string): BotMessage[] {
    // firstCharacterが存在する場合はその値を使用し、存在しない場合はBotMessageSchemaのデフォルト値を使用
    const botMessageData = this.firstCharacter
      ? {
          name: this.firstCharacter.name,
          profileImage: this.firstCharacter.image?.default || null,
          comment: message,
          isToast: true,
          color: this.firstCharacter.color,
        }
      : {
          comment: message,
          isToast: true,
        }

    return [BotMessageSchema.parse(botMessageData)]
  }
}

/**
 * 設定されたメッセージがあればそれを返し、なければデフォルトメッセージを返す
 * @param configuredMessage 設定されたメッセージ
 * @param defaultMessage デフォルトメッセージ
 * @returns 最終的なメッセージ
 */
export function getMessageOrDefault(configuredMessage: string | undefined, defaultMessage: string): string {
  return configuredMessage && configuredMessage.trim() !== '' ? configuredMessage : defaultMessage
}

/**
 * 任意の文字列から32bit整数のseedを作成
 * @param str 任意の文字列
 * @returns 0〜2^32-1 の整数
 */
export function stringToSeed(str: string): number {
  let seed = 0
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) >>> 0
  }
  return seed
}
