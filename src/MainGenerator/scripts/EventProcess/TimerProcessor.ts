// src/MainGenerator/scripts/EventProcess/TimerProcessor.ts
import { TimerEventType } from '@/types/OmikujiData/'
import { OmikujiProcessor } from '@main/scripts/OmikujiProcess/OmikujiProcessor'
import { useAppStore } from '@main/stores/useAppStore'

interface TimerState {
  timerId: number
  initialTimerId?: number
  intervalMs: number
  isActive: boolean
}

/**
 * タイマーイベントの実行を管理
 *
 * データは useAppStore から直接取得します。
 * データが更新された場合は、stopTimers() を呼んでから startTimers() を再度呼び出してください。
 */
export class EventTimerProcessor {
  private readonly activeTimers = new Map<string, TimerState>()
  private readonly omikujiProcessor: OmikujiProcessor = new OmikujiProcessor()

  /**
   * すべてのタイマーを開始
   * onStart イベントは即時実行のみ行い、タイマー管理には含めない
   */
  startTimers(): void {
    this.stopTimers()

    const appStore = useAppStore()
    const enabledTimers = Object.values(appStore.data.timers)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    enabledTimers.forEach((rule) => {
      if (rule.mode === 'onStart') {
        this.executeOnStart(rule)
      } else {
        // mode === 'interval'（デフォルト）
        this.startIntervalTimer(rule)
      }
    })
  }

  /**
   * onStart モード: 起動時に一度だけ scheduleBotMessages を直接呼び出す
   */
  private executeOnStart(rule: TimerEventType): void {
    try {
      const appStore = useAppStore()
      const omikujiMessages = this.omikujiProcessor.executeOmikuji(rule.omikuji)
      appStore.scheduleBotMessages(omikujiMessages)
    } catch (error) {
      console.error(`onStart ${rule.key} execution error:`, error)
    }
  }

  /**
   * interval モード: 定期実行
   */
  private startIntervalTimer(rule: TimerEventType): void {
    const intervalMs = rule.intervalSeconds * 1000
    let initialDelay = intervalMs

    // isBaseZeroがtrueの場合、0分0秒を基準にする
    if (rule.isBaseZero) {
      const now = new Date()
      const msSinceHourStart = now.getMinutes() * 60_000 + now.getSeconds() * 1000 + now.getMilliseconds()
      initialDelay = intervalMs - (msSinceHourStart % intervalMs)
    }

    // 初回実行用のタイマー
    const initialTimerId = window.setTimeout(() => {
      this.executeTimer(rule)

      // 定期実行を開始
      const intervalTimerId = window.setInterval(() => {
        this.executeTimer(rule)
      }, intervalMs)

      // タイマー状態を更新
      const timerState = this.activeTimers.get(rule.key)
      if (timerState) {
        timerState.timerId = intervalTimerId
        timerState.initialTimerId = undefined
      }
    }, initialDelay)

    // タイマー状態を記録
    this.activeTimers.set(rule.key, {
      timerId: 0, // 後で更新される
      initialTimerId,
      intervalMs,
      isActive: true,
    })
  }

  /**
   * タイマー実行時の処理
   */
  private executeTimer(rule: TimerEventType): void {
    try {
      const appStore = useAppStore()
      const omikujiMessages = this.omikujiProcessor.executeOmikuji(rule.omikuji)
      appStore.scheduleBotMessages(omikujiMessages)
    } catch (error) {
      console.error(`Timer ${rule.key} execution error:`, error)
    }
  }

  /**
   * すべてのタイマーを停止
   */
  stopTimers(): void {
    this.activeTimers.forEach((timerState) => {
      this.clearTimer(timerState)
    })
    this.activeTimers.clear()
  }

  /**
   * 特定のタイマーを停止
   */
  stopTimer(ruleId: string): void {
    const timerState = this.activeTimers.get(ruleId)
    if (timerState) {
      this.clearTimer(timerState)
      this.activeTimers.delete(ruleId)
    }
  }

  /**
   * タイマーをクリア
   */
  private clearTimer(timerState: TimerState): void {
    if (timerState.initialTimerId) {
      window.clearTimeout(timerState.initialTimerId)
    }
    if (timerState.timerId) {
      window.clearInterval(timerState.timerId)
    }
    timerState.isActive = false
  }

  /**
   * アクティブなタイマーの状態を取得
   */
  getActiveTimers(): string[] {
    return Array.from(this.activeTimers.keys()).filter((ruleId) => {
      const timerState = this.activeTimers.get(ruleId)
      return timerState?.isActive ?? false
    })
  }

  /**
   * タイマーの詳細情報を取得
   */
  getTimerInfo(ruleId: string): TimerState | undefined {
    return this.activeTimers.get(ruleId)
  }
}
