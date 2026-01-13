// src/MainGenerator/scripts/omikujiProcess/GameScriptManager.ts
import {
  ActionSetType,
  BotMessageType,
  GameScriptsType,
  OmikujiItemType,
  PostActionType,
  ScriptClass,
  ScriptResult,
} from '@/types/'
import { gameScriptMap, scriptGameKeys } from '@game/GameScriptsMap'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

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
  playScript(gameScripts: GameScriptsType, omiken?: OmikenCommentType): ScriptResult | null {
    if (!gameScripts) return null
    const { scriptId, queryString, characterKey } = gameScripts

    if (!scriptId) return null

    const scriptInstance = this.scriptInstances[scriptId]
    if (!scriptInstance) {
      console.warn(`スクリプトインスタンスが見つかりません: ${scriptId}`)
      return null
    }

    try {
      return scriptInstance.run(queryString, characterKey, omiken)
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
    if (scriptId === 'godMode') return 'Q.お前何様だよ! A.あたしゃ神様だよ'
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
