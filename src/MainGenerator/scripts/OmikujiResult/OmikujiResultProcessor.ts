// src/MainGenerator/scripts/OmikujiResult/OmikujiResultProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiDataType, ActionSetType, PostFlowType, PostFlowMessageType } from '@/types/OmikujiData/'
import { ContentPlaceholder } from '@main/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@main/scripts/ContentPlaceholder/context'
import { PostOmikujiService } from '@main/scripts/PostOmikuji/PostOmikujiService'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { ActionSetExpander } from '@main/scripts/OmikujiProcess/ActionSetExpander'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'
import { ProcessedPostAction } from '@/types/MainGenerator/OmikujiResultTypes'
import { CharacterManager, checkIsCharacterMode } from '../CharacterManager/CharacterManager'
import { createBotMessagesFromAction } from './BotMessageHelpers'
import { playSoundDelay } from '@sounds/PlaySound'
import { POST_SETTINGS } from '@shared/sdk/PostSettings'
import { PlaceholderVariableType } from '@main/stores/PlaceholderVariable/PlaceholderVariable'
import { DisplayVariableResolver } from '../DisplayVariable/DisplayVariableResolver'

/**
 * おみくじ結果の処理とBotMessage生成を担当
 */
export class OmikujiResultProcessor {
  private readonly displayResolver: DisplayVariableResolver
  private readonly placeProcess: ContentPlaceholder
  private readonly placeContext: PlaceholderContext = new PlaceholderContext()

  private readonly variableProcessor: VariablePlaceholderProcessor

  private readonly postMessage: PostOmikujiService
  private readonly characterManager?: CharacterManager
  private readonly actionSets: Record<string, ActionSetType>

  constructor(
    omikujiData: OmikujiDataType,
    private readonly playScript: GameScriptManager['playScript'],
    variable: PlaceholderVariableType
  ) {
    this.displayResolver = new DisplayVariableResolver(variable)
    this.placeProcess = new ContentPlaceholder(omikujiData.placeholders)
    this.variableProcessor = new VariablePlaceholderProcessor(variable)
    this.actionSets = omikujiData.actionSets

    // isCharacterMode の影響を受けるコード
    const isCharacterMode = checkIsCharacterMode(omikujiData)
    this.characterManager = isCharacterMode ? new CharacterManager(omikujiData) : undefined
    this.postMessage = new PostOmikujiService(omikujiData)
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
      console.error('おみくじ実行エラー', error)
      const msg = `おみくじ実行エラー ${error}`
      postSystemMessage(msg)
      return []
    }
  }

  /**
   * gameScripts処理
   */
  private processGameScripts(actionItem: ActionSetType, omiken?: OmikenCommentType): BotMessageType[] {
    // 1. スクリプトの実行
    const scriptResult = this.playScript(actionItem.gameScripts, omiken)
    if (!scriptResult) return []
    const { actions, botMessageExtras: scriptMessages } = scriptResult

    // 2. 変数プレースホルダーを処理
    const processedActions = this.processVariables(actions)

    // 3. わんコメへ投稿 (置換後のアクションを投稿)
    this.postMessage.post(processedActions.map((a) => a.action))

    // 4. BotMessage を生成
    const botMessages = this.generateBotMessages(processedActions, omiken)

    // ゲームスクリプトと生成したメッセージを返す
    return [...scriptMessages, ...botMessages]
  }

  /**
   * postActions処理
   */
  private processPostActions(
    actionItem: ActionSetType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): BotMessageType[] {
    // アクションを展開
    const expandedActions = ActionSetExpander.expand(actionItem.postActions, this.actionSets)

    // 変数展開
    const displayResolved = this.displayResolver.processPostActions(expandedActions)

    // プレースホルダー処理
    this.placeContext.updateValues(defaultPlaceholders)
    this.placeProcess.updateResolvedValues(this.placeContext.getAll())
    const resolvedActions = this.placeProcess.processPostActions(displayResolved)
    this.placeContext.clear()

    // 1. 評価ブロック(変数プレースホルダー)を処理
    const processedActions = this.processVariables(resolvedActions)

    // 2. わんコメへ投稿
    this.postMessage.post(processedActions.map((a) => a.action))

    // 3. BotMessageを生成 (解析済みのデータを使用)
    return this.generateBotMessages(processedActions, omiken)
  }

  /**
   * 処理済みアクションからBotMessageを生成
   */
  private generateBotMessages(processedActions: ProcessedPostAction[], omiken?: OmikenCommentType): BotMessageType[] {
    const messages: BotMessageType[] = []

    for (const item of processedActions) {
      const { action, extra } = item
      const delaySeconds = action.delaySeconds + POST_SETTINGS.basicDelaySeconds

      switch (action.actionType) {
        case 'message':
          messages.push(...createBotMessagesFromAction(action, extra, delaySeconds, this.characterManager, omiken))
          if (action.sound) playSoundDelay(action.sound, delaySeconds)
          break

        case 'sound':
          if (action.sound) playSoundDelay(action.sound, delaySeconds)
          break
      }
    }

    return messages
  }

  /**
   * 変数プレースホルダーを処理し、解析結果を保持する型に変換
   */
  private processVariables(actions: PostFlowType[]): ProcessedPostAction[] {
    return actions.map((action): ProcessedPostAction => {
      // message以外、またはbubbleがない場合はそのまま
      if (action.actionType !== 'message' || !action.message.bubble) return { action }

      // 変数処理の実行（ランキング抽出等）
      const result = this.variableProcessor.process(action.message.bubble)

      // 投稿用のデータを更新（bubbleを置換後のものに差し替え）
      const updatedAction: PostFlowMessageType = {
        ...action,
        message: {
          ...action.message,
          bubble: result.bubble,
        },
      }

      return {
        action: updatedAction,
        extra: result.extra, // 解析結果を保持
      }
    })
  }
}
