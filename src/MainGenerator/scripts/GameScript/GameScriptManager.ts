// src/MainGenerator/scripts/omikujiProcess/GameScriptManager.ts
import { OmikujiItemType, PostActionType, ScriptClass } from '@/types/'
import { gameScriptMap, scriptGameKeys } from '@/common/GameScripts/GameScriptsMap'
import { Comment } from '@onecomme.com/onesdk/'

export class GameScriptManager {
  private scriptInstances: Record<string, ScriptClass> = {}

  constructor() {
    this.initializeScripts()
  }

  /**
   * ゲームスクリプトの初期化
   */
  private initializeScripts(): void {
    try {
      for (const scriptId of scriptGameKeys) {
        if (this.scriptInstances[scriptId]) continue

        const scriptInstance = gameScriptMap[scriptId].execute
        this.scriptInstances[scriptId] = scriptInstance
      }
    } catch (error) {
      console.error('スクリプト初期化エラー:', error)
    }
  }

  /**
   * スクリプト実行
   */
  playScript(omikujiItem: OmikujiItemType, comment?: Comment): PostActionType[] | null {
    if (!omikujiItem.gameScripts) return null
    const { scriptId, queryString, characterKey } = omikujiItem.gameScripts

    if (!scriptId) return null

    const scriptInstance = this.scriptInstances[scriptId]
    if (!scriptInstance) {
      console.warn(`スクリプトインスタンスが見つかりません: ${scriptId}`)
      return null
    }

    try {
      return scriptInstance.run(queryString, characterKey, comment)
    } catch (error) {
      console.error(`スクリプト実行エラー (${scriptId}):`, error)
      return null
    }
  }

  /**
   * 特定のスクリプトインスタンスをリセット
   */
  reset(scriptId: string): void {
    if (!this.scriptInstances[scriptId]) {
      console.warn(`リセット対象のスクリプトが見つかりません: ${scriptId}`)
      return
    }

    delete this.scriptInstances[scriptId]

    // 再初期化
    if (gameScriptMap[scriptId]) {
      this.scriptInstances[scriptId] = gameScriptMap[scriptId].execute
    }
  }

  /**
   * 全てのスクリプトインスタンスをリセット
   */
  allReset(): void {
    this.scriptInstances = {}
    this.initializeScripts()
  }
}
