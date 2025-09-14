// src/MainGenerator/utils/processors/GameScript/GameStateManager.ts
import { GameState, UserStatsType } from '@/types/'

export class GameStateManager {
  private readonly gameStates: Record<string, GameState> = {}

  /**
   * ゲーム状態の初期化
   */
  initializeGameStates(scriptIds: string[]): void {
    scriptIds.forEach((scriptId) => {
      this.gameStates[scriptId] = {
        ruleId: scriptId,
        totalDraws: 0,
        userStats: {},
        currentUserIds: [],
      }
    })
  }

  /**
   * ゲーム状態を取得
   */
  getGameState(scriptId: string): GameState | null {
    return this.gameStates[scriptId] || null
  }

  /**
   * ゲーム状態の更新
   */
  updateGameState(scriptId: string, rankingList: UserStatsType[]): void {
    const gameState = this.gameStates[scriptId]
    if (!gameState) return

    // 総実行回数の更新
    gameState.totalDraws++

    // ユーザー統計の更新
    for (const userStat of rankingList) {
      const userId = userStat.userId

      // 新規ユーザーの場合は履歴に追加
      if (!gameState.currentUserIds.includes(userId)) {
        gameState.currentUserIds.push(userId)
      }

      // ユーザー統計の更新
      gameState.userStats[userId] = userStat
    }
  }

  /**
   * 特定ユーザーの統計情報を取得
   */
  getUserStatistics(scriptId: string, userId: string): UserStatsType | null {
    const gameState = this.getGameState(scriptId)
    return gameState?.userStats[userId] || null
  }

  /**
   * クリーンアップ処理
   */
  cleanup(): void {
    Object.keys(this.gameStates).forEach((key) => {
      delete this.gameStates[key]
    })
  }
}
