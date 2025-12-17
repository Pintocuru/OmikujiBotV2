// src/MainGenerator/script/RuleProcess/UserCommentProcessor.ts
import { BotMessage, CommentRuleType } from '@/types/'
import { checkRestrictions } from '../OmikujiProcess/RestrictionChecker'
import { buildRestrictionMessages } from './RestrictionMessageBuilder'
import { OmikujiProcessor } from '../OmikujiProcess/OmikujiProcessor'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { checkAllConditions } from '@shared/utils/threshold/ThresholdChecker'
import { Comment } from '@onecomme.com/onesdk/'

interface RuleProcessResult {
  isCommentTriggered: boolean
  botMessages: BotMessage[]
}

/**
 * ユーザーコメントの処理
 */
export function processUserComment(comment: Comment): BotMessage[] {
  try {
    const { cooldownManager } = useAppStore()
    const sortedRules = getSortedEnabledRules()

    for (const rule of sortedRules) {
      const result = processRule(comment, rule)

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
function validateThreshold(comment: Comment, rule: CommentRuleType): boolean {
  return checkAllConditions(comment, rule.threshold)
}

/**
 * 単一ルールの処理
 */
function processRule(comment: Comment, rule: CommentRuleType): RuleProcessResult {
  const { cooldownManager } = useAppStore()

  // 1. 閾値条件チェック
  if (!validateThreshold(comment, rule)) {
    return { isCommentTriggered: false, botMessages: [] }
  }

  // 2. 制限チェック（純粋なチェックのみ）
  const restrictionResult = checkRestrictions(comment, rule)

  if (restrictionResult.isBlocked) {
    // 3. 制限チェックの結果からメッセージを生成
    const toastMessages = buildRestrictionMessages(restrictionResult, rule)
    return {
      isCommentTriggered: false,
      botMessages: toastMessages,
    }
  }

  // 4. おみくじ実行
  const omikujiProcessor = new OmikujiProcessor()
  const omikujiMessages = omikujiProcessor.executeOmikuji(rule.omikuji, comment)

  // 5. ユーザー情報の更新
  cooldownManager.updateUserId(
    comment.data.userId,
    rule.key,
    comment.data.displayName ?? comment.data.name,
    omikujiMessages.map((m) => m.comment).join(',')
  )

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
