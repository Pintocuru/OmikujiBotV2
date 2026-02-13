// src/MainGenerator/scripts/OmikujiProcess/OmikujiProcessor.ts
import {
  OmikujiSetType,
  ActionSetType,
  DefaultPlaceholdersCommentSchema,
  DefaultPlaceholdersMetaSchema,
} from '@/types/'
import { BotMessageEmptySchema, BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiResultProcessor } from '@main/scripts/OmikujiResult/OmikujiResultProcessor'
import { useAppStore } from '@main/stores/useAppStore'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { checkAllTriggers } from '@shared/utils/trigger/TriggerChecker'
import { createFirstBotMessages } from '@/MainGenerator/scripts/RuleProcess/createBotMessages'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'
import { MetaStateService } from '@main/scripts/MetaState/MetaStateService'
import { ServiceMetaCondition } from '@shared/types'

export class OmikujiProcessor {
  private readonly store = useAppStore()
  private readonly metaStateService = MetaStateService.getInstance()
  private readonly omikujiResult: OmikujiResultProcessor

  constructor() {
    this.omikujiResult = new OmikujiResultProcessor(this.store.data, this.store.scriptManager.playScript)
  }

  /**
   * おみくじ実行
   */
  executeOmikuji(omikujiSet: OmikujiSetType, omiken?: OmikenCommentType): BotMessageType[] {
    const actionItem = this.lotteryOmikujiItem(omikujiSet, omiken)
    if (!actionItem) return []

    // special
    if (actionItem.type === 'special') {
      const { userVisitManager } = this.store

      if (actionItem.special === 'return') {
        return [BotMessageEmptySchema.parse({})]
      }

      if (actionItem.special === 'continue') {
        return []
      }

      if (actionItem.special === 'reset') {
        const ruleKey = actionItem.key
        userVisitManager.resetRuleVisits(ruleKey)
        return createFirstBotMessages(`${actionItem.name}のおみくじ回数をリセットしたよ`)
      }

      if (actionItem.special === 'log') {
        const ruleKey = actionItem.key
        const totalVisits = userVisitManager.getTotalVisitsByRuleId(ruleKey)
        const totalUnique = userVisitManager.getUniqueVisitorCountByRuleId(ruleKey)
        return createFirstBotMessages(`${actionItem.name}は、総数${totalVisits}回、${totalUnique}人が遊んでくれたよ`)
      }
    }

    const defaultPlaceholders = this.getDefaultPlaceholders(omiken)
    return this.omikujiResult.process(actionItem, defaultPlaceholders, omiken)
  }

  /**
   * おみくじ抽選
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
   * 条件フィルタ
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
   * comment用デフォルトのプレースホルダー情報を設定
   */
  private getDefaultPlaceholders(omiken?: OmikenCommentType): Record<string, string | number> {
    const base = this.getBasePlaceholders()

    if (!omiken) return base

    return DefaultPlaceholdersCommentSchema.parse({
      ...base,
      user: `{{icon ${omiken.userId}}}${omiken.userName}`,
      userId: omiken.userId,
      price: omiken.giftPrice,
      lc: omiken.meta.lc,
      tc: omiken.meta.tc,
      draws: omiken.meta.draws,
    })
  }

  /**
   * timer用デフォルトのプレースホルダー情報を設定
   */
  private getBasePlaceholders(): Record<ServiceMetaCondition, string | number> {
    const meta = this.metaStateService.getCurrent()
    const { userVisitManager } = this.store
    const { commenter, winners } = userVisitManager.getLiveComment()

    const winner = winners[0]?.userName ?? 'Null'

    return DefaultPlaceholdersMetaSchema.parse({
      viewer: meta?.viewer ?? 0,
      upVote: meta?.upVote ?? 0,
      commenter,
      winner,
    })
  }
}
