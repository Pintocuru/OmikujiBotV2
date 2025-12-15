// src/MainGenerator/utils/processors/GameScript/ScriptInstanceManager.ts
import { OmikujiDataType, ScriptClass } from '@/types/'
import { gameScriptMap, scriptGameKeys } from '@/common/GameScripts/GameScriptsMap'

export class ScriptInstanceManager {
  private readonly scriptInstances: Record<string, ScriptClass> = {}
  private readonly omikujiData: OmikujiDataType

  constructor(omikujiData: OmikujiDataType) {
    this.omikujiData = omikujiData
  }

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
   * アクティブなスクリプトのリストを取得
   */
  getActiveScripts(): string[] {
    return Object.keys(this.scriptInstances)
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
