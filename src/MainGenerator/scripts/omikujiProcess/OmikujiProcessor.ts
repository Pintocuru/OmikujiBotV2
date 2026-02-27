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
import { createFirstBotMessages } from '@main/scripts/RuleProcess/createBotMessages'
import { MetaStateService } from '@main/stores/MetaState/MetaStateService'
import { OmikenCommentType, ServiceMetaCondition } from '@shared/types'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { checkAllTriggers } from '@shared/utils/trigger/TriggerChecker'

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

    // special アクション
    if (actionItem.type === 'special') {
      return this.handleSpecialAction(actionItem)
    }

    const defaultPlaceholders = this.getDefaultPlaceholders(omiken)
    return this.omikujiResult.process(actionItem, defaultPlaceholders, omiken)
  }

  /**
   * special アクションの処理
   */
  private handleSpecialAction(actionItem: ActionSetType): BotMessageType[] {
    const { userSession } = this.store

    if (actionItem.special === 'return') return [BotMessageEmptySchema.parse({})]
    if (actionItem.special === 'continue') return []

    if (actionItem.special === 'reset') {
      userSession.visits.resetRule(actionItem.key)
      return createFirstBotMessages(`${actionItem.name}のおみくじ回数をリセットしたよ`)
    }

    if (actionItem.special === 'log') {
      const totalVisits = userSession.visits.getTotalByRuleId(actionItem.key)
      const totalUnique = userSession.visits.getUniqueCountByRuleId(actionItem.key)
      return createFirstBotMessages(`${actionItem.name}は、総数${totalVisits}回、${totalUnique}人が遊んでくれたよ`)
    }

    return []
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
      userId: this.sanitizeKey(omiken.userId),
      price: omiken.giftPrice,
      lc: omiken.meta.lc,
      tc: omiken.meta.tc,
      draws: omiken.meta.draws,
    })
  }

  // 変数プレースホルダー用のuserId変換器
  private sanitizeKey(raw: string): string {
    let h = 0
    for (let i = 0; i < raw.length; i++) {
      h = (h * 31 + raw.charCodeAt(i)) >>> 0
    }
    return `v${h.toString(36)}`
  }

  /**
   * timer用デフォルトのプレースホルダー情報を設定
   */
  private getBasePlaceholders(): Record<ServiceMetaCondition, string | number> {
    const meta = this.metaStateService.getCurrent()
    const { userSession } = this.store

    // commenter: コメントした全ユーザー数、winner: ランダム当選者
    const lc = userSession.stats.getLiveComments()
    const commenter = userSession.stats.getUniqueCount()
    const syoken = userSession.stats.getSyoken()
    const { winners } = userSession.stats.drawWinners(1)
    const firstWinner = winners[0]

    return DefaultPlaceholdersMetaSchema.parse({
      viewer: meta?.viewer ?? 0,
      upVote: meta?.upVote ?? 0,
      follower: meta?.follower ?? 0,
      lc,
      commenter,
      syoken,
      winner: firstWinner ? `{{icon ${firstWinner.userId}}}${firstWinner.userName}` : 'Null',
    })
  }
}
