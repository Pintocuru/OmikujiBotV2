// src/MainGenerator/stores/ReactionManager/ReactionStatsManager.ts
export interface ReactionStatsManagerType {
  record(reactions: Record<string, number>): void
  countInLast30Seconds(type: string): number
  getTotal(type: string[]): number
  getGrandTotal(): number
  reset(): void
  getHistory(): { timestamp: number; type: string }[]
}

export class ReactionStatsManager implements ReactionStatsManagerType {
  private history: { timestamp: number; type: string }[] = []

  // 配信全体の累計
  private total: Record<string, number> = {
    heart: 0,
    smile: 0,
    celebrate: 0,
    surprise: 0,
    praise: 0,
  }

  /**
   * リアクションイベントを記録
   * reactions = { heart: 3, smile: 1 } のような形式
   */
  record(reactions: Record<string, number>): void {
    const now = Date.now()

    for (const type in reactions) {
      const count = reactions[type]

      // 30秒履歴
      for (let i = 0; i < count; i++) {
        this.history.push({ timestamp: now, type })
      }

      // 累計
      if (this.total[type] !== undefined) {
        this.total[type] += count
      }
    }

    // 30秒より古いデータを削除
    const THIRTY_SECONDS = 30 * 1000
    this.history = this.history.filter((h) => now - h.timestamp <= THIRTY_SECONDS)
  }

  /**
   * 指定リアクションの30秒以内の回数
   */
  countInLast30Seconds(type: string): number {
    const now = Date.now()
    const THIRTY_SECONDS = 30 * 1000

    return this.history.filter((h) => h.type === type && now - h.timestamp <= THIRTY_SECONDS).length
  }

  /**
   * 指定リアクションの累計（複数対応）
   */
  getTotal(types: string[]): number {
    let total = 0
    for (const t of types) {
      total += this.total[t] ?? 0
    }
    return total
  }

  /**
   * 全リアクションの累計合計
   */
  getGrandTotal(): number {
    let sum = 0
    for (const key in this.total) {
      sum += this.total[key]
    }
    return sum
  }

  /**
   * 配信開始時にリセット
   */
  reset(): void {
    this.history = []
    for (const key in this.total) {
      this.total[key] = 0
    }
  }

  // デバッグ用
  getHistory() {
    return [...this.history]
  }
}
