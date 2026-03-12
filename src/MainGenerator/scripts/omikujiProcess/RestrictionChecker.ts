// src/MainGenerator/scripts/OmikujiProcess/RestrictionChecker.ts
import { CommentRuleType } from '@/types/'
import { useAppStore } from '@main/stores/useAppStore'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

export interface RestrictionCheckResult {
  isBlocked: boolean
  restrictionType: 'cooldown' | 'repeat' | null
  metadata?: {
    userName?: string
    ruleName?: string
    drawLimit?: number
  }
}

/**
 * 制限チェック（重複チェック、クールダウンチェック）
 */
export function checkRestrictions(omiken: OmikenCommentType, event: CommentRuleType): RestrictionCheckResult {
  const isCommentBased = event.trigger.conditions.includes('comment')
  const userName = omiken.userName

  // 1. クールダウンチェック
  if (isCooldownBlocked(event.limits.cooldownSeconds)) {
    return {
      isBlocked: true,
      restrictionType: 'cooldown',
      metadata: {
        ruleName: event.name,
      },
    }
  }

  if (!isCommentBased) {
    return { isBlocked: false, restrictionType: null }
  }

  // 2. 連投制限チェック（コメントベースのイベントのみ）
  if (isRepeatBlocked(omiken.userId, event.key, event.limits.isRepeatAllowed)) {
    return {
      isBlocked: true,
      restrictionType: 'repeat',
      metadata: {
        userName,
        ruleName: event.name,
      },
    }
  }

  return { isBlocked: false, restrictionType: null }
}

function isCooldownBlocked(cooldownSeconds: number): boolean {
  const { cooldownManager } = useAppStore()
  return cooldownManager.isCooldownBlocked(cooldownSeconds)
}

function isRepeatBlocked(userId: string, ruleKey: string, allowedCount: number): boolean {
  if (allowedCount <= 0) return false
  const { userSession } = useAppStore()
  const currentCount = userSession.visits.getCount(userId, ruleKey)

  return currentCount >= allowedCount
}
