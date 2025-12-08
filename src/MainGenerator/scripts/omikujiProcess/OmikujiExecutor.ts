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

  constructor(
    private readonly placeProcess: PlaceholderProcessor,
    private readonly scriptManager?: GameScriptManager
  ) {}

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

      // スクリプト実行
      this.executeScript(comment, omikujiItem)

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

  /**
   * スクリプトの実行
   */
  private executeScript(comment: Comment, omikujiItem: OmikujiItemType): ScriptResult | null {
    // ルールが有効なスクリプトを持っているかチェック
    const shouldExecute = !!omikujiItem.scriptId && this.scriptManager
    if (!shouldExecute) return null

    // Script稼働
    const scriptResult = this.scriptManager.executeScript(comment, omikujiItem)

    // スクリプト結果のプレースホルダーを追加
    if (scriptResult) {
      // scriptのpostActionsを投稿する
      const appStore = useAppStore()
      const characters = appStore.characterCollector.getUsedCharacterData()
      if (characters) {
        const postMessage = new PostMessage(characters)
        postMessage.post(scriptResult.postActions)
      }
    }

    return scriptResult
  }
}
