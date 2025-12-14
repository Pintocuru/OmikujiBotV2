// src/MainGenerator/scripts/OmikujiProcess/RestrictionChecker.ts
import { CommentRuleType } from '@/types/'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { Comment } from '@onecomme.com/onesdk/'

export type DrawLimitAction = 'showMessage' | 'showLastResult' | 'doNothing'

export type RestrictionType = 'cooldown' | 'repeat' | 'drawLimit' | 'none'

export interface RestrictionCheckResult {
  isBlocked: boolean
  restrictionType: RestrictionType
  metadata?: {
    userName?: string
    ruleName?: string
    drawLimit?: number
    lastBotMessages?: string
  }
}

/**
 * コメントの制限チェックのみを行うクラス
 * メッセージ生成は別のクラスに委譲する
 */
export class RestrictionChecker {
  /**
   * 制限チェック（重複チェック、クールダウンチェック）
   */
  checkRestrictions(comment: Comment, rule: CommentRuleType): RestrictionCheckResult {
    const { cooldownManager } = useAppStore()
    const isCommentBased = rule.threshold.conditions.includes('comment')
    const userName = comment.data.displayName || comment.data.name

    // 1. クールダウンチェック
    if (this.isCooldownBlocked(rule.limits.cooldownSeconds)) {
      return {
        isBlocked: true,
        restrictionType: 'cooldown',
        metadata: {
          ruleName: rule.name,
        },
      }
    }

    if (!isCommentBased) {
      return { isBlocked: false, restrictionType: 'none' }
    }

    // 2. 連投制限チェック（コメントベースのルールのみ）
    if (this.isRepeatBlocked(comment.data.userId, rule.key, rule.limits.isRepeatAllowed)) {
      if (!rule.limits.isRepeatAllowed) {
        return {
          isBlocked: true,
          restrictionType: 'repeat',
          metadata: {
            userName,
            ruleName: rule.name,
          },
        }
      }
      return { isBlocked: false, restrictionType: 'none' }
    }

    // 3. 回数制限チェック
    if (this.isDrawLimitExceeded(comment.data.userId, rule.key, rule.limits.drawLimit)) {
      const action = rule.limits.drawLimitExceeded as DrawLimitAction

      // doNothing の場合もブロックするが、メッセージは表示しない
      if (action === 'doNothing') {
        return { isBlocked: true, restrictionType: 'none' }
      }

      const lastBotMessages =
        action === 'showLastResult' ? cooldownManager.getLastBotMessages(comment.data.userId, rule.key) : undefined

      return {
        isBlocked: true,
        restrictionType: 'drawLimit',
        metadata: {
          userName,
          ruleName: rule.name,
          drawLimit: rule.limits.drawLimit,
          lastBotMessages,
        },
      }
    }

    return { isBlocked: false, restrictionType: 'none' }
  }

  private isCooldownBlocked(cooldownSeconds: number): boolean {
    const { cooldownManager } = useAppStore()
    return cooldownManager.isCooldownBlocked(cooldownSeconds)
  }

  isRepeatBlocked(userId: string, key: string, isRepeatAllowed: number): boolean {
    const { cooldownManager } = useAppStore()
    return cooldownManager.isRepeatBlocked(userId, key, isRepeatAllowed)
  }

  isDrawLimitExceeded(userId: string, key: string, drawLimit: number): boolean {
    const { cooldownManager } = useAppStore()
    return cooldownManager.isDrawLimitExceeded(userId, key, drawLimit)
  }
}
