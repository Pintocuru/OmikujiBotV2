// src/MainGenerator/scripts/OmikujiProcess/OmikujiResultProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiDataType, OmikujiItemType, ActionSetType, PostActionType } from '@/types/OmikujiData/'
import { ActionSetExpander } from './ActionSetExpander'
import { PlaceholderProcessor } from '@/MainGenerator/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@/MainGenerator/scripts/ContentPlaceholder/context'
import { PostMessage } from '@main/scripts/PostMessage/PostMessage'
import { BotMessageGenerator } from '@main/scripts/BotMessage/BotMessageGenerator'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'

/**
 * おみくじの処理とメッセージ生成を担当するクラス
 */
export class OmikujiResultProcessor {
  private readonly placeProcess: PlaceholderProcessor
  private readonly placeContext: PlaceholderContext
  private readonly postMessage: PostMessage
  private readonly botMessageGenerator: BotMessageGenerator
  private readonly actionSets: Record<string, ActionSetType>

  constructor(
    omikujiData: OmikujiDataType,
    private readonly scriptManager: GameScriptManager
  ) {
    // 依存関係の初期化
    this.placeProcess = new PlaceholderProcessor(omikujiData.placeholders)
    this.placeContext = new PlaceholderContext()
    this.actionSets = omikujiData.actionSets
    this.botMessageGenerator = new BotMessageGenerator(omikujiData)
    this.postMessage = new PostMessage(omikujiData.characters)
  }

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  process(omikujiItem: OmikujiItemType, omiken?: OmikenCommentType): BotMessageType[] {
    try {
      const postActions: PostActionType[] = []
      const botMessages: BotMessageType[] = []

      // 1. おみくじアクションから postActions を生成
      postActions.push(...this.processOmikujiActions(omikujiItem))

      // 2. gameScripts 処理
      if (omikujiItem.gameScripts) {
        const scriptResult = this.scriptManager.playScript(omikujiItem, omiken)
        if (scriptResult) {
          postActions.push(...scriptResult.actions)
          botMessages.push(...scriptResult.messages)
        }
      }

      // 3. PostAction があれば投稿
      if (postActions.length > 0) {
        this.postMessage.post(postActions)
      }

      // 4. PostAction から BotMessage を生成
      const generated = this.botMessageGenerator.generateMessages(postActions, omiken)

      // 5. スクリプトが直接生成した BotMessage と合体
      return [...botMessages, ...generated]
    } catch (error) {
      ConsolePost('error', `おみくじ結果処理エラー`, error)
      return []
    } finally {
      this.placeContext.clear()
    }
  }

  /**
   * おみくじアクションの処理
   */
  private processOmikujiActions(omikujiItem: ActionSetType): PostActionType[] {
    // アクションセットの展開
    const expandedActions = ActionSetExpander.expand(omikujiItem.postActions, this.actionSets)

    // プレースホルダーを実行
    return this.placeProcess.processPostActions(expandedActions)
  }

  /**
   * デフォルトプレースホルダーの挿入
   */
  insertDefaultPlaceholders(defaultPlaceholders: Record<string, string | number>): void {
    this.placeContext.updateValues(defaultPlaceholders)
    this.placeProcess.updateResolvedValues(this.placeContext.getAll())
  }
}
