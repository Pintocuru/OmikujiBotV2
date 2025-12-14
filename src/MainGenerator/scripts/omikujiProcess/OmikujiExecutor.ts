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
    let processedOmikujiSet: OmikujiSetType = omikujiSet

    try {
      if (comment) {
        // 条件を満たさない項目をフィルタリング
        processedOmikujiSet = omikujiSet.filter((item) => {
          if (!item.criteria) return true
          // checkAllConditionsがtrueの項目のみ残す
          return checkAllConditions(comment, item.criteria)
        })
        if (!processedOmikujiSet.length) return null
      }

      // おみくじ
      const omikujiItem = drawOmikuji(processedOmikujiSet) as OmikujiItemType
      if (!omikujiItem) return null

      // デフォルトプレースホルダー設定
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
   * デフォルトプレースホルダーの設定
   */
  private setupPlaceholders(comment?: Comment): void {
    const defaultPlaceholders = this.defaultManager.getDefaultComments(comment)
    this.placeProcess.updateResolvedValues(defaultPlaceholders)
  }
}
