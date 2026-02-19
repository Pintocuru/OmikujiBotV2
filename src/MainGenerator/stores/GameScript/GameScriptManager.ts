// src/MainGenerator/scripts/omikujiProcess/GameScriptManager.ts
import { GameScriptsType, ScriptClass, ScriptResult } from '@/types/'
import { gameScriptMap, scriptGameKeys } from '@game/GameScriptsMap'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { UserManager } from '../UserManager/UserManager'

export class GameScriptManager {
  private scriptInstances: Record<string, ScriptClass> = {}
  private static instance: GameScriptManager | null = null
  private userSession?: UserManager

  static getInstance() {
    if (!this.instance) this.instance = new GameScriptManager()
    return this.instance
  }

  private constructor() {
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

        // ★ visitManagerが既に設定されていれば注入
        if (this.userSession && 'initialize' in scriptInstance && typeof scriptInstance.initialize === 'function') {
          scriptInstance.initialize(this.userSession)
        }
      }
    } catch (error) {
      console.error('スクリプト初期化エラー:', error)
    }
  }

  /**
   * スクリプト実行
   */
  playScript = (gameScripts: GameScriptsType, omiken?: OmikenCommentType): ScriptResult | null => {
    if (!gameScripts) return null
    const { scriptId, queryString, characterKey } = gameScripts

    const scriptInstance = this.scriptInstances[scriptId]
    if (!scriptInstance) {
      console.warn(`スクリプトインスタンスが見つかりません: ${scriptId}`)
      return null
    }

    try {
      const scriptResult = scriptInstance.run(queryString, characterKey, omiken)
      // TODO:API送信するならこのタイミングだと思う

      return scriptResult
    } catch (error) {
      console.error(`スクリプト実行エラー (${scriptId}):`, error)
      return null
    }
  }

  /**
   * サンプルラン
   */
  playSampleScript(scriptId: string, queryString: string): string {
    if (!scriptId) return '(スクリプトが指定されていません)'
    const scriptInstance = this.scriptInstances[scriptId]
    if (!scriptInstance) {
      console.warn(`スクリプトインスタンスが見つかりません: ${scriptId}`)
      return 'スクリプトが正常に稼働できません'
    } else if (!scriptInstance.sampleRun) {
      return 'テストに対応していないスクリプトです'
    }

    try {
      return scriptInstance.sampleRun(queryString)
    } catch (error) {
      console.error(`スクリプト実行エラー (${scriptId}):`, error)
      return 'スクリプト実行エラー。詳細はコンソールをご確認ください。'
    }
  }

  /**
   * VisitManager をセット
   */
  setVisitManager(userSession: UserManager) {
    this.userSession = userSession
    // 既存のスクリプトインスタンスに注入
    Object.values(this.scriptInstances).forEach((instance) => {
      if ('initialize' in instance && typeof instance.initialize === 'function') {
        instance.initialize(userSession)
      }
    })
  }

  /**
   * 特定のスクリプトインスタンスをリセット
   */
  reset(scriptKey: string): void {
    if (!this.scriptInstances[scriptKey]) {
      console.warn(`リセット対象のスクリプトが見つかりません: ${scriptKey}`)
      return
    }

    delete this.scriptInstances[scriptKey]

    // 再初期化
    if (gameScriptMap[scriptKey]) {
      this.scriptInstances[scriptKey] = gameScriptMap[scriptKey].execute
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
