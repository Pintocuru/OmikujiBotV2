// src\MainGenerator\scripts\omikujiProcess\GameScriptManager.ts
import { OmikujiItemType, PostActionType } from '@/types/'
import { ScriptInstanceManager } from './ScriptInstanceManager'
import { Comment } from '@onecomme.com/onesdk/'

export class GameScriptManager {
  private readonly scriptInstanceManager: ScriptInstanceManager = new ScriptInstanceManager()

  constructor() {
    // 各マネージャーの初期化
    this.scriptInstanceManager.initializeScripts()
  }

  /**
   * スクリプト実行
   */
  executeScript(omikujiItem: OmikujiItemType, comment?: Comment): PostActionType[] | null {
    if (!omikujiItem.gameScripts) return null
    const { scriptId, scriptParams, characterKey } = omikujiItem.gameScripts

    if (!scriptId) return null

    const scriptInstance = this.scriptInstanceManager.getScriptInstance(scriptId)
    if (!scriptInstance) {
      console.warn(`スクリプトインスタンスが見つかりません: ${scriptId}`)
      return null
    }

    try {
      // スクリプト実行
      return scriptInstance.run(scriptParams, characterKey, comment)
    } catch (error) {
      console.error(`スクリプト実行エラー (${scriptId}):`, error)
      return null
    }
  }
}
