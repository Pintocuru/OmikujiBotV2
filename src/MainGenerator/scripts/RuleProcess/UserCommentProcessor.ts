// src/MainGenerator/script/RuleProcess/UserCommentProcessor.ts
import { BotMessageType, CommentRuleType } from '@/types/'
import { buildRestrictionMessages } from './createBotMessages'
import { checkRestrictions } from '@main/scripts/OmikujiProcess/RestrictionChecker'
import { OmikujiProcessor } from '@main/scripts/OmikujiProcess/OmikujiProcessor'
import { useAppStore } from '@main/stores/useAppStore'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { checkAllTriggers } from '@shared/utils/trigger/TriggerChecker'

interface RuleProcessResult {
  isCommentTriggered: boolean
  botMessages: BotMessageType[]
}

/**
 * ユーザーコメントの処理
 */
export function processUserComment(omiken: OmikenCommentType): BotMessageType[] {
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
 * 単一ルールの処理
 */
function processRule(omiken: OmikenCommentType, rule: CommentRuleType): RuleProcessResult {
  const { userSession } = useAppStore()

  // 1. コメントルールの条件チェック
  if (!checkAllTriggers(omiken, rule.trigger)) {
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
  omiken.meta.draws = userSession.visits.getCount(omiken.userId, rule.key) + 1
  omiken.meta.ruleKey = rule.key

  const userName = UserNameSchema.parse(omiken)
  userSession.visits.record(rule.key, userName)

  // 4. おみくじ実行
  const omikujiProcessor = new OmikujiProcessor()
  const botMessages = omikujiProcessor.executeOmikuji(rule.omikuji, omiken)

  // チャットワード起動かどうかを判定
  const isCommentTriggered = rule.trigger.conditions.includes('comment')

  return {
    isCommentTriggered,
    botMessages,
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
