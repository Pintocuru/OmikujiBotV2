// src/MainGenerator/scripts/OmikujiProcess/OmikujiResultProcessor.ts
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiItemType, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { ScriptResult } from '@/types/GameScript/GameScriptTypes'
import { PlaceholderProcessor } from '../PlaceholderProcess/PlaceholderProcessor'
import { PostMessage } from '@MainScripts/PostMessage/PostMessage'
import { BotMessageGenerator } from '@MainScripts/BotCharacter/BotMessageGenerator'
import { ActionSetExpander } from './ActionSetExpander'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'

/**
 * おみくじ結果の処理とメッセージ生成を担当するクラス
 */
export class OmikujiResultProcessor {
  constructor(
    private readonly placeProcess: PlaceholderProcessor,
    private readonly postMessage: PostMessage,
    private readonly botMessageGenerator: BotMessageGenerator
  ) {}

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  process(omikujiItem: OmikujiItemType, scriptResult?: ScriptResult | null): BotMessage[] {
    try {
      // スクリプト結果の処理
      if (scriptResult) {
        this.processScriptResult(scriptResult)
      }

      // おみくじアクションの処理
      const postActions = this.processOmikujiActions(omikujiItem)

      // メッセージ投稿
      this.postMessage.post(postActions)

      // BotMessage生成
      return this.botMessageGenerator.generateMessages(postActions)
    } catch (error) {
      ConsolePost('error', `おみくじ結果処理エラー`, error)
      return []
    } finally {
      this.placeProcess.clearResolvedValues()
    }
  }

  /**
   * スクリプト結果の処理
   */
  private processScriptResult(scriptResult: ScriptResult): void {
    // プレースホルダーを追加
    this.placeProcess.updateResolvedValues(scriptResult.placeholders)

    // postActionsを投稿
    this.postMessage.post(scriptResult.postActions)
  }

  /**
   * おみくじアクションの処理
   */
  private processOmikujiActions(omikujiItem: OmikujiItemType): PostActionType[] {
    const appStore = useAppStore()
    const actionSets = appStore.data.actionSets

    // アクションセットを展開
    const expandedActions = ActionSetExpander.expand(omikujiItem.postActions, actionSets)

    // プレースホルダー処理
    return this.placeProcess.processPostActions(expandedActions)
  }
}
