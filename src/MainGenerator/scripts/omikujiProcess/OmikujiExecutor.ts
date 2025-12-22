// src/MainGenerator/scripts/OmikujiProcess/OmikujiExecutor.ts
import { OmikujiItemType, OmikujiSetType } from '@/types/OmikujiData/OmikujiSchema'
import { DefaultPlaceholderService } from './DefaultPlaceholderService'
import { PlaceholderProcessor } from '../PlaceholderProcess/PlaceholderProcessor'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { checkAllTriggers } from '@shared/utils/trigger/TriggerChecker'

/**
 * おみくじの実行ロジックを担当するクラス
 */
export class OmikujiExecutor {
  private readonly defaultManager = new DefaultPlaceholderService()
  constructor(private readonly placeProcess: PlaceholderProcessor) {}

  /**
   * おみくじの抽選と実行（コメント＋ルール指定）
   */
  executeWithRule(omikujiSet: OmikujiSetType, omiken?: OmikenCommentType): OmikujiItemType | null {
    try {
      const filtered = omiken ? this.filterCriteria(omikujiSet, omiken) : omikujiSet
      if (!filtered.length) return null

      const omikujiItem = drawOmikuji(filtered) as OmikujiItemType
      if (!omikujiItem) return null

      this.setupPlaceholders(omiken)
      return omikujiItem
    } catch (error) {
      ConsolePost('error', `おみくじ実行エラー`, error)
      return null
    }
  }

  /**
   * おみくじの直接実行（アイテム指定）
   */
  executeDirect(omikujiItem: OmikujiItemType, omiken?: OmikenCommentType): OmikujiItemType {
    if (omiken) this.setupPlaceholders(omiken)
    return omikujiItem
  }

  /**
   * 条件フィルタ＋rank付与
   */
  private filterCriteria(items: OmikujiSetType, omiken: OmikenCommentType): OmikujiSetType {
    return items
      .filter((item) => {
        if (!item.criteria) return true
        return checkAllTriggers(omiken, rule.key, item.criteria)
      })
      .map((item) => ({
        ...item,
        rank: item.isPriority ? 1 : 0,
      }))
  }

  /**
   * デフォルトプレースホルダーの設定
   */
  private setupPlaceholders(omiken?: OmikenCommentType): void {
    const defaultPlaceholders = this.defaultManager.getDefaultComments(omiken)
    this.placeProcess.updateResolvedValues(defaultPlaceholders)
  }
}
