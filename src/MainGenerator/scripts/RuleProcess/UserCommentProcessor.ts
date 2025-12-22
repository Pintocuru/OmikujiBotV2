// src/MainGenerator/script/RuleProcess/UserCommentProcessor.ts
import { BotMessage, CommentRuleType } from '@/types/'
import { checkRestrictions } from '../OmikujiProcess/RestrictionChecker'
import { buildRestrictionMessages } from './RestrictionMessageBuilder'
import { OmikujiProcessor } from '../OmikujiProcess/OmikujiProcessor'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { checkAllTriggers } from '@shared/utils/trigger/TriggerChecker'

interface RuleProcessResult {
  isCommentTriggered: boolean
  botMessages: BotMessage[]
}

/**
 * ユーザーコメントの処理
 */
export function processUserComment(omiken: OmikenCommentType): BotMessage[] {
  try {
    const { cooldownManager } = useAppStore()
    const sortedRules = getSortedEnabledRules()

    for (const rule of sortedRules) {
      const result = processRule(omiken, rule)

      // ルールが成功し、botメッセージが生成された場合はここで終了
      if (result.botMessages.length > 0) {
        // コメントでの発動なら、クールダウンを設定する
        if (result.isCommentTriggered) {
          cooldownManager.updateLastProcessedTime()
        }
        return result.botMessages
      }
    }

    return []
  } catch (error) {
    console.error('ユーザーコメント処理エラー:', error)
    return []
  }
}

/**
 * コメントルールの条件チェック
 */
function validateThreshold(omiken: OmikenCommentType, rule: CommentRuleType): boolean {
  // TODO:修正(triggerを新規作成)
  return checkAllTriggers(omiken, rule.key, rule.threshold)
}

/**
 * 単一ルールの処理
 */
function processRule(omiken: OmikenCommentType, rule: CommentRuleType): RuleProcessResult {
  const { cooldownManager, userVisitManager } = useAppStore()

  // 1. 閾値条件チェック
  if (!validateThreshold(omiken, rule)) {
    return { isCommentTriggered: false, botMessages: [] }
  }

  // 2. 制限チェック
  const restrictionResult = checkRestrictions(omiken, rule)

  if (restrictionResult.isBlocked) {
    // 3. 制限チェックの結果からメッセージを生成
    const toastMessages = buildRestrictionMessages(restrictionResult, rule)
    return {
      isCommentTriggered: false,
      botMessages: toastMessages,
    }
  }

  // 3. おみくじ成功時に回数をインクリメント
  omiken.meta.draws = userVisitManager.getVisitCount(omiken.userId, rule.key) + 1
  userVisitManager.recordVisit(omiken.userId, rule.key, omiken.userName)

  // 4. おみくじ実行
  const omikujiProcessor = new OmikujiProcessor()
  const omikujiMessages = omikujiProcessor.executeOmikuji(rule.omikuji, omiken)

  // チャットワード起動かどうかを判定
  const isCommentTriggered = rule.threshold.conditions.includes('comment')

  return {
    isCommentTriggered,
    botMessages: omikujiMessages,
  }
}

/**
 * ルールの並び替え（有効なルールのみを order でソート）
 */
function getSortedEnabledRules(): CommentRuleType[] {
  const appStore = useAppStore()
  return Object.values(appStore.data.comments)
    .filter((rule) => rule.isEnabled)
    .sort((a, b) => a.order - b.order)
}
