// src/MainGenerator/scripts/OmikujiProcess/OmikujiResultProcessor.ts
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiDataType } from '@/types'
import { OmikujiItemType, PostActionRecordType, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { PlaceholderProcessor } from '../PlaceholderProcess/PlaceholderProcessor'
import { PostMessage } from '@MainScripts/PostMessage/PostMessage'
import { BotMessageGenerator } from '@MainScripts/BotCharacter/BotMessageGenerator'
import { ActionSetExpander } from './ActionSetExpander'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { GameScriptManager } from '../GameScript/GameScriptManager'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

/**
 * おみくじの処理とメッセージ生成を担当するクラス
 */
export class OmikujiResultProcessor {
  private readonly placeProcess: PlaceholderProcessor
  private readonly postMessage: PostMessage
  private readonly botMessageGenerator: BotMessageGenerator
  private readonly actionSets: Record<string, PostActionRecordType>

  constructor(
    omikujiData: OmikujiDataType,
    private readonly scriptManager: GameScriptManager
  ) {
    // 依存関係の初期化
    this.placeProcess = new PlaceholderProcessor(omikujiData.placeholders)
    this.actionSets = omikujiData.actionSets
    this.botMessageGenerator = new BotMessageGenerator(omikujiData.characters)
    this.postMessage = new PostMessage(omikujiData.characters)
  }

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  process(omikujiItem: OmikujiItemType, omiken?: OmikenCommentType): BotMessage[] {
    try {
      const postActions: PostActionType[] = []

      // おみくじアクションから postActions を生成
      postActions.push(...this.processOmikujiActions(omikujiItem))

      // gameScripts 処理
      if (omikujiItem.gameScripts) {
        const gamePost = this.scriptManager.playScript(omikujiItem, omiken)
        if (gamePost) postActions.push(...gamePost)
      }

      // postActions があれば投稿
      if (postActions) {
        // メッセージ投稿
        this.postMessage.post(postActions)

        // BotMessage生成
        return this.botMessageGenerator.generateMessages(postActions)
      }
      return []
    } catch (error) {
      ConsolePost('error', `おみくじ結果処理エラー`, error)
      return []
    } finally {
      this.placeProcess.clearResolvedValues()
    }
  }

  /**
   * おみくじアクションの処理
   */
  private processOmikujiActions(omikujiItem: PostActionRecordType): PostActionType[] {
    // アクションセットを展開
    const expandedActions = ActionSetExpander.expand(omikujiItem.postActions, this.actionSets)

    // プレースホルダー処理
    const hoge = this.placeProcess.processPostActions(expandedActions)

    // 変数プレースホルダー処理

    const huga = 0

    return hoge
  }

  /**
   * デフォルトプレースホルダーの挿入
   */
  insertDefaultPlaceholders(defaultPlaceholders: Record<string, string | number>): void {
    this.placeProcess.updateResolvedValues(defaultPlaceholders)
  }
}
