// src/MainGenerator/stores/ReactionManager/ReactionStatsManager.ts
import { reactionKeys } from '@/types/OmikujiData/ReactionTriggerSchema'

export interface BurstState {
  level: number // 現在のバーストレベル (0〜3)
  levelUpCount: number // 現在レベルに入ってから累積した押数
  peakRate: number // 観測した最大レート（押/秒）
  lastEventTime: number | null // 最後にリアクションを受け取った時刻(ms)
  reachedLevel: number // レベルアップ時にセット（burstReach 消費用）。未消費=-1以外
  droppedLevel: number // レベルダウン時にセット（burstDrop 消費用）。未消費=-1以外
  sustainCount: number // レベル維持中の累積押数（burstSustain 消費用）
}

/** バーストレベル変化コールバック */
export type BurstLevelChangeCallback = (newLevel: number, prevLevel: number) => void

export interface ReactionStatsManagerType {
  record(reactions: Record<string, number>): void
  getTotal(types: string[]): number
  getGrandTotal(): number
  getBurstState(): BurstState
  decrementBurstLevel(): number
  /** バーストレベルが変化したときに呼ばれるコールバックを登録する */
  onBurstLevelChange(callback: BurstLevelChangeCallback): () => void
  reset(): void
  getHistory(): { timestamp: number; type: string }[]
  consumeReachedLevel(): void
  consumeDroppedLevel(): void
  resetSustainCount(): void
}

// バーストしきい値の倍率 (T1, T2, T3)
const BURST_THRESHOLDS = [0.25, 0.5, 0.75] as const
const PEAK_RATE_FLOOR = 30 // 下限：1秒30押（1人が10秒10回 × 3人相当）
const PEAK_RATE_ELAPSED_CAP = 5 // 経過時間の上限（秒）。長時間無操作後の異常値防止

const INITIAL_BURST = (): BurstState => ({
  level: 0,
  levelUpCount: 0,
  peakRate: 0,
  lastEventTime: null,
  reachedLevel: -1,
  droppedLevel: -1,
  sustainCount: 0,
})

export class ReactionStatsManager implements ReactionStatsManagerType {
  private history: { timestamp: number; type: string }[] = []

  private total: Record<string, number> = Object.fromEntries(reactionKeys.map((k) => [k, 0]))

  private burst: BurstState = INITIAL_BURST()

  /** レベル変化コールバックのセット */
  private levelChangeCallbacks = new Set<BurstLevelChangeCallback>()

  // -------------------------------------------------------
  // 公開 API
  // -------------------------------------------------------

  /**
   * リアクションイベントを記録し、バーストレベルを更新する
   * reactions = { heart: 3, smile: 1 } のような形式
   */
  record(reactions: Record<string, number>): void {
    const now = Date.now()
    let totalCount = 0

    for (const type in reactions) {
      const count = reactions[type]
      totalCount += count

      if (this.total[type] !== undefined) {
        this.total[type] += count
      }

      for (let i = 0; i < count; i++) {
        this.history.push({ timestamp: now, type })
      }
    }

    this._updatePeakRate(now, totalCount)
    this._updateBurstLevel(totalCount)
    this.burst.lastEventTime = now
  }

  /**
   * バーストレベルを1下げる（decayタイマーから呼ばれる）
   * @returns 下降後のレベル
   */
  decrementBurstLevel(): number {
    if (this.burst.level > 0) {
      const prev = this.burst.level
      this.burst.level -= 1
      this.burst.levelUpCount = 0
      this.burst.sustainCount = 0
      this.burst.reachedLevel = -1
      this.burst.droppedLevel = this.burst.level // burstDrop 発火マーク
      this._fireLevelChange(this.burst.level, prev)
    }
    return this.burst.level
  }

  /**
   * バーストレベル変化時のコールバックを登録する
   * @returns 登録解除用の関数
   *
   * @example
   * const unsubscribe = reactionStats.onBurstLevelChange((newLevel, prevLevel) => {
   *   if (newLevel > prevLevel) console.log('レベルアップ！')
   * })
   * // 不要になったら解除
   * unsubscribe()
   */
  onBurstLevelChange(callback: BurstLevelChangeCallback): () => void {
    this.levelChangeCallbacks.add(callback)
    return () => this.levelChangeCallbacks.delete(callback)
  }

  /**
   * burstReach の発火後にマークをリセットする（Evaluator が消費後に呼ぶ）
   */
  consumeReachedLevel(): void {
    this.burst.reachedLevel = -1
  }

  /**
   * burstDrop の発火後にマークをリセットする（Evaluator が消費後に呼ぶ）
   */
  consumeDroppedLevel(): void {
    this.burst.droppedLevel = -1
  }

  /**
   * burstSustain の sustainCount をリセットする（Evaluator が消費後に呼ぶ）
   */
  resetSustainCount(): void {
    this.burst.sustainCount = 0
  }

  getBurstState(): BurstState {
    return { ...this.burst }
  }

  /** 指定リアクションの累計（複数対応） */
  getTotal(types: string[]): number {
    return types.reduce((acc, t) => acc + (this.total[t] ?? 0), 0)
  }

  /** 全リアクションの累計合計 */
  getGrandTotal(): number {
    return Object.values(this.total).reduce((a, b) => a + b, 0)
  }

  /** 配信開始時にリセット */
  reset(): void {
    this.history = []
    for (const key in this.total) this.total[key] = 0
    this.burst = INITIAL_BURST()
    // コールバック登録はリセットしない（意図的に維持）
  }

  getHistory() {
    return [...this.history]
  }

  // -------------------------------------------------------
  // 内部処理
  // -------------------------------------------------------

  private _updatePeakRate(now: number, count: number): void {
    if (this.burst.lastEventTime === null) return

    const elapsedSec = Math.min((now - this.burst.lastEventTime) / 1000, PEAK_RATE_ELAPSED_CAP)
    if (elapsedSec <= 0) return

    const rate = count / elapsedSec
    if (rate > this.burst.peakRate) {
      this.burst.peakRate = rate
    }
  }

  private _updateBurstLevel(count: number): void {
    const peak = Math.max(this.burst.peakRate, PEAK_RATE_FLOOR)
    const thresholdIndex = Math.min(this.burst.level, BURST_THRESHOLDS.length - 1)
    const threshold = peak * BURST_THRESHOLDS[thresholdIndex]

    this.burst.levelUpCount += count

    if (this.burst.level < 3 && this.burst.levelUpCount >= threshold) {
      const prev = this.burst.level
      this.burst.level = Math.min(this.burst.level + 1, 3)
      this.burst.reachedLevel = this.burst.level
      this.burst.levelUpCount = 0
      this.burst.sustainCount = 0
      this._fireLevelChange(this.burst.level, prev)
    } else {
      this.burst.sustainCount += count
    }
  }

  private _fireLevelChange(newLevel: number, prevLevel: number): void {
    if (newLevel === prevLevel) return
    for (const cb of this.levelChangeCallbacks) {
      cb(newLevel, prevLevel)
    }
  }
}
