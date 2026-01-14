// src/MainGenerator/scripts/OmikujiResult/OmikujiResultProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiDataType, ActionSetType, PostActionType, PostActionMessageType } from '@/types/OmikujiData/'
import { BotMessageGenerator } from './BotMessageGenerator'
import { PlaceholderProcessor } from '@main/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@main/scripts/ContentPlaceholder/context'
import { PostMessage } from '@main/scripts/PostMessage/PostMessage'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { ActionSetExpander } from '@main/scripts/OmikujiProcess/ActionSetExpander'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'
import { ProcessedPostAction } from '@/types/MainGenerator/OmikujiResultTypes'

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
    const scriptResult = this.scriptManager.playScript(actionItem.gameScripts, omiken)
    if (!scriptResult) return []

    // 1. 変数プレースホルダーを処理
    const processedActions = this.processVariables(scriptResult.actions)

    // 2. わんコメへ投稿 (置換後のアクションを投稿)
    // 互換性のため、PostActionTypeに戻して送信
    this.postMessage.post(processedActions.map((a) => a.action))

    // 3. BotMessageを生成
    return this.botMessageGenerator.generateMessages(processedActions, omiken)
  }

  /**
   * postActions処理
   */
  private processPostActions(
    actionItem: ActionSetType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): BotMessageType[] {
    // プレースホルダー処理
    this.setupPlaceholders(defaultPlaceholders)

    // アクションを展開・プレースホルダー処理
    const expandedActions = ActionSetExpander.expand(actionItem.postActions, this.actionSets)
    const resolvedActions = this.placeProcess.processPostActions(expandedActions)
    this.placeContext.clear()

    // 1. 変数プレースホルダーを処理 (ここでランキング等の解析を行う)
    const processedActions = this.processVariables(resolvedActions)

    // 2. わんコメへ投稿
    this.postMessage.post(processedActions.map((a) => a.action))

    // 3. BotMessageを生成 (解析済みのデータを使用)
    return this.botMessageGenerator.generateMessages(processedActions, omiken)
  }

  /**
   * 変数プレースホルダーを処理し、解析結果を保持する型に変換
   */
  private processVariables(actions: PostActionType[]): ProcessedPostAction[] {
    return actions.map((action): ProcessedPostAction => {
      // message以外、またはbubbleがない場合はそのまま
      if (action.actionType !== 'message' || action.message.bubble) return { action }

      // 変数処理の実行（ランキング抽出等）
      const result = this.variableProcessor.process(action.message.bubble)

      // 投稿用のデータを更新（bubbleを置換後のものに差し替え）
      const updatedAction: PostActionMessageType = {
        ...action,
        message: {
          ...action.message,
          bubble: result.bubble,
        },
      }

      return {
        action: updatedAction,
        variableResult: result, // 解析結果を保持
      }
    })
  }

  private setupPlaceholders(defaultPlaceholders: Record<string, string | number>): void {
    this.placeContext.updateValues(defaultPlaceholders)
    this.placeProcess.updateResolvedValues(this.placeContext.getAll())
  }
}
