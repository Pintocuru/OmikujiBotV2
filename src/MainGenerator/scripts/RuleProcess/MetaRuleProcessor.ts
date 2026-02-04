// src/MainGenerator/scripts/RuleProcess/MetaRuleProcessor.ts
import { MetaConditionType, MetaTriggerType } from '@/types/OmikujiProcess/MetaTriggerSchema'
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiProcessor } from '../OmikujiProcess/OmikujiProcessor'
import { MetaStateService, MetaUpdateEvent } from '../MetaState/MetaStateService'
import { useAppStore } from '@main/stores/useAppStore'

export class MetaRuleProcessor {
  private readonly omikujiProcessor: OmikujiProcessor = new OmikujiProcessor()
  private readonly metaStateService: MetaStateService = new MetaStateService()

  constructor() {}

  /**
   * メタルール監視を開始
   */
  startMetaRules(onMetaTrigger: (messages: BotMessageType[]) => void): void {
    this.metaStateService.subscribe((event) => {
      this.processMetaRules(event, onMetaTrigger)
    })
  }

  /**
   * メタデータ更新時の処理
   */
  private processMetaRules(event: MetaUpdateEvent, onMetaTrigger: (messages: BotMessageType[]) => void): void {
    const appStore = useAppStore()
    const enabledRules = Object.values(appStore.data.metas)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    for (const rule of enabledRules) {
      if (this.evaluateTrigger(rule.trigger, event)) {
        try {
          const omikujiMessages = this.omikujiProcessor.executeOmikuji(rule.omikuji)
          onMetaTrigger(omikujiMessages)
        } catch (error) {
          console.error(`Meta rule ${rule.key} execution error:`, error)
        }
      }
    }
  }

  /**
   * トリガー条件の評価（単一条件）
   */
  private evaluateTrigger(trigger: MetaTriggerType, event: MetaUpdateEvent): boolean {
    const { condition } = trigger
    if (!condition) return true

    switch (condition) {
      case 'upVote':
        return this.evaluateMetaCondition(
          trigger.upVote!,
          event.current.upVote,
          event.previous?.upVote ?? 0,
          event.peak.upVote
        )

      case 'viewer':
        return this.evaluateMetaCondition(
          trigger.viewer!,
          event.current.viewer,
          event.previous?.viewer ?? 0,
          event.peak.viewer
        )

      case 'elapsedMinutes': {
        const thresholdMinutes = trigger.elapsedMinutes ?? 0
        const startTime = event.current.startTime

        // startTime が null → 経過時間を計算できない → false
        if (startTime == null) return false

        const now = Date.now()
        const elapsedMs = now - startTime
        const thresholdMs = thresholdMinutes * 60_000
        return elapsedMs >= thresholdMs
      }

      case 'follower':
      default:
        return true
    }
  }

  /**
   * Peak比較ありの条件評価
   */
  private evaluateMetaCondition(
    condition: MetaConditionType,
    current: number,
    previous: number,
    peak: number
  ): boolean {
    const { comparison, value } = condition

    switch (comparison) {
      case 'changed':
        return current !== previous

      case 'increased':
        return current > previous

      case 'decreased':
        return current < previous

      case 'greaterThanPeak':
        return current > peak

      case 'lowerBound':
        return value !== undefined && current >= value

      case 'upperBound':
        return value !== undefined && current <= value

      case 'equal':
        return value !== undefined && current === value

      case 'loop':
        if (value === undefined || value === 0) return false
        // 前回との差分が指定値の倍数かどうか
        const diff = current - previous
        return diff > 0 && diff % value === 0

      default:
        return false
    }
  }
}
