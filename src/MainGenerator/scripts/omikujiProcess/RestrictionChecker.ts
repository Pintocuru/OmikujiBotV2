// src/MainGenerator/scripts/OmikujiProcess/RestrictionChecker.ts
import { CommentRuleType, RestrictionType } from '@/types/'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

export interface RestrictionCheckResult {
  isBlocked: boolean
  restrictionType: RestrictionType | null
  metadata?: {
    userName?: string
    ruleName?: string
    drawLimit?: number
  }
}

/**
 * 制限チェック（重複チェック、クールダウンチェック）
 */
export function checkRestrictions(omiken: OmikenCommentType, rule: CommentRuleType): RestrictionCheckResult {
  const isCommentBased = rule.threshold.conditions.includes('comment')
  const userName = omiken.userName

  // 1. クールダウンチェック
  if (isCooldownBlocked(rule.limits.cooldownSeconds)) {
    return {
      isBlocked: true,
      restrictionType: 'cooldown',
      metadata: {
        ruleName: rule.name,
      },
    }
  }

  if (!isCommentBased) {
    return { isBlocked: false, restrictionType: null }
  }

  // 2. 連投制限チェック（コメントベースのルールのみ）
  if (isRepeatBlocked(omiken.userId, rule.key, rule.limits.isRepeatAllowed)) {
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
    return { isBlocked: false, restrictionType: null }
  }

  return { isBlocked: false, restrictionType: null }
}

function isCooldownBlocked(cooldownSeconds: number): boolean {
  const { cooldownManager } = useAppStore()
  return cooldownManager.isCooldownBlocked(cooldownSeconds)
}

function isRepeatBlocked(userId: string, key: string, isRepeatAllowed: number): boolean {
  const { cooldownManager } = useAppStore()
  return cooldownManager.isRepeatBlocked(userId, key, isRepeatAllowed)
}
