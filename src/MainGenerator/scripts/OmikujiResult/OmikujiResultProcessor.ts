// src/MainGenerator/scripts/OmikujiResult/OmikujiResultProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiDataType, ActionSetType, PostActionType } from '@/types/OmikujiData/'
import { BotMessageGenerator } from './BotMessageGenerator'
import { PlaceholderProcessor } from '@main/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@main/scripts/ContentPlaceholder/context'
import { PostMessage } from '@main/scripts/PostMessage/PostMessage'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { ActionSetExpander } from '@main/scripts/OmikujiProcess/ActionSetExpander'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { createProcessedMessageContent } from './OmikujiResultHelper'
import { ScriptResult } from '@/types'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'

/**
 * おみくじ結果の処理とBotMessage生成を担当
 */
export class OmikujiResultProcessor {
  private readonly placeProcess: PlaceholderProcessor
  private readonly placeContext: PlaceholderContext = new PlaceholderContext()
  private readonly variableProcessor: VariablePlaceholderProcessor = new VariablePlaceholderProcessor()
  private readonly postMessage: PostMessage
  private readonly botMessageGenerator: BotMessageGenerator
  private readonly actionSets: Record<string, ActionSetType>

  constructor(
    omikujiData: OmikujiDataType,
    private readonly scriptManager: GameScriptManager
  ) {
    this.placeProcess = new PlaceholderProcessor(omikujiData.placeholders)
    this.actionSets = omikujiData.actionSets
    this.botMessageGenerator = new BotMessageGenerator(omikujiData)
    this.postMessage = new PostMessage(omikujiData.characters)
  }

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  process(
    actionItem: ActionSetType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): BotMessageType[] {
    try {
      switch (actionItem.type) {
        case 'gameScripts':
          return this.processGameScripts(actionItem, omiken)

        case 'postActions':
          return this.processPostActions(actionItem, defaultPlaceholders, omiken)

        default:
          return []
      }
    } catch (error) {
      const msg = `おみくじ実行エラー ${error}`
      console.error(msg)
      postSystemMessage(msg)
      return []
    }
  }

  /**
   * gameScripts処理
   */
  private processGameScripts(actionItem: ActionSetType, omiken?: OmikenCommentType): BotMessageType[] {
    const scriptResult = this.executeGameScripts(actionItem.gameScripts, omiken)

    // 変数プレースホルダー処理
    const processedActions = this.processVariablePlaceholders(scriptResult.actions)

    // わんコメへ投稿
    this.postMessage.post(processedActions)

    // BotMessageを生成
    return this.botMessageGenerator.generateMessages(processedActions, omiken)
  }

  /**
   * postActions処理: 従来の処理フロー
   */
  private processPostActions(
    actionItem: ActionSetType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): BotMessageType[] {
    // プレースホルダー処理
    this.setupPlaceholders(defaultPlaceholders)

    // おみくじアイテムのpostActionsを展開・プレースホルダー処理
    const processedActions = this.processOmikujiActions(actionItem)
    this.placeContext.clear()

    // 変数プレースホルダー処理
    const finalActions = this.processVariablePlaceholders(processedActions)

    // わんコメへ投稿
    this.postMessage.post(finalActions)

    // BotMessageを生成
    return this.botMessageGenerator.generateMessages(finalActions, omiken)
  }

  private setupPlaceholders(defaultPlaceholders: Record<string, string | number>): void {
    this.placeContext.updateValues(defaultPlaceholders)
    this.placeProcess.updateResolvedValues(this.placeContext.getAll())
  }

  private processOmikujiActions(omikujiItem: ActionSetType): PostActionType[] {
    const expandedActions = ActionSetExpander.expand(omikujiItem.postActions, this.actionSets)
    return this.placeProcess.processPostActions(expandedActions)
  }

  /**
   * 変数プレースホルダーを処理
   */
  private processVariablePlaceholders(actions: PostActionType[]): PostActionType[] {
    return actions.map((action): PostActionType => {
      if (action.actionType === 'message' && action.message.bubble) {
        const result = this.variableProcessor.process(action.message.bubble)
        const processedContent = createProcessedMessageContent(result, action.message.isToast)

        return {
          ...action,
          message: {
            ...action.message,
            bubble: processedContent.bubble,
            // 内部的にrankingを保持（後でBotMessage生成時に使用）
            __processed: processedContent,
          } as any,
        }
      }

      return action
    })
  }

  private executeGameScripts(gameScripts: any, omiken?: OmikenCommentType): ScriptResult {
    if (!gameScripts) return { actions: [], messages: [] }

    const scriptResult = this.scriptManager.playScript(gameScripts, omiken)
    if (!scriptResult) return { actions: [], messages: [] }

    return {
      actions: scriptResult.actions,
      messages: scriptResult.messages,
    }
  }
}
