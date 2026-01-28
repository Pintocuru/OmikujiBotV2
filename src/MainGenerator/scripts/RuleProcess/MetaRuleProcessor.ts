// src/MainGenerator/scripts/RuleProcess/MetaRuleProcessor.ts
import { MetaConditionType, MetaSimpleConditionType, MetaTriggerType } from '@/types/OmikujiProcess/MetaTriggerSchema'
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
   * トリガー条件の評価（AND条件）
   */
  private evaluateTrigger(trigger: MetaTriggerType, event: MetaUpdateEvent): boolean {
    const { conditions } = trigger

    // 空配列の場合は無条件でtrue
    if (conditions.length === 0) {
      return true
    }

    // すべての条件を満たす必要がある（AND条件）
    for (const conditionType of conditions) {
      const condition = trigger[conditionType]
      if (!condition) continue

      let result = false

      switch (conditionType) {
        case 'upVote':
          result = this.evaluateMetaCondition(
            condition as MetaConditionType,
            event.current.upVote,
            event.previous?.upVote ?? 0,
            event.peak.upVote
          )
          break

        case 'viewer':
          result = this.evaluateMetaCondition(
            condition as MetaConditionType,
            event.current.viewer,
            event.previous?.viewer ?? 0,
            event.peak.viewer
          )
          break

        case 'follower':
          result = this.evaluateSimpleCondition(
            condition as MetaSimpleConditionType,
            event.current.follower,
            event.previous?.follower ?? 0
          )
          break

        case 'startTime':
          result = this.evaluateSimpleCondition(
            condition as MetaSimpleConditionType,
            event.current.startTime ?? 0,
            event.previous?.startTime ?? 0
          )
          break
      }

      // 1つでも条件を満たさなければfalse
      if (!result) {
        return false
      }
    }

    return true
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

  /**
   * Peak比較なしの条件評価
   */
  private evaluateSimpleCondition(condition: MetaSimpleConditionType, current: number, previous: number): boolean {
    const { comparison, value } = condition

    switch (comparison) {
      case 'changed':
        return current !== previous

      case 'increased':
        return current > previous

      case 'decreased':
        return current < previous

      case 'lowerBound':
        return value !== undefined && current >= value

      case 'upperBound':
        return value !== undefined && current <= value

      case 'equal':
        return value !== undefined && current === value

      case 'loop':
        if (value === undefined || value === 0) return false
        const diff = current - previous
        return diff > 0 && diff % value === 0

      default:
        return false
    }
  }
}
