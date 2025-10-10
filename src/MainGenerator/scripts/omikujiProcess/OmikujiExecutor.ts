// src/MainGenerator/scripts/OmikujiProcess/OmikujiExecutor.ts
import { Comment } from '@onecomme.com/onesdk/'
import { CommentRuleType, RuleType } from '@/types/OmikujiData/RulesSchema'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
import { ScriptResult } from '@/types/GameScript/GameScriptTypes'
import { GameScriptManager } from '../GameScript/GameScriptManager'
import { DefaultPlaceholderService } from './DefaultPlaceholderService'
import { PlaceholderProcessor } from '../PlaceholderProcess/PlaceholderProcessor'
import { RankingManager } from '../VariablePlaceholder/RankingManager'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'

/**
 * おみくじの実行ロジックを担当するクラス
 */
export class OmikujiExecutor {
  private readonly defaultManager = new DefaultPlaceholderService()

  constructor(
    private readonly placeProcess: PlaceholderProcessor,
    private readonly scriptManager?: GameScriptManager
  ) {}

  /**
   * おみくじの抽選と実行（コメント＋ルール指定）
   */
  executeWithRule(comment: Comment, rule: RuleType): OmikujiItemType | null {
    try {
      // ランキング機能が有効な場合は、事前にランクを設定
      const processedOmikuji = RankingManager.assignRanks(rule.key, rule.omikuji)

      const omikujiItem = drawOmikuji(processedOmikuji) as OmikujiItemType
      if (!omikujiItem) return null

      // プレースホルダー設定
      this.setupPlaceholders(comment)

      // ランキング設定
      this.setupRanking(rule, omikujiItem)

      // スクリプト実行
      const scriptResult = this.executeScript(comment, rule)

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
    if (comment) {
      this.setupPlaceholders(comment)
    }
    return omikujiItem
  }

  /**
   * デフォルトプレースホルダーの設定
   */
  private setupPlaceholders(comment: Comment): void {
    const defaultPlaceholders = this.defaultManager.getDefaultComments(comment)
    this.placeProcess.updateResolvedValues(defaultPlaceholders)
  }

  /**
   * ランキング情報の設定
   */
  private setupRanking(rule: RuleType, omikujiItem: OmikujiItemType): void {
    const rankingScore = omikujiItem.rankingScore
    const totalItems = rule.omikuji.length

    this.placeProcess.setVariableContext(rankingScore, totalItems)
  }

  /**
   * スクリプトの実行
   */
  private executeScript(comment: Comment, rule: RuleType): ScriptResult | null {
    const shouldExecute = this.hasValidScript(rule) && this.scriptManager

    if (!shouldExecute) return null

    const scriptResult = this.scriptManager!.executeScript(comment, rule as CommentRuleType)

    // スクリプト結果のプレースホルダーを追加
    if (scriptResult) {
      this.placeProcess.updateResolvedValues(scriptResult.placeholders)
    }

    return scriptResult
  }

  /**
   * ルールが有効なスクリプトを持っているかチェック
   */
  private hasValidScript(rule: RuleType): boolean {
    // CommentRuleTypeの場合のみscriptIdをチェック
    if (rule.ruleType === 'comments') return !!rule.scriptId

    // TimerRuleTypeの場合はscriptIdが存在しない
    // TODO:TimerでもscriptIdをもたせる予定
    return false
  }
}
