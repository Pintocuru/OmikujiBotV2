// src/MainGenerator/utils/processors/GameScript/ScriptInstanceManager.ts
import { ScriptClass } from '@/types/'
import { gameScriptMap, scriptGameKeys } from '@/common/GameScripts/GameScriptsMap'

export class ScriptInstanceManager {
  private readonly scriptInstances: Record<string, ScriptClass> = {}

  constructor() {}

  /**
   * ゲームスクリプトの初期化
   */
  initializeScripts(): void {
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
   * スクリプトインスタンスを取得
   */
  getScriptInstance(scriptId: string): ScriptClass | null {
    return this.scriptInstances[scriptId] || null
  }

  /**
   * クリーンアップ処理
   */
  cleanup(): void {
    Object.keys(this.scriptInstances).forEach((key) => {
      delete this.scriptInstances[key]
    })
  }
}
