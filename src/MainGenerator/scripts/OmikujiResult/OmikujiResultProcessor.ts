// src/MainGenerator/scripts/OmikujiResult/OmikujiResultProcessor.ts
import { BotMessageType, ProcessedPostAction } from '@/types/'
import { OmikujiDataType, ActionSetType, PostFlowType } from '@/types/OmikujiData/'
import { createBotMessagesFromAction, createBotMessagesFromVariable } from './BotMessageHelpers'
import { ContentPlaceholder } from '@main/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@main/scripts/ContentPlaceholder/context'
import { PostOmikujiService } from '@main/scripts/PostOmikuji/PostOmikujiService'
import { ActionSetExpander } from '@main/scripts/OmikujiProcess/ActionSetExpander'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { CharacterManager, checkIsCharacterMode } from '@main/scripts/CharacterManager/CharacterManager'
import { DisplayVariableResolver } from '@main/scripts/DisplayVariable/DisplayVariableResolver'
import { PlaceholderVariableType } from '@main/stores/PlaceholderVariable/PlaceholderVariable'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { playSoundDelay } from '@sounds/PlaySound'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { postSystemMessage } from '@shared/sdk/post/PostOneComme'
import { POST_SETTINGS } from '@shared/sdk/PostSettings'

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
  private readonly soundEnabled: boolean
  private readonly enableSecondary: boolean

  constructor(
    omikujiData: OmikujiDataType,
    private readonly playScript: GameScriptManager['playScript'],
    variable: PlaceholderVariableType
  ) {
    this.displayResolver = new DisplayVariableResolver(variable)
    this.placeProcess = new ContentPlaceholder(omikujiData.placeholders)
    this.variableProcessor = new VariablePlaceholderProcessor(variable)
    this.actionSets = omikujiData.actionSets
    this.soundEnabled = omikujiData.settings.soundEnabled

    // isCharacterMode の影響を受けるコード
    const isCharacterMode = checkIsCharacterMode(omikujiData)
    this.characterManager = isCharacterMode ? new CharacterManager(omikujiData) : undefined
    this.enableSecondary = omikujiData.components?.enableSecondary ?? true
    this.postMessage = new PostOmikujiService(omikujiData)
  }

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  async process(
    actionItem: ActionSetType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): Promise<BotMessageType[]> {
    try {
      switch (actionItem.type) {
        case 'gameScripts':
          return await this.processGameScripts(actionItem, omiken, true) // 投稿あり固定

        case 'postActions':
          return this.processPostActions(actionItem, defaultPlaceholders, omiken, true) // 投稿あり固定

        default:
          return []
      }
    } catch (error) {
      console.error('おみくじ実行エラー', error)
      postSystemMessage(`おみくじ実行エラー ${error}`)
      return []
    }
  }

  /**
   * スロット演出用ダミーメッセージを生成。
   * わんコメへの投稿・サウンド再生は行わない。
   */
  async processDummy(
    actionItem: ActionSetType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): Promise<BotMessageType[]> {
    try {
      switch (actionItem.type) {
        case 'gameScripts':
          return await this.processGameScripts(actionItem, omiken, false)

        case 'postActions':
          return this.processPostActions(actionItem, defaultPlaceholders, omiken, false)

        default:
          return []
      }
    } catch (error) {
      console.error('おみくじ実行エラー', error)
      postSystemMessage(`おみくじ実行エラー ${error}`)
      return []
    }
  }

  /**
   * gameScripts処理
   */
  private async processGameScripts(
    actionItem: ActionSetType,
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): Promise<BotMessageType[]> {
    // 1. スクリプトの実行
    const scriptResult = await this.playScript(actionItem.gameScripts, omiken)
    if (!scriptResult) return []

    const { actions, botMessageExtras: scriptMessages } = scriptResult

    // 2. 変数プレースホルダーを処理
    const processedActions = this.processVariables(actions)

    // 3. わんコメへ投稿
    if (isOnecommePost) this.postMessage.post(processedActions.map((a) => a.action))

    // 4. BotMessage を生成
    const botMessages = this.generateBotMessages(processedActions, omiken, isOnecommePost)

    return [...scriptMessages, ...botMessages]
  }

  /**
   * postActions処理
   */
  private processPostActions(
    actionItem: ActionSetType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
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
    const processedActions = isOnecommePost
      ? this.processVariables(resolvedActions)
      : resolvedActions.map((action): ProcessedPostAction => ({ action }))

    // 2. わんコメへ投稿
    if (isOnecommePost) {
      // variable は投稿対象から除外
      const postTargets = processedActions.filter((a) => a.action.actionType !== 'variable')
      this.postMessage.post(postTargets.map((a) => a.action))
    }

    // 3. BotMessageを生成 (解析済みのデータを使用)
    return this.generateBotMessages(processedActions, omiken, isOnecommePost)
  }

  /**
   * 処理済みアクションからBotMessageを生成
   */
  private generateBotMessages(
    processedActions: ProcessedPostAction[],
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    const messages: BotMessageType[] = []

    for (const item of processedActions) {
      const { action, extra } = item
      const delaySeconds = action.delaySeconds + POST_SETTINGS.basicDelaySeconds

      if (action.actionType === 'message') {
        // ここで判定：設定が無効なら、action のコピーを作って isToast を false に書き換える
        const effectiveAction =
          !this.enableSecondary && action.message.isToast
            ? { ...action, message: { ...action.message, isToast: false } }
            : action

        messages.push(
          ...createBotMessagesFromAction(
            effectiveAction, // 書き換え後のアクションを渡す
            extra,
            delaySeconds,
            this.characterManager,
            omiken
          )
        )

        if (action.sound && this.soundEnabled && isOnecommePost) playSoundDelay(action.sound, delaySeconds)
      } else if (action.actionType === 'variable') {
        // 投稿なし・音声なし。変数処理と BotMessage 生成のみ
        messages.push(...createBotMessagesFromVariable(extra, delaySeconds, omiken))
      } else if (action.actionType === 'sound') {
        if (action.sound && this.soundEnabled && isOnecommePost) playSoundDelay(action.sound, delaySeconds)
      }
    }
    return messages
  }

  /**
   * 変数プレースホルダーを処理し、解析結果を保持する型に変換
   */
  private processVariables(actions: PostFlowType[]): ProcessedPostAction[] {
    return actions.map((action): ProcessedPostAction => {
      // message と variable のみ処理。それ以外またはbubbleがない場合はそのまま
      if (action.actionType !== 'message' && action.actionType !== 'variable') return { action }
      if (!action.message.bubble) return { action }

      // 変数処理の実行（ランキング抽出等）
      const result = this.variableProcessor.process(action.message.bubble)

      // bubbleを置換後のものに差し替え
      const updatedAction = {
        ...action,
        message: {
          ...action.message,
          bubble: result.bubble,
        },
      }

      return {
        action: updatedAction,
        extra: result.extra,
      }
    })
  }
}
