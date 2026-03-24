// src/MainGenerator/scripts/EventProcess/ServiceTriggerEvaluator.ts
import { ServiceConditionType, ServiceTriggerType } from '@/types/OmikujiData/'
import type { MetaUpdateEvent } from '../../stores/MetaState/MetaStateService'

/**
 * トリガー条件の評価 ReactionTriggerEvaluator
 */
export function evaluateServiceTrigger(trigger: ServiceTriggerType, event: MetaUpdateEvent): boolean {
  const { condition } = trigger
  if (!condition) return true

  switch (condition) {
    case 'upVote':
      if (!trigger.upVote) return true
      return evaluateServiceCondition(
        trigger.upVote,
        event.current.upVote,
        event.previous?.upVote ?? 0,
        event.peakChanged.upVote
      )

    case 'viewer':
      if (!trigger.viewer) return true
      return evaluateServiceCondition(
        trigger.viewer,
        event.current.viewer,
        event.previous?.viewer ?? 0,
        event.peakChanged.viewer
      )

    case 'elapsedMinutes':
      return evaluateElapsedTime(trigger.elapsedMinutes ?? 0, event.current.startTime)

    case 'follower':
    default:
      return true
  }
}

/**
 * 単一条件の評価
 * 🔧 FIX: peak 値ではなく peakChanged フラグを受け取る
 */
export function evaluateServiceCondition(
  condition: ServiceConditionType,
  current: number,
  previous: number,
  isPeakChanged: boolean
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
      return isPeakChanged
    case 'lowerBound':
      return value !== undefined && current >= value
    case 'upperBound':
      return value !== undefined && current <= value
    case 'equal':
      return value !== undefined && current === value
    case 'loop':
      if (!value) return false
      const diff = current - previous
      return diff > 0 && diff % value === 0
    default:
      return false
  }
}

/**
 * 経過時間の評価
 */
export function evaluateElapsedTime(thresholdMinutes: number, startTime: number | null): boolean {
  if (startTime == null) return false
  return Date.now() - startTime >= thresholdMinutes * 60_000
}
