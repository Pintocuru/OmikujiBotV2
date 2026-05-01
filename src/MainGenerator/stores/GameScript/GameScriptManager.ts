// src/MainGenerator/stores/GameScript/GameScriptManager.ts
import { GameScriptsType, GameStateType, ScriptClass, ScriptGameKey, ScriptResult } from '@/types'
import { gameExecuteMap } from '@game/GameScriptsMap'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { UserManager } from '../UserManager/UserManager'
import { postSystemMessage } from '@shared/sdk/post/PostOneComme'

export class GameScriptManager {
  private scriptInstances: Record<string, ScriptClass> = {}
  private static instance: GameScriptManager | null = null
  private userManager?: UserManager

  static getInstance() {
    if (!this.instance) this.instance = new GameScriptManager()
    return this.instance
  }

  /**
   * スクリプト実行
   */
  playScript = async (gameScripts: GameScriptsType, omiken?: OmikenCommentType): Promise<ScriptResult | null> => {
    if (!gameScripts) return null
    const { scriptId, queryString, characterKey } = gameScripts
    if (!scriptId) return null

    // キャッシュになければ動的インポート
    if (!this.scriptInstances[scriptId]) {
      try {
        const mod = await gameExecuteMap[scriptId]()
        this.scriptInstances[scriptId] = mod.default
        // userManager の注入
        if (this.userManager && 'initialize' in mod.default) {
          mod.default.initialize(this.userManager)
        }
      } catch (error) {
        console.error(`スクリプトロードエラー (${scriptId}):`, error)
        postSystemMessage(`❌ スクリプトロードエラー: ${error}`)
        return null
      }
    }

    const scriptInstance = this.scriptInstances[scriptId]!
    try {
      return scriptInstance.run(queryString, characterKey, omiken)
    } catch (error) {
      console.error(`スクリプト実行エラー (${scriptId}):`, error)
      postSystemMessage(`❌ スクリプト実行エラー: ${error}`)
      return null
    }
  }

  /**
   * サンプルラン
   */
  async playSampleScript(scriptId: string, queryString: string): Promise<string> {
    if (!scriptId) return '(スクリプトが指定されていません)'

    // キャッシュになければ動的インポートでロード
    if (!this.scriptInstances[scriptId]) {
      try {
        const mod = await gameExecuteMap[scriptId as ScriptGameKey]()
        this.scriptInstances[scriptId] = mod.default
        if (this.userManager && 'initialize' in mod.default) {
          mod.default.initialize(this.userManager)
        }
      } catch (error) {
        console.error(`スクリプトロードエラー (${scriptId}):`, error)
        return 'スクリプトが正常に稼働できません'
      }
    }

    const scriptInstance = this.scriptInstances[scriptId]!
    if (!scriptInstance.sampleRun) return 'テストに対応していないスクリプトです'

    try {
      return scriptInstance.sampleRun(queryString)
    } catch (error) {
      console.error(`スクリプト実行エラー (${scriptId}):`, error)
      return `スクリプト実行エラー(${scriptId}): ${error}`
    }
  }

  /**
   * スクリプトインスタンスをキャッシュから取得、なければ動的インポート
   */
  private async loadScript(scriptId: string): Promise<ScriptClass | null> {
    if (!this.scriptInstances[scriptId]) {
      try {
        const mod = await gameExecuteMap[scriptId as ScriptGameKey]()
        this.scriptInstances[scriptId] = mod.default
        if (this.userManager && 'initialize' in mod.default) {
          mod.default.initialize(this.userManager)
        }
      } catch (error) {
        console.error(`スクリプトロードエラー (${scriptId}):`, error)
        postSystemMessage(`❌ スクリプトロードエラー: ${error}`)
        return null
      }
    }
    return this.scriptInstances[scriptId] ?? null
  }

  /**
   * VisitManager をセット
   */
  setVisitManager(userSession: UserManager) {
    this.userManager = userSession
    // 既存のスクリプトインスタンスに注入
    Object.values(this.scriptInstances).forEach((instance) => {
      if ('initialize' in instance && typeof instance.initialize === 'function') {
        instance.initialize(userSession)
      }
    })
  }

  /**
   * ランキングデータを取得
   */
  getGameState(targetKey: string): GameStateType | null {
    const instance = this.scriptInstances[targetKey as ScriptGameKey]
    if (!instance || !instance.getGameState) return null
    return instance.getGameState()
  }

  /**
   * 特定のスクリプトインスタンスをリセット
   */
  reset(scriptKey: ScriptGameKey): void {
    delete this.scriptInstances[scriptKey]
  }

  /**
   * 全てのスクリプトインスタンスをリセット
   */
  allReset(): void {
    this.scriptInstances = {}
  }
}
