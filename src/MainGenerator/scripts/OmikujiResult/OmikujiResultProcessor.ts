// src/MainGenerator/scripts/OmikujiResult/OmikujiResultProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import {
  OmikujiDataType,
  OmikujiItemType,
  ActionSetType,
  PostActionType,
  PostActionMessageType,
} from '@/types/OmikujiData/'
import { BotMessageGenerator } from './BotMessageGenerator'
import { PlaceholderProcessor } from '@main/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@main/scripts/ContentPlaceholder/context'
import { PostMessage } from '@main/scripts/PostMessage/PostMessage'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { ActionSetExpander } from '@main/scripts/OmikujiProcess/ActionSetExpander'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { ExpressionEvaluator } from '@main/scripts/VariablePlaceholder/ExpressionEvaluator'

/**
 * 変数プレースホルダー処理結果を含むPostAction
 */
interface ProcessedPostActionMessage extends Omit<PostActionMessageType, 'message'> {
  actionType: 'message'
  message: PostActionMessageType['message'] & {
    // 処理済みの追加情報
    _processed?: {
      bubble: string | null
      rankingData?: {
        name: string
        text: string
        symbol?: string
        variant?: string
        unique?: string
      }
    }
  }
}

type ProcessedPostActionType = ProcessedPostActionMessage | Exclude<PostActionType, PostActionMessageType>

/**
 * おみくじの処理とメッセージ生成を担当するクラス
 *
 * 処理フロー:
 * 1. おみくじアイテムのpostActionsを展開・プレースホルダー処理
 * 2. gameScriptsがあれば実行
 * 3. **変数プレースホルダーを1回だけ処理（投稿用とメッセージ生成用の両方に適用）**
 * 4. postActionsを外部システムに投稿
 * 5. postActionsからBotMessageを生成
 * 6. gameScriptsが生成したBotMessageと統合
 */
export class OmikujiResultProcessor {
  private readonly placeProcess: PlaceholderProcessor
  private readonly placeContext: PlaceholderContext
  private readonly postMessage: PostMessage
  private readonly botMessageGenerator: BotMessageGenerator
  private readonly actionSets: Record<string, ActionSetType>
  private readonly variableProcessor: VariablePlaceholderProcessor

  constructor(
    omikujiData: OmikujiDataType,
    private readonly scriptManager: GameScriptManager
  ) {
    this.placeProcess = new PlaceholderProcessor(omikujiData.placeholders)
    this.placeContext = new PlaceholderContext()
    this.actionSets = omikujiData.actionSets
    this.botMessageGenerator = new BotMessageGenerator(omikujiData)
    this.postMessage = new PostMessage(omikujiData.characters)

    // 変数プレースホルダープロセッサを初期化
    const evaluator = new ExpressionEvaluator()
    this.variableProcessor = new VariablePlaceholderProcessor(evaluator)
  }

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  process(
    omikujiItem: OmikujiItemType,
    omiken: OmikenCommentType | undefined,
    defaultPlaceholders: Record<string, string | number>
  ): BotMessageType[] {
    try {
      // デフォルトプレースホルダーの設定
      this.setupPlaceholders(defaultPlaceholders)

      // おみくじアクションの処理と展開
      const processedActions = this.processOmikujiActions(omikujiItem)

      // ゲームスクリプトの実行（あれば）
      const scriptResult = this.executeGameScripts(omikujiItem, omiken)

      // すべてのアクションを統合
      const allActions = [...processedActions, ...scriptResult.actions]

      // 🔥 変数プレースホルダーを1回だけ処理（投稿前に実行）
      const finalActions = this.processVariablePlaceholdersOnce(allActions)

      // 外部システムへの投稿（処理済みアクションを使用）
      this.publishActions(finalActions)

      // BotMessageの生成と統合（処理済みアクションを使用）
      const generatedMessages = this.botMessageGenerator.generateMessages(finalActions, omiken)
      const allMessages = [...scriptResult.messages, ...generatedMessages]

      return allMessages
    } catch (error) {
      ConsolePost('error', 'おみくじ結果処理エラー', error)
      return []
    } finally {
      this.placeContext.clear()
    }
  }

  /**
   * デフォルトプレースホルダーの設定
   */
  private setupPlaceholders(defaultPlaceholders: Record<string, string | number>): void {
    this.placeContext.updateValues(defaultPlaceholders)
    this.placeProcess.updateResolvedValues(this.placeContext.getAll())
  }

  /**
   * おみくじアクションの処理
   * - actionSetの展開
   * - プレースホルダーの解決
   */
  private processOmikujiActions(omikujiItem: ActionSetType): PostActionType[] {
    const expandedActions = ActionSetExpander.expand(omikujiItem.postActions, this.actionSets)
    return this.placeProcess.processPostActions(expandedActions)
  }

  /**
   * 変数プレースホルダーを1回だけ処理
   *
   * すべてのPostActionに対して変数プレースホルダーを処理し、
   * 投稿やメッセージ生成で使用できる形に変換する。
   *
   * 処理結果は_processedフィールドに格納し、MessageProcessorで再利用する。
   */
  private processVariablePlaceholdersOnce(actions: PostActionType[]): ProcessedPostActionType[] {
    return actions.map((action): ProcessedPostActionType => {
      if (action.actionType === 'message' && action.message.bubble) {
        // bubble内の変数プレースホルダーを1回だけ処理
        const result = this.variableProcessor.process(action.message.bubble)

        return {
          ...action,
          message: {
            ...action.message,
            // 投稿用に処理済みのbubbleテキストに置き換え
            bubble: result.bubble || action.message.bubble,
            // メッセージ生成用に処理結果を保存
            _processed: {
              bubble: result.bubble || null,
              rankingData: result.text
                ? {
                    name: result.name,
                    text: result.text,
                    symbol: result.symbol,
                    variant: result.variant,
                    unique: result.unique,
                  }
                : undefined,
            },
          },
        } as ProcessedPostActionMessage
      }
      return action as ProcessedPostActionType
    })
  }

  /**
   * ゲームスクリプトの実行
   */
  private executeGameScripts(
    omikujiItem: OmikujiItemType,
    omiken: OmikenCommentType | undefined
  ): { actions: PostActionType[]; messages: BotMessageType[] } {
    if (!omikujiItem.gameScripts) {
      return { actions: [], messages: [] }
    }

    const scriptResult = this.scriptManager.playScript(omikujiItem, omiken)
    if (!scriptResult) {
      return { actions: [], messages: [] }
    }

    return {
      actions: scriptResult.actions,
      messages: scriptResult.messages,
    }
  }

  /**
   * PostActionの外部システムへの投稿
   */
  private publishActions(actions: ProcessedPostActionType[]): void {
    if (actions.length > 0) {
      // ProcessedPostActionTypeはPostActionTypeと互換性がある
      this.postMessage.post(actions as PostActionType[])
    }
  }
}
