// src\MainGenerator\scripts\OmikujiProcess\CommentRestrictionChecker.ts
import { BotMessage, BotMessageSchema, CharacterType, CommentRuleType } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { useAppStore } from '@/MainGenerator/stores'

interface RestrictionCheckResult {
  isBlocked: boolean
  toastMessages: BotMessage[]
}

type DrawLimitAction = 'showMessage' | 'showLastResult' | 'doNothing'

export class CommentRestrictionChecker {
  constructor(private readonly firstCharacter: CharacterType | null) {}

  /**
   * 制限チェック（重複チェック、クールダウンチェック）
   */
  checkRestrictions(comment: Comment, rule: CommentRuleType): RestrictionCheckResult {
    const { cooldownManager } = useAppStore()
    const isCommentBased = rule.threshold.conditions.includes('comment')
    const userName = comment.data.displayName || comment.data.name

    // 1. クールダウンチェック
    if (this.isCooldownBlocked(rule)) {
      return this.createBlockedResult(
        rule.limits.cooldownMessage,
        `コメントが被って、「${rule.name}」ができなかったよ。またコメントしてね。`
      )
    }

    if (!isCommentBased) {
      return { isBlocked: false, toastMessages: [] }
    }

    // 2. 連投制限チェック（コメントベースのルールのみ）
    if (this.isRepeatBlocked(comment, rule)) {
      if (!rule.limits.isRepeatAllowed) {
        return this.createBlockedResult(
          rule.limits.repeatMessage,
          `${userName}さんは、連投制限で「${rule.name}」ができなかったよ。`
        )
      }
      return { isBlocked: false, toastMessages: [] }
    }

    // 3. 回数制限チェック
    if (this.isDrawLimitExceeded(comment, rule)) {
      return this.handleDrawLimitExceeded(comment, rule, userName)
    }

    return { isBlocked: false, toastMessages: [] }
  }

  private handleDrawLimitExceeded(comment: Comment, rule: CommentRuleType, userName: string): RestrictionCheckResult {
    const { cooldownManager } = useAppStore()
    const action = rule.limits.drawLimitExceeded as DrawLimitAction

    switch (action) {
      case 'showMessage': {
        const message = getMessageOrDefault(
          rule.limits.drawLimitMessage,
          `${userName}さんの「${rule.name}」は上限の${rule.limits.drawLimit}回を超えているよ。`
        )
        return this.createBlockedResult(message)
      }

      case 'showLastResult': {
        const lastBotMessages = cooldownManager.getLastBotMessages(comment.data.userId, rule.id)
        const message = `${userName}さんの「${rule.name}」は上限の${rule.limits.drawLimit}回を超えているよ。 最後の結果:${lastBotMessages}`
        return this.createBlockedResult(message)
      }

      case 'doNothing':
      default:
        return { isBlocked: true, toastMessages: [] }
    }
  }

  private createBlockedResult(configuredMessage?: string, defaultMessage?: string): RestrictionCheckResult {
    const message = configuredMessage || defaultMessage
    if (!message) {
      return { isBlocked: true, toastMessages: [] }
    }

    return {
      isBlocked: true,
      toastMessages: this.createErrorToast(message),
    }
  }

  private isRepeatBlocked(comment: Comment, rule: CommentRuleType): boolean {
    const { cooldownManager } = useAppStore()
    return cooldownManager.isRepeatBlocked(comment.data.userId, rule.id, rule.limits.isRepeatAllowed)
  }

  private isCooldownBlocked(rule: CommentRuleType): boolean {
    const { cooldownManager } = useAppStore()
    return cooldownManager.isCooldownBlocked(rule.limits.cooldownSeconds)
  }

  private isDrawLimitExceeded(comment: Comment, rule: CommentRuleType): boolean {
    const { cooldownManager } = useAppStore()
    return cooldownManager.isDrawLimitExceeded(comment.data.userId, rule.id, rule.limits.drawLimit)
  }

  /**
   * エラー用のトーストメッセージを作成
   */
  private createErrorToast(message: string): BotMessage[] {
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
 */
export function getMessageOrDefault(configuredMessage: string | undefined, defaultMessage: string): string {
  return configuredMessage?.trim() || defaultMessage
}

/**
 * 任意の文字列から32bit整数のseedを作成
 */
export function stringToSeed(str: string): number {
  let seed = 0
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) >>> 0
  }
  return seed
}
