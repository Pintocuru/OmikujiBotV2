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
import { Comment } from '@onecomme.com/onesdk/'

/**
 * おみくじの処理とメッセージ生成を担当するクラス
 */
export class OmikujiResultProcessor {
  private readonly postMessage: PostMessage
  private readonly actionSets: Record<string, PostActionRecordType>

  constructor(
    omikujiData: OmikujiDataType,
    private readonly placeProcess: PlaceholderProcessor,
    private readonly botMessageGenerator: BotMessageGenerator,
    private readonly scriptManager: GameScriptManager
  ) {
    this.actionSets = omikujiData.actionSets
    this.postMessage = new PostMessage(omikujiData.characters)
  }

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  process(omikujiItem: OmikujiItemType, comment?: Comment): BotMessage[] {
    try {
      const postActions: PostActionType[] = []
      // gameScripts 処理
      if (omikujiItem.gameScripts) {
        const gamePost = this.scriptManager.executeScript(omikujiItem, comment)
        if (gamePost) postActions.push(...gamePost)
      }

      // おみくじアクションの処理
      postActions.push(...this.processOmikujiActions(omikujiItem))
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
    return this.placeProcess.processPostActions(expandedActions)
  }
}
