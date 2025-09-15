// src\MainGenerator\scripts\OmikujiProcess\OmikujiProcessor.ts
import { CommentRuleType, RuleType } from '@/types/OmikujiData/RulesSchema'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
import { ScriptResult } from '@/types/GameScript/GameScriptTypes'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { GameScriptManager } from '../GameScript/GameScriptManager'
import { DefaultPlaceholderService } from './DefaultPlaceholderService'
import { PlaceProcess } from '../PlaceholderProcess/PlaceProcess'
import { PostMessage } from '@MainScripts/PostMessage/PostMessage'
import { BotMessageGenerator } from '@MainScripts/BotCharacter/BotMessageGenerator'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { Comment } from '@onecomme.com/onesdk/'

export class OmikujiProcessor {
  private readonly placeProcess: PlaceProcess
  private readonly postMessage: PostMessage
  private readonly botMessageGenerator: BotMessageGenerator
  private readonly defaultManager = new DefaultPlaceholderService()

  constructor(
    private readonly omikujiData: OmikujiDataType,
    private readonly scriptManager?: GameScriptManager
  ) {
    this.placeProcess = new PlaceProcess(omikujiData.placeholders)
    this.postMessage = new PostMessage(omikujiData.characters)
    this.botMessageGenerator = new BotMessageGenerator(omikujiData.characters)
  }

  /**
   * おみくじの実行（コメント＋ルール指定）
   */
  executeOmikuji(comment: Comment, rule: RuleType): BotMessage[] {
    const omikujiItem = drawOmikuji(rule.omikuji)
    if (!omikujiItem) return []

    return this.executeOmikujiProcess(comment, rule, omikujiItem)
  }

  /**
   * おみくじの実行（おみくじアイテムを直接指定）
   * コンフィグエディターからの呼び出しなど、 scriptManagerが不要な場合に使用
   */
  executeOmikujiDirect(omikujiItem: OmikujiItemType, comment?: Comment): BotMessage[] {
    try {
      if (comment) {
        const defaultPlaceholders = this.defaultManager.getDefaultComments(comment)
        this.placeProcess.updateResolvedValues(defaultPlaceholders)
      }

      return this.processOmikuji(omikujiItem)
    } catch (error) {
      ConsolePost('error', `おみくじ直接実行エラー`, error)
      return []
    }
  }

  /**
   * おみくじプロセスの実行
   */
  executeOmikujiProcess(comment: Comment, rule: RuleType, omikujiItem: OmikujiItemType): BotMessage[] {
    try {
      const defaultPlaceholders = this.defaultManager.getDefaultComments(comment)
      this.placeProcess.updateResolvedValues(defaultPlaceholders)

      // scriptIdが存在し、scriptManagerが存在する場合のみスクリプトを実行
      const shouldExecuteScript = this.hasValidScript(rule) && this.scriptManager
      let scriptResult: ScriptResult | null = null

      if (shouldExecuteScript) {
        scriptResult = this.scriptManager!.executeScript(comment, rule as CommentRuleType)
      }

      return this.processOmikuji(omikujiItem, scriptResult)
    } catch (error) {
      ConsolePost('error', `おみくじプロセス実行エラー`, error)
      return []
    }
  }

  /**
   * ルールが有効なスクリプトを持っているかチェック
   */
  private hasValidScript(rule: RuleType): boolean {
    // CommentRuleTypeの場合のみscriptIdをチェック
    if (rule.ruleType === 'comments') {
      return !!rule.scriptId
    }
    // TimerRuleTypeの場合はscriptIdが存在しない
    // TODO:TimerでもscriptIdをもたせる予定
    return false
  }

  /**
   * おみくじ処理
   */
  private processOmikuji(omikujiItem: OmikujiItemType, scriptResult?: ScriptResult | null): BotMessage[] {
    try {
      // スクリプト結果がある場合は先に処理
      if (scriptResult) {
        // scriptのプレースホルダーをClassに追加
        this.placeProcess.updateResolvedValues(scriptResult.placeholders)
        // scriptのpostActionsを投稿する
        this.postMessage.post(scriptResult.postActions)
      }

      // プレースホルダー処理
      const postActions = this.placeProcess.processPostActions(omikujiItem.postActions)
      // おみくじのpostActionsを投稿する
      this.postMessage.post(postActions)

      return this.botMessageGenerator.generateMessages(postActions)
    } finally {
      this.placeProcess.clearResolvedValues()
    }
  }
}
