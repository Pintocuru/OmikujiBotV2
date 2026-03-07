// src/MainGenerator/scripts/RuleProcess/RuleCommentProcessor.ts
import { BotMessageEmptySchema, BotMessageType, CommentRuleType } from '@/types/'
import { OmikujiSetType } from '@/types/OmikujiData/'
import { buildRestrictionMessages } from '../BotMessage/createBotMessages'
import { checkRestrictions } from '@main/scripts/OmikujiProcess/RestrictionChecker'
import { OmikujiProcessor } from '@main/scripts/OmikujiProcess/OmikujiProcessor'
import { SpecialActionProcessor } from '../OmikujiProcess/SpecialActionProcessor'
import { useAppStore } from '@main/stores/useAppStore'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { checkAllTriggers } from '@shared/utils/trigger/TriggerChecker'
import { POST_SETTINGS } from '@shared/sdk/PostSettings'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { ActionSetType } from '@/types/OmikujiData/'
import { shouldIgnoreUser } from '@/common/filters/shouldIgnoreUser'

const TIME_THRESHOLD = 10000

interface ProcessResult {
  isCommentTriggered: boolean
  botMessages: BotMessageType[]
}

export class EventCommentProcessor {
  private appliedCommentIds = new Set<string>()
  private readonly store = useAppStore()
  private readonly omikujiProcessor = new OmikujiProcessor()
  private readonly specialActionProcessor = new SpecialActionProcessor()

  /**
   * メイン処理: コメントを処理して拡張コメントを作成
   */
  respondToComments(omikens: OmikenCommentType[]): BotMessageType[] {
    if (!omikens.length) return []
    const pattern = this.store.data.settings.ignoreUserPattern

    const botMessages: BotMessageType[] = []
    const limitedComments = omikens.slice().reverse().slice(0, 5)

    for (const omiken of limitedComments) {
      const { id, userId, timestamp } = omiken

      // BOTのコメントがあった時点で処理終了(既に処理されたものなので)
      if (this.isBotComment(userId)) return botMessages

      // 既に処理済みのコメントは処理終了
      if (this.appliedCommentIds.has(id)) return botMessages

      // 除外条件をチェック
      if (this.isOldComment(timestamp)) return botMessages

      // グローバル除外（管理者・BOT・特定ユーザー）
      if (shouldIgnoreUser(omiken.userName, pattern)) continue

      // おみくじチェック
      this.appliedCommentIds.add(id)
      const processedMessages = this.processUserComment(omiken)

      if (processedMessages.length > 0) {
        botMessages.push(...processedMessages)
      }
    }

    return botMessages
  }

  /**
   * ユーザーコメントの処理
   */
  private processUserComment(omiken: OmikenCommentType): BotMessageType[] {
    try {
      const sortedRules = this.getSortedEnabledRules()

      for (const rule of sortedRules) {
        const result = this.processRule(omiken, rule)

        // イベントが成功し、botメッセージが生成された場合はここで終了
        if (result.botMessages.length > 0) {
          if (result.isCommentTriggered) {
            this.store.cooldownManager.updateLastProcessedTime()
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
   * 単一イベントの処理
   */
  private processRule(omiken: OmikenCommentType, rule: CommentRuleType): ProcessResult {
    const { data } = this.store

    // 1. コメントイベントの条件チェック
    if (!checkAllTriggers(omiken, rule.trigger)) {
      return { isCommentTriggered: false, botMessages: [] }
    }

    // 2. 制限チェック
    const restrictionResult = checkRestrictions(omiken, rule)
    if (restrictionResult.isBlocked) {
      const enableSecondary = data.components.enableSecondary
      const toastMessages = buildRestrictionMessages(restrictionResult, rule)
      return {
        isCommentTriggered: false,
        botMessages: enableSecondary ? toastMessages : [],
      }
    }

    // 3. drawsカウンタを omiken.meta に反映
    this.setDrawsMeta(omiken, rule)

    // 4. criteria フィルタ適用後に抽選
    const actionItem = this.lotteryWithCriteria(rule.omikuji, omiken)
    if (!actionItem) return { isCommentTriggered: false, botMessages: [] }

    // 5. special 処理を委譲
    const specialResult = this.specialActionProcessor.process(actionItem, omiken, rule)
    if (specialResult) {
      const { handled, isCountEvent } = specialResult
      if (isCountEvent) this.recordDraw(omiken, rule)
      return {
        isCommentTriggered: handled,
        botMessages: handled ? [BotMessageEmptySchema.parse({})] : [],
      }
    }

    // 6. 通常アクション: カウントしてから実行
    this.recordDraw(omiken, rule)
    const botMessages = this.omikujiProcessor.executeActionItem(actionItem, omiken)
    const isCommentTriggered = rule.trigger.conditions.includes('comment')

    return { isCommentTriggered, botMessages }
  }

  /**
   * criteria フィルタを適用してからおみくじ抽選する。
   * (OmikujiProcessor から移管。コメントイベント専用のフィルタのため)
   */
  private lotteryWithCriteria(omikujiSet: OmikujiSetType, omiken: OmikenCommentType): ActionSetType | null {
    const filtered = omikujiSet
      .filter((item) => {
        if (!item.criteria) return true
        return checkAllTriggers(omiken, item.criteria)
      })
      .map((item) => ({
        ...item,
        rank: item.isPriority ? 1 : 0,
      }))

    if (!filtered.length) return null
    return (drawOmikuji(filtered) as ActionSetType) ?? null
  }

  /**
   * omiken.meta.draws と ruleKey を設定する (抽選前に呼ぶ)
   */
  private setDrawsMeta(omiken: OmikenCommentType, rule: CommentRuleType): void {
    const { userSession } = this.store
    omiken.meta.draws = userSession.visits.getCount(omiken.userId, rule.key) + 1
    omiken.meta.ruleKey = rule.key
  }

  /**
   * ドロー記録
   */
  private recordDraw(omiken: OmikenCommentType, rule: CommentRuleType): void {
    const { userSession } = this.store
    userSession.visits.record(rule.key, UserNameSchema.parse(omiken))
  }

  private getSortedEnabledRules(): CommentRuleType[] {
    return Object.values(this.store.data.comments)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)
  }

  private isBotComment(userId: string): boolean {
    return userId === POST_SETTINGS.botUserId
  }

  private isOldComment(timestamp: number): boolean {
    return Date.now() - timestamp > TIME_THRESHOLD
  }
}
