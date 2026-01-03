// src/MainGenerator/scripts/OmikujiProcess/OmikujiProcessor.ts
import { OmikujiSetType, OmikujiItemType } from '@/types/'
import { BotMessage } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiResultProcessor } from './OmikujiResultProcessor'
import { useAppStore } from '@main/stores/useAppStore'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { DefaultPlaceholderService } from './DefaultPlaceholderService'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { checkAllTriggers } from '@shared/utils/trigger/TriggerChecker'

/**
 * おみくじ処理の統合クラス
 */
export class OmikujiProcessor {
  private readonly defaultManager = new DefaultPlaceholderService()
  private readonly resultProcessor: OmikujiResultProcessor

  constructor() {
    const appStore = useAppStore()
    this.resultProcessor = new OmikujiResultProcessor(appStore.data, appStore.scriptManager)
  }

  /**
   * おみくじ実行
   */
  executeOmikuji(omikujiSet: OmikujiSetType, omiken?: OmikenCommentType): BotMessage[] {
    // おみくじ
    const omikujiItem = this.lotteryOmikujiItem(omikujiSet, omiken)
    if (!omikujiItem) return []

    // GOD MODE
    if (omikujiItem.gameScripts?.scriptId === 'godMode') {
      this.hoge()
    }

    // デフォルトプレースホルダーを挿入
    const defaultPlaceholders = this.defaultManager.getDefaultComments(omiken)
    this.resultProcessor.insertDefaultPlaceholders(defaultPlaceholders)

    // おみくじ処理
    return this.resultProcessor.process(omikujiItem, omiken)
  }

  /**
   * おみくじ
   */
  private lotteryOmikujiItem(omikujiSet: OmikujiSetType, omiken?: OmikenCommentType): OmikujiItemType | null {
    try {
      const filtered = omiken ? this.filterOmikujiByCriteria(omikujiSet, omiken) : omikujiSet

      if (!filtered.length) return null

      return (drawOmikuji(filtered) as OmikujiItemType) ?? null
    } catch (error) {
      ConsolePost('error', 'おみくじ実行エラー', error)
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
