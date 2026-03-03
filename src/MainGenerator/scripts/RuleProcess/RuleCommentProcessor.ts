// src/MainGenerator/scripts/RuleProcess/RuleCommentProcessor.ts
import { BotMessageEmptySchema, BotMessageType, CommentRuleType } from '@/types/'
import { buildRestrictionMessages, createFirstBotMessages } from './createBotMessages'
import { checkRestrictions } from '@main/scripts/OmikujiProcess/RestrictionChecker'
import { OmikujiProcessor } from '@main/scripts/OmikujiProcess/OmikujiProcessor'
import { useAppStore } from '@main/stores/useAppStore'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { checkAllTriggers } from '@shared/utils/trigger/TriggerChecker'
import { POST_SETTINGS } from '@shared/sdk/PostSettings'

const TIME_THRESHOLD = 10000

interface RuleProcessResult {
  isCommentTriggered: boolean
  botMessages: BotMessageType[]
}

export class RuleCommentProcessor {
  private appliedCommentIds = new Set<string>()
  private readonly store = useAppStore()
  private readonly omikujiProcessor = new OmikujiProcessor()

  /**
   * メイン処理: コメントを処理して拡張コメントを作成
   */
  respondToComments(omikens: OmikenCommentType[]): BotMessageType[] {
    if (!omikens.length) return []

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

        // ルールが成功し、botメッセージが生成された場合はここで終了
        if (result.botMessages.length > 0) {
          // コメントでの発動なら、クールダウンを設定する
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
   * 単一ルールの処理
   */
  private processRule(omiken: OmikenCommentType, rule: CommentRuleType): RuleProcessResult {
    const { userSession, data } = this.store

    // 1. コメントルールの条件チェック
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

    // 3. 先に抽選してspecialかどうかを確認
    const actionItem = this.omikujiProcessor.lotteryOmikujiItem(rule.omikuji, omiken)
    if (!actionItem) return { isCommentTriggered: false, botMessages: [] }

    // 4. specialの場合はインクリメントせず即実行
    if (actionItem.type === 'special') {
      // return なら、カウントはして止める
      if (actionItem.special === 'return') {
        this.draw(omiken, rule)
        return { isCommentTriggered: true, botMessages: [BotMessageEmptySchema.parse({})] }
      }

      // return なら、カウントはせずスルーする
      if (actionItem.special === 'continue') {
        return { isCommentTriggered: false, botMessages: [] }
      }

      // おみくじ回数リセット
      if (actionItem.special === 'reset') {
        userSession.visits.resetRule(actionItem.key)
        return {
          isCommentTriggered: false,
          botMessages: createFirstBotMessages(`${actionItem.name}のおみくじ回数をリセットしたよ`),
        }
      }

      // ログを出す
      if (actionItem.special === 'log') {
        const totalVisits = userSession.visits.getTotalByRuleId(actionItem.key)
        const totalUnique = userSession.visits.getUniqueCountByRuleId(actionItem.key)
        return {
          isCommentTriggered: false,
          botMessages: createFirstBotMessages(
            `${actionItem.name}は、総数${totalVisits}回、${totalUnique}人が遊んでくれたよ`
          ),
        }
      }

      // フォールバック:continue と同じ
      return { isCommentTriggered: false, botMessages: [] }
    }

    // 5. インクリメント
    this.draw(omiken, rule)

    // 6. 抽選済みアイテムで実行
    const botMessages = this.omikujiProcessor.executeActionItem(actionItem, omiken)
    const isCommentTriggered = rule.trigger.conditions.includes('comment')

    return { isCommentTriggered, botMessages }
  }

  private getSortedEnabledRules(): CommentRuleType[] {
    return Object.values(useAppStore().data.comments)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)
  }

  private draw(omiken: OmikenCommentType, rule: CommentRuleType): void {
    const { userSession } = this.store
    omiken.meta.draws = userSession.visits.getCount(omiken.userId, rule.key) + 1
    omiken.meta.ruleKey = rule.key
    userSession.visits.record(rule.key, UserNameSchema.parse(omiken))
  }

  /**
   * Botのコメントかどうかを判定
   */
  private isBotComment(userId: string): boolean {
    return userId === POST_SETTINGS.botUserId
  }

  /**
   * 古いコメント（時間閾値を超過）かどうかを判定
   */
  private isOldComment(timestamp: number): boolean {
    return Date.now() - timestamp > TIME_THRESHOLD
  }
}
