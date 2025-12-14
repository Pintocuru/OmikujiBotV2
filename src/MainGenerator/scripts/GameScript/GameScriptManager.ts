// src\MainGenerator\scripts\omikujiProcess\GameScriptManager.ts
import { OmikujiDataType, CommentRuleType, OmikujiItemType } from '@/types/'
import { ScriptClass, ScriptResult } from '@/types/GameScript/GameScriptTypes'
import { GameState, UserStatsType } from '@/types/GameScript/GameScriptSchema'
import { ScriptInstanceManager } from './ScriptInstanceManager'
import { GameStateManager } from './GameStateManager'
import { RankingDataManager } from './RankingDataManager'
import { Comment } from '@onecomme.com/onesdk/'
import { gameScriptMap } from '@/common/GameScripts/GameScriptsMap'

export class GameScriptManager {
  private readonly scriptInstanceManager: ScriptInstanceManager
  private readonly gameStateManager: GameStateManager
  private readonly rankingDataManager: RankingDataManager

  constructor(omikujiData: OmikujiDataType) {
    this.scriptInstanceManager = new ScriptInstanceManager(omikujiData)
    this.gameStateManager = new GameStateManager()
    this.rankingDataManager = new RankingDataManager()

    this.initializeAll()
  }

  /**
   * 全体の初期化
   */
  private initializeAll(): void {
    const scriptIds = Object.keys(gameScriptMap)

    // 各マネージャーの初期化
    this.scriptInstanceManager.initializeScripts()
    this.gameStateManager.initializeGameStates(scriptIds)
    this.rankingDataManager.initializeRankingData(scriptIds)
  }

  /**
   * スクリプト実行
   */
  executeScript(omikujiItem: OmikujiItemType, comment?: Comment): ScriptResult | null {
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

  // 委譲メソッド群
  getScriptInstance(scriptId: string): ScriptClass | null {
    return this.scriptInstanceManager.getScriptInstance(scriptId)
  }

  getGameState(scriptId: string): GameState | null {
    return this.gameStateManager.getGameState(scriptId)
  }

  getRankingData(scriptId: string): UserStatsType[] | null {
    return this.rankingDataManager.getRankingData(scriptId)
  }

  getAllRankingData(): Record<string, UserStatsType[]> {
    return this.rankingDataManager.getAllRankingData()
  }

  getUserStatistics(scriptId: string, userId: string): UserStatsType | null {
    return this.gameStateManager.getUserStatistics(scriptId, userId)
  }

  getActiveScripts(): string[] {
    return this.scriptInstanceManager.getActiveScripts()
  }
}
