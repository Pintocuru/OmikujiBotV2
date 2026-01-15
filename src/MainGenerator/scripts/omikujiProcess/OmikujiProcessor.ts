// src/MainGenerator/scripts/OmikujiProcess/OmikujiProcessor.ts
import { OmikujiSetType, ActionSetType } from '@/types/'
import { BotMessageEmptySchema, BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { DefaultPlaceholderService } from './DefaultPlaceholderService'
import { OmikujiResultProcessor } from '@main/scripts/OmikujiResult/OmikujiResultProcessor'
import { useAppStore } from '@main/stores/useAppStore'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { checkAllTriggers } from '@shared/utils/trigger/TriggerChecker'
import { createFirstBotMessages } from '@main/scripts/RuleProcess/RestrictionMessageBuilder'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'

/**
 * おみくじ処理の統合クラス
 */
export class OmikujiProcessor {
  private readonly defaultManager = new DefaultPlaceholderService()
  private readonly omikujiResult: OmikujiResultProcessor

  constructor() {
    const appStore = useAppStore()
    this.omikujiResult = new OmikujiResultProcessor(appStore.data, appStore.scriptManager)
  }

  /**
   * おみくじ実行
   */
  executeOmikuji(omikujiSet: OmikujiSetType, omiken?: OmikenCommentType): BotMessageType[] {
    // おみくじ
    const actionItem = this.lotteryOmikujiItem(omikujiSet, omiken)
    if (!actionItem) return []

    // GOD MODE
    if (actionItem.type === 'special') {
      // return は終了させる
      if (actionItem.special === 'return') {
        return [BotMessageEmptySchema.parse({})]
      }
      // continue は空を返す
      if (actionItem.special === 'continue') {
        return []
      }
      // 回数のリセット
      if (actionItem.special === 'reset') {
        const ruleKey = actionItem.key
        const { userVisitManager } = useAppStore()
        userVisitManager.resetRuleVisits(ruleKey)
        const msg = `${actionItem.name}のおみくじ回数をリセットしたよ`
        return createFirstBotMessages(msg)
      }
      // log は回数を伝える
      if (actionItem.special === 'log') {
        const ruleKey = actionItem.key
        const { userVisitManager } = useAppStore()
        const totalVisits = userVisitManager.getTotalVisitsByRuleId(ruleKey)
        const totalUnique = userVisitManager.getUniqueVisitorCountByRuleId(ruleKey)
        const msg = `${actionItem.name}は、総数${totalVisits}回、${totalUnique}人が遊んでくれたよ`
        return createFirstBotMessages(msg)
      }
    }

    // おみくじ処理
    const defaultPlaceholders = this.defaultManager.getDefaultComments(omiken)
    return this.omikujiResult.process(actionItem, defaultPlaceholders, omiken)
  }

  /**
   * おみくじ
   */
  private lotteryOmikujiItem(omikujiSet: OmikujiSetType, omiken?: OmikenCommentType): ActionSetType | null {
    try {
      const filtered = omiken ? this.filterOmikujiByCriteria(omikujiSet, omiken) : omikujiSet

      if (!filtered.length) return null

      return (drawOmikuji(filtered) as ActionSetType) ?? null
    } catch (error) {
      const msg = `おみくじ実行エラー ${error}`
      console.error(msg)
      postSystemMessage(msg)
      return null
    }
  }

  /**
   * 条件によるおみくじフィルタ
   */
  private filterOmikujiByCriteria(items: OmikujiSetType, omiken: OmikenCommentType): OmikujiSetType {
    return items
      .filter((item) => {
        if (!item.criteria) return true
        return checkAllTriggers(omiken, item.criteria)
      })
      .map((item) => ({
        ...item,
        rank: item.isPriority ? 1 : 0,
      }))
  }

  /**
   * GODMODE
   */
  private hoge() {
    const { cooldownManager } = useAppStore()
  }
}
