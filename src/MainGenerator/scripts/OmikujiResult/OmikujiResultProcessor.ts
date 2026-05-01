// src/MainGenerator/scripts/OmikujiResult/OmikujiResultProcessor.ts
import { BotMessageType } from '@/types'
import { OmikujiDataType, ActionSetType } from '@/types/OmikujiData/'
import { PlaceholderVariableType } from '@main/stores/PlaceholderVariable/PlaceholderVariable'
import { CooldownManager } from '@main/stores/CooldownManager/CooldownManager'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { postSystemMessage } from '@shared/sdk/post/PostOneComme'
import { BotMessageGenerator } from './BotMessageGenerator'
import { PostActionsHandler } from './PostActionsHandler'
import { GameScriptsHandler } from './GameScriptsHandler'

/**
 * おみくじ結果の処理とBotMessage生成を担当
 */
export class OmikujiResultProcessor {
  private readonly postActionsHandler: PostActionsHandler
  private readonly gameScriptsHandler: GameScriptsHandler
  private readonly cooldownManager = CooldownManager.getInstance()

  constructor(
    omikujiData: OmikujiDataType,
    playScript: GameScriptManager['playScript'],
    variable: PlaceholderVariableType
  ) {
    const generator = new BotMessageGenerator(omikujiData, variable)
    this.postActionsHandler = new PostActionsHandler(omikujiData, variable, generator)
    this.gameScriptsHandler = new GameScriptsHandler(playScript, generator)
  }

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  async process(
    actionItem: ActionSetType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): Promise<BotMessageType[]> {
    return this.run(actionItem, defaultPlaceholders, omiken, true) // 投稿あり固定
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
    return this.run(actionItem, defaultPlaceholders, omiken, false)
  }

  private async run(
    actionItem: ActionSetType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): Promise<BotMessageType[]> {
    try {
      const { actionCooldownSeconds = 0 } = actionItem

      if (isOnecommePost) {
        if (this.cooldownManager.checkAndLock(actionCooldownSeconds)) {
          return []
        }
      }

      let messages: BotMessageType[]

      switch (actionItem.type) {
        case 'gameScripts':
          messages = await this.gameScriptsHandler.process(actionItem, omiken, isOnecommePost)
          break

        case 'postActions':
          messages = this.postActionsHandler.process(actionItem, defaultPlaceholders, omiken, isOnecommePost)
          break

        default:
          return []
      }

      return messages
    } catch (error) {
      console.error('おみくじ実行エラー', error)
      postSystemMessage(`おみくじ実行エラー ${error}`)
      return []
    }
  }
}
