// src\MainGenerator\scripts\RankingProcess\RankingManager.ts
import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'

/**
 * ランキング情報を管理するクラス
 * ブラウザセッション中はランクが永続化される
 */
export class RankingManager {
  // ルールIDごとにランキング情報を保存
  private static rankingCache = new Map<string, Map<string, number>>()

  /**
   * おみくじアイテム配列にランクを設定する
   * 既にランクが設定されていれば再利用、未設定なら新しく生成
   */
  static assignRanks(ruleId: string, omikujiItems: OmikujiItemType[]): OmikujiItemType[] {
    if (omikujiItems.length === 0) return omikujiItems

    try {
      // 既存のランキングがあるかチェック
      const existingRanking = this.rankingCache.get(ruleId)

      if (existingRanking) {
        // 既存ランキングを適用
        return this.applyExistingRanks(omikujiItems, existingRanking)
      } else {
        // 新しいランキングを生成
        return this.generateNewRanks(ruleId, omikujiItems)
      }
    } catch (error) {
      ConsolePost('error', 'ランキング設定エラー', error)
      return omikujiItems // エラー時は元の配列を返す
    }
  }

  /**
   * 既存のランキングを適用
   */
  private static applyExistingRanks(
    omikujiItems: OmikujiItemType[],
    existingRanking: Map<string, number>
  ): OmikujiItemType[] {
    return omikujiItems.map((item) => ({
      ...item,
      rankingScore: existingRanking.get(item.id) || undefined,
    }))
  }

  /**
   * 新しいランキングを生成
   */
  private static generateNewRanks(ruleId: string, omikujiItems: OmikujiItemType[]): OmikujiItemType[] {
    const itemCount = omikujiItems.length

    // 1位から最下位までのランクを生成
    const ranks = Array.from({ length: itemCount }, (_, index) => index + 1)

    // ランクをシャッフル（Fisher-Yates アルゴリズム）
    this.shuffleArray(ranks)

    // 新しいランキングマップを作成
    const newRanking = new Map<string, number>()

    // 各アイテムにランクを割り当て
    const rankedItems = omikujiItems.map((item, index) => {
      const assignedRank = ranks[index]
      newRanking.set(item.id, assignedRank)

      return {
        ...item,
        rankingScore: assignedRank,
      }
    })

    // ランキングをキャッシュに保存
    this.rankingCache.set(ruleId, newRanking)

    return rankedItems
  }

  /**
   * Fisher-Yates シャッフルアルゴリズム
   */
  private static shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  /**
   * 特定のルールのランキングをクリア
   */
  static clearRanking(ruleId: string): void {
    if (this.rankingCache.has(ruleId)) {
      this.rankingCache.delete(ruleId)
      ConsolePost('info', `ランキングをクリアしました (ルールID: ${ruleId})`)
    }
  }

  /**
   * 全てのランキングをクリア
   */
  static clearAllRankings(): void {
    const clearedCount = this.rankingCache.size
    this.rankingCache.clear()
    ConsolePost('info', `全てのランキングをクリアしました (${clearedCount}件)`)
  }

  /**
   * 特定のルールのランキング情報を取得（デバッグ用）
   */
  static getRanking(ruleId: string): Record<string, number> | null {
    const ranking = this.rankingCache.get(ruleId)
    return ranking ? Object.fromEntries(ranking) : null
  }

  /**
   * 全てのランキング情報を取得（デバッグ用）
   */
  static getAllRankings(): Record<string, Record<string, number>> {
    const result: Record<string, Record<string, number>> = {}

    this.rankingCache.forEach((ranking, ruleId) => {
      result[ruleId] = Object.fromEntries(ranking)
    })

    return result
  }

  /**
   * ランキングが存在するかチェック
   */
  static hasRanking(ruleId: string): boolean {
    return this.rankingCache.has(ruleId)
  }
}
