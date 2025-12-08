// src/MainGenerator/scripts/OmikujiProcess/OmikujiExecutor.ts
import { Comment } from '@onecomme.com/onesdk/'
import { CommentRuleType, RuleType } from '@/types/OmikujiData/RulesSchema'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
import { ScriptResult } from '@/types/GameScript/GameScriptTypes'
import { GameScriptManager } from '../GameScript/GameScriptManager'
import { DefaultPlaceholderService } from './DefaultPlaceholderService'
import { PlaceholderProcessor } from '../PlaceholderProcess/PlaceholderProcessor'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { PostMessage } from '../PostMessage/PostMessage'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'

/**
 * おみくじの実行ロジックを担当するクラス
 */
export class OmikujiExecutor {
  private readonly defaultManager = new DefaultPlaceholderService()

  constructor(private readonly placeProcess: PlaceholderProcessor) {}

  /**
   * おみくじの抽選と実行（コメント＋ルール指定）
   */
  executeWithRule(comment: Comment, rule: RuleType): OmikujiItemType | null {
    try {
      // TODO:新設、2ndの条件設定で外れたものをフィルタリング
      const processedOmikuji = rule.omikuji

      // おみくじ
      const omikujiItem = drawOmikuji(processedOmikuji) as OmikujiItemType
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
  private setupPlaceholders(comment: Comment): void {
    const defaultPlaceholders = this.defaultManager.getDefaultComments(comment)
    this.placeProcess.updateResolvedValues(defaultPlaceholders)
  }
}
