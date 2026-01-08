// src\MainGenerator\scripts\RuleProcess\RuleTimerProcessor.ts
import { TimerRuleType } from '@/types/OmikujiData/RulesSchema'
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiProcessor } from '../OmikujiProcess/OmikujiProcessor'
import { useAppStore } from '@main/stores/useAppStore'

interface TimerState {
  timerId: number
  initialTimerId?: number
  intervalMs: number
  isActive: boolean
}

export class RuleTimerProcessor {
  private readonly activeTimers = new Map<string, TimerState>()
  private readonly omikujiProcessor: OmikujiProcessor = new OmikujiProcessor()

  constructor() {}

  /**
   * すべてのタイマーを開始
   */
  startTimers(onTimerTrigger: (messages: BotMessageType[]) => void): void {
    this.stopTimers()

    // Pinia Store
    const appStore = useAppStore()
    const enabledTimers = Object.values(appStore.data.timers)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    enabledTimers.forEach((rule) => {
      this.startTimer(rule, onTimerTrigger)
    })
  }

  /**
   * 個別のタイマーを開始
   */
  private startTimer(rule: TimerRuleType, onTimerTrigger: (messages: BotMessageType[]) => void): void {
    const intervalMs = rule.intervalSeconds * 1000
    let initialDelay = intervalMs

    // isBaseZeroがtrueの場合、0分0秒を基準にする
    if (rule.isBaseZero) {
      const now = new Date()
      const msSinceHourStart = now.getMinutes() * 60_000 + now.getSeconds() * 1000 + now.getMilliseconds()

      const timeToNextInterval = intervalMs - (msSinceHourStart % intervalMs)
      initialDelay = timeToNextInterval
    }

    // 初回実行用のタイマー
    const initialTimerId = window.setTimeout(() => {
      this.executeTimer(rule, onTimerTrigger)

      // 定期実行を開始
      const intervalTimerId = window.setInterval(() => {
        this.executeTimer(rule, onTimerTrigger)
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
  private executeTimer(rule: TimerRuleType, onTimerTrigger: (messages: BotMessageType[]) => void): void {
    try {
      const omikujiMessages = this.omikujiProcessor.executeOmikuji(rule.omikuji)
      onTimerTrigger(omikujiMessages)
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
