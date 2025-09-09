// src/MainGenerator/utils/
import { TimerRuleType } from '@/types/OmikujiData/RulesSchema'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { BotMessageGenerator } from '../BotCharacter/BotMessageGenerator'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { PlaceProcess } from './PlaceProcess'
import { PostMessage } from '@MainScripts/PostMessage/PostMessage'
import { createGetMetas } from '@shared/sdk/subscribe/GetMetas'
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service'
import { ServiceMetaCondition } from '@shared/types'

interface TimerState {
  timerId: number
  initialTimerId?: number
  intervalMs: number
  isActive: boolean
}

export class TimerProcessor {
  private serviceMeta: ServiceMeta | null = null
  private readonly timerRules: Record<string, TimerRuleType>
  private readonly activeTimers = new Map<string, TimerState>()
  private readonly messageHandler: PostMessage
  private readonly placeholderProcessor: PlaceProcess
  private readonly botMessageGenerator: BotMessageGenerator

  constructor(omikujiData: OmikujiDataType) {
    this.timerRules = omikujiData.timers
    this.messageHandler = new PostMessage(omikujiData.characters)
    this.placeholderProcessor = new PlaceProcess(omikujiData.placeholders)
    this.botMessageGenerator = new BotMessageGenerator(omikujiData.characters)
    this.initializeMetaFetcher()
  }

  /**
   * すべてのタイマーを開始
   */
  startTimers(onTimerTrigger: (messages: BotMessage[]) => void): void {
    this.stopTimers()

    const enabledTimers = Object.values(this.timerRules)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    enabledTimers.forEach((rule) => {
      this.startTimer(rule, onTimerTrigger)
    })
  }

  /**
   * 個別のタイマーを開始
   */
  private startTimer(rule: TimerRuleType, onTimerTrigger: (messages: BotMessage[]) => void): void {
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
      const timerState = this.activeTimers.get(rule.id)
      if (timerState) {
        timerState.timerId = intervalTimerId
        timerState.initialTimerId = undefined
      }
    }, initialDelay)

    // タイマー状態を記録
    this.activeTimers.set(rule.id, {
      timerId: 0, // 後で更新される
      initialTimerId,
      intervalMs,
      isActive: true,
    })
  }

  /**
   * タイマー実行時の処理
   */
  private executeTimer(rule: TimerRuleType, onTimerTrigger: (messages: BotMessage[]) => void): void {
    try {
      const messages = this.processTimerRule(rule)
      onTimerTrigger(messages)
    } catch (error) {
      console.error(`Timer ${rule.id} execution error:`, error)
    }
  }

  /**
   * タイマールールを処理してBotMessageの配列を生成
   */
  private processTimerRule(rule: TimerRuleType): BotMessage[] {
    const omikujiItem = drawOmikuji(rule.omikuji)
    if (!omikujiItem) return []

    this.setupDefaultPlaceholders()

    try {
      const postActions = this.placeholderProcessor.processPostActions(omikujiItem.postActions)
      this.messageHandler.post(postActions)
      return this.botMessageGenerator.generateMessages(postActions)
    } finally {
      this.placeholderProcessor.clearResolvedValues()
    }
  }

  /**
   * デフォルトのプレースホルダー情報を設定
   */
  private setupDefaultPlaceholders(): void {
    const defaultPlaceholders: Record<ServiceMetaCondition, string | number> = {
      viewer: this.serviceMeta?.viewer ?? 0,
      upVote: this.serviceMeta?.upVote ?? 0,
    }
    this.placeholderProcessor.updateResolvedValues(defaultPlaceholders)
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

  /**
   * メタデータフェッチャーの初期化とポーリング開始
   */
  private initializeMetaFetcher(): void {
    createGetMetas().fetchMeta((meta) => {
      this.serviceMeta = meta
    })
  }
}
