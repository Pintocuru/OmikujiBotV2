// src/MainGenerator/scripts/OmikujiProcess/OmikujiProcessor.ts
import {
  OmikujiSetType,
  ActionSetType,
  DefaultPlaceholdersCommentSchema,
  DefaultPlaceholdersMetaSchema,
} from '@/types/'
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiResultProcessor } from '@main/scripts/OmikujiResult/OmikujiResultProcessor'
import { useAppStore } from '@main/stores/useAppStore'
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
    this.omikujiResult = new OmikujiResultProcessor(
      this.store.data,
      this.store.scriptManager.playScript,
      this.store.placeholderVariable
    )
  }

  /**
   * おみくじ抽選
   */
  lotteryOmikujiItem(omikujiSet: OmikujiSetType, omiken?: OmikenCommentType): ActionSetType | null {
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
    const { liveComments, uniqueCount, syoken } = userSession.stats.getStats()
    const { winners } = userSession.stats.drawWinners(1)
    const firstWinner = winners[0]

    return DefaultPlaceholdersMetaSchema.parse({
      viewer: meta?.viewer ?? 0,
      upVote: meta?.upVote ?? 0,
      follower: meta?.follower ?? 0,
      lc: liveComments,
      commenter: uniqueCount,
      syoken,
      winner: firstWinner ? `{{icon ${firstWinner.userId}}}${firstWinner.userName}` : 'Null',
    })
  }

  executeActionItem(actionItem: ActionSetType, omiken?: OmikenCommentType): BotMessageType[] {
    // 早期return
    if (actionItem.type === 'special') return []
    return this.omikujiResult.process(actionItem, this.getDefaultPlaceholders(omiken), omiken)
  }

  // timer等の既存呼び出し互換用
  executeOmikuji(omikujiSet: OmikujiSetType, omiken?: OmikenCommentType): BotMessageType[] {
    const actionItem = this.lotteryOmikujiItem(omikujiSet, omiken)
    if (!actionItem) return []
    return this.executeActionItem(actionItem, omiken)
  }
}
