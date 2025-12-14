// src/MainGenerator/utils/processors/GameScript/RankingDataManager.ts
// ! ランキングは廃止(すべてscriptで処理するので)
import { UserStatsType } from '@/types/'

export class RankingDataManager {
  private rankingData: Record<string, UserStatsType[]> = {}

  /**
   * ランキングデータの初期化
   */
  initializeRankingData(scriptIds: string[]): void {
    scriptIds.forEach((scriptId) => {
      this.rankingData[scriptId] = []
    })
  }

  /**
   * ランキングデータの更新
   */
  updateRankingData(scriptId: string, rankingList: UserStatsType[]): void {
    this.rankingData[scriptId] = rankingList
  }

  /**
   * ランキングデータ取得
   */
  getRankingData(scriptId: string): UserStatsType[] | null {
    return this.rankingData[scriptId] || null
  }

  /**
   * 全てのランキングデータを取得
   */
  getAllRankingData(): Record<string, UserStatsType[]> {
    return { ...this.rankingData }
  }

  /**
   * クリーンアップ処理
   */
  cleanup(): void {
    Object.keys(this.rankingData).forEach((key) => {
      delete this.rankingData[key]
    })
  }
}
