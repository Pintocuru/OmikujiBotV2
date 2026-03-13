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
import { OmikenCommentType, ServiceMetaCondition } from '@shared/types'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'

export class OmikujiProcessor {
  private readonly store = useAppStore()
  private readonly omikujiResult: OmikujiResultProcessor

  constructor() {
    this.omikujiResult = new OmikujiResultProcessor(
      this.store.data,
      this.store.scriptManager.playScript,
      this.store.placeholderVariable
    )
  }

  // おみくじ抽選&おみくじ処理
  executeOmikuji(omikujiSet: OmikujiSetType, omiken?: OmikenCommentType): BotMessageType[] {
    const actionItem = this.lotteryOmikujiItem(omikujiSet)
    if (!actionItem) return []
    return this.executeActionItem(actionItem, omiken)
  }

  /**
   * おみくじ抽選。
   * criteria フィルタが必要な場合は呼び出し側で事前に適用すること
   * (コメントイベントは RuleCommentProcessor.lotteryWithCriteria を使用)。
   */
  lotteryOmikujiItem(omikujiSet: OmikujiSetType): ActionSetType | null {
    try {
      if (!omikujiSet.length) return null
      return (drawOmikuji(omikujiSet) as ActionSetType) ?? null
    } catch (error) {
      const msg = `おみくじ実行エラー ${error}`
      console.error(msg)
      postSystemMessage(msg)
      return null
    }
  }

  executeActionItem(actionItem: ActionSetType, omiken?: OmikenCommentType): BotMessageType[] {
    if (actionItem.type === 'special') return []
    const defaultPlaceholders = this.getDefaultPlaceholders(omiken)
    return this.omikujiResult.process(actionItem, defaultPlaceholders, omiken)
  }

  /**
   * comment用デフォルトのプレースホルダー情報を設定
   */
  private getDefaultPlaceholders(omiken?: OmikenCommentType): Record<string, string | number> {
    const basePlaceholders = this.getBasePlaceholders()

    if (!omiken) return basePlaceholders

    return DefaultPlaceholdersCommentSchema.parse({
      ...basePlaceholders,
      user: `{{icon ${omiken.userId}}}${omiken.userName}`,
      userId: this.sanitizeKey(omiken.userId),
      price: omiken.giftPrice,
      lc: omiken.meta.lc,
      tc: omiken.meta.tc,
      draws: omiken.omikuji?.draws,
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
   * デフォルトのプレースホルダー情報を設定
   */
  private getBasePlaceholders(): Record<ServiceMetaCondition, string | number> {
    const meta = this.store.serviceMetaStore.getCurrent()
    const { userSession, streamStats } = this.store

    const uniqueCount = userSession.stats.getUniqueCount()
    const { liveComments, syoken } = streamStats.getStats()
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
}
