// src/MainGenerator/scripts/OmikujiResult/GameScriptsHandler.ts
import { BotMessageType } from '@/types/'
import { ActionSetType } from '@/types/OmikujiData/'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { BotMessageGenerator } from './BotMessageGenerator'

export class GameScriptsHandler {
  constructor(
    private readonly playScript: GameScriptManager['playScript'],
    private readonly generator: BotMessageGenerator
  ) {}

  /**
   * gameScripts処理
   */
  async process(
    actionItem: ActionSetType,
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): Promise<BotMessageType[]> {
    // 1. スクリプトの実行
    const scriptResult = await this.playScript(actionItem.gameScripts, omiken)
    if (!scriptResult) return []

    const { actions, botMessageExtras: scriptMessages } = scriptResult

    // 2. 変数プレースホルダーを処理
    const processedActions = this.generator.processVariables(actions)

    // 3. わんコメへ投稿 & BotMessage を生成
    return [...scriptMessages, ...this.generator.postAndGenerate(processedActions, omiken, isOnecommePost)]
  }
}
