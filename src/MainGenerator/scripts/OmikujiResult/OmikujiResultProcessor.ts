// src/MainGenerator/scripts/OmikujiResult/OmikujiResultProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiDataType, OmikujiItemType, ActionSetType, PostActionType, GameScriptsType } from '@/types/OmikujiData/'
import { BotMessageGenerator } from './BotMessageGenerator'
import { PlaceholderProcessor } from '@main/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@main/scripts/ContentPlaceholder/context'
import { PostMessage } from '@main/scripts/PostMessage/PostMessage'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { ActionSetExpander } from '@main/scripts/OmikujiProcess/ActionSetExpander'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { ProcessedAction, VariablePlaceholderResult } from './OmikujiResultHelper'
import { ScriptResult } from '@/types'

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
        case 'special':
          // special なら処理しない
          return []

        case 'gameScripts':
          return this.processGameScripts(actionItem, omiken)

        case 'postActions':
          return this.processPostActions(actionItem, defaultPlaceholders, omiken)

        default:
          const _exhaustiveCheck: never = actionItem.type
          ConsolePost('warn', '未知のアクションタイプ:', _exhaustiveCheck)
          return []
      }
    } catch (error) {
      ConsolePost('error', 'おみくじ結果処理エラー', error)
      return []
    }
  }

  /**
   * gameScripts処理
   */
  private processGameScripts(actionItem: ActionSetType, omiken?: OmikenCommentType): BotMessageType[] {
    const scriptResult = this.executeGameScripts(actionItem.gameScripts, omiken)

    // actionsを変数プレースホルダー処理
    const processedActions = this.processVariablePlaceholders(scriptResult.actions)

    // わんコメへ投稿
    this.publishActions(processedActions)

    // scriptResultのmessagesとprocessedActionsから生成したBotMessageを結合
    const generatedMessages = this.botMessageGenerator.generateMessages(processedActions, omiken)
    return [...scriptResult.messages, ...generatedMessages]
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
    this.publishActions(finalActions)

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
   * 変数プレースホルダーを処理してProcessedActionに変換
   */
  private processVariablePlaceholders(actions: PostActionType[]): ProcessedAction[] {
    return actions.map((action): ProcessedAction => {
      if (action.actionType === 'message' && action.message.bubble) {
        const result = this.variableProcessor.process(action.message.bubble)

        const processed: VariablePlaceholderResult = {
          bubble: result.bubble,
          rankingData: result.text
            ? {
                name: result.name,
                text: result.text,
                symbol: result.symbol,
                variant: result.variant,
                unique: result.unique,
              }
            : undefined,
        }

        return {
          ...action,
          message: {
            bubble: processed.bubble,
            isToast: action.message.isToast,
            processed,
          },
        }
      }

      return action as ProcessedAction
    })
  }

  private executeGameScripts(gameScripts: GameScriptsType, omiken?: OmikenCommentType): ScriptResult {
    if (!gameScripts) return { actions: [], messages: [] }

    const scriptResult = this.scriptManager.playScript(gameScripts, omiken)
    if (!scriptResult) return { actions: [], messages: [] }

    return {
      actions: scriptResult.actions,
      messages: scriptResult.messages,
    }
  }

  /**
   * ProcessedActionを元の形式に戻して投稿
   */
  private publishActions(actions: ProcessedAction[]): void {
    if (actions.length === 0) return

    const postActions: PostActionType[] = actions.map((action) => {
      if (action.actionType === 'message') {
        return {
          ...action,
          message: {
            bubble: action.message.bubble,
            isToast: action.message.isToast,
          },
        }
      }
      return action
    })

    this.postMessage.post(postActions)
  }
}
