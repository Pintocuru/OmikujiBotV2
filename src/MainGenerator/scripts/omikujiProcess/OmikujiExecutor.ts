// src/MainGenerator/scripts/OmikujiProcess/OmikujiExecutor.ts
import { OmikujiItemType, OmikujiSetType } from '@/types/OmikujiData/OmikujiSchema'
import { DefaultPlaceholderService } from './DefaultPlaceholderService'
import { PlaceholderProcessor } from '../PlaceholderProcess/PlaceholderProcessor'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { checkAllConditions } from '@shared/utils/threshold/ThresholdChecker'
import { Comment } from '@onecomme.com/onesdk/'

/**
 * おみくじの実行ロジックを担当するクラス
 */
export class OmikujiExecutor {
  private readonly defaultManager = new DefaultPlaceholderService()
  constructor(private readonly placeProcess: PlaceholderProcessor) {}

  /**
   * おみくじの抽選と実行（コメント＋ルール指定）
   */
  executeWithRule(omikujiSet: OmikujiSetType, comment?: Comment): OmikujiItemType | null {
    try {
      const filtered = comment ? this.filterCriteria(omikujiSet, comment) : omikujiSet
      if (!filtered.length) return null

      const omikujiItem = drawOmikuji(filtered) as OmikujiItemType
      if (!omikujiItem) return null

      this.setupPlaceholders(comment)
      return omikujiItem
    } catch (error) {
      ConsolePost('error', `おみくじ実行エラー`, error)
      return null
    }
  }

  /**
   * おみくじの直接実行（アイテム指定）
   */
  executeDirect(omikujiItem: OmikujiItemType, comment?: Comment): OmikujiItemType {
    if (comment) this.setupPlaceholders(comment)
    return omikujiItem
  }

  /**
   * 条件フィルタ＋rank付与
   */
  private filterCriteria(items: OmikujiSetType, comment: Comment): OmikujiSetType {
    return items
      .filter((item) => {
        if (!item.criteria) return true
        return checkAllConditions(comment, item.criteria)
      })
      .map((item) => ({
        ...item,
        rank: item.isPriority ? 1 : 0,
      }))
  }

  /**
   * デフォルトプレースホルダーの設定
   */
  private setupPlaceholders(comment?: Comment): void {
    const defaultPlaceholders = this.defaultManager.getDefaultComments(comment)
    this.placeProcess.updateResolvedValues(defaultPlaceholders)
  }
}
