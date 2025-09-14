// src\MainGenerator\scripts\omikujiProcess\GameScriptManager.ts
import { CommentRuleType, OmikujiDataType } from '@/types/'
import { ScriptClass, ScriptResult, UserStatsType, GameState } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { ScriptInstanceManager } from './ScriptInstanceManager'
import { GameStateManager } from './GameStateManager'
import { RankingDataManager } from './RankingDataManager'

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
    const scriptIds = this.scriptInstanceManager.getAvailableScriptIds()

    // 各マネージャーの初期化
    this.scriptInstanceManager.initializeScripts()
    this.gameStateManager.initializeGameStates(scriptIds)
    this.rankingDataManager.initializeRankingData(scriptIds)
  }

  /**
   * スクリプト実行
   */
  executeScript(comment: Comment, rule: CommentRuleType): ScriptResult | null {
    const { scriptId } = rule

    if (!scriptId) return null

    const scriptInstance = this.scriptInstanceManager.getScriptInstance(scriptId)
    if (!scriptInstance) {
      console.warn(`スクリプトインスタンスが見つかりません: ${scriptId}`)
      return null
    }

    try {
      // スクリプト実行
      const result = scriptInstance.run(comment, rule.scriptParams || {})

      // ランキングデータの更新
      const rankingList = scriptInstance.getGameState()?.userRankings
      if (rankingList) {
        this.rankingDataManager.updateRankingData(scriptId, rankingList)
        this.gameStateManager.updateGameState(scriptId, rankingList)
      }

      return result
    } catch (error) {
      console.error(`スクリプト実行エラー (${scriptId}):`, error)
      return null
    }
  }

  /**
   * スクリプトの再初期化
   */
  reinitializeScripts(): void {
    this.cleanup()

    this.scriptInstanceManager.cleanup()
    this.gameStateManager.cleanup()
    this.rankingDataManager.cleanup()

    this.initializeAll()
  }

  /**
   * クリーンアップ処理
   */
  cleanup(): void {
    const activeScripts = this.scriptInstanceManager.getActiveScripts()

    activeScripts.forEach((scriptId) => {
      const instance = this.scriptInstanceManager.getScriptInstance(scriptId)
      const gameState = this.gameStateManager.getGameState(scriptId)

      if (instance?.cleanup && gameState) {
        try {
          instance.cleanup(gameState)
        } catch (error) {
          console.error(`クリーンアップエラー (${scriptId}):`, error)
        }
      }
    })
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

  getAvailableScriptIds(): string[] {
    return this.scriptInstanceManager.getAvailableScriptIds()
  }
}
