// src/MainGenerator/stores/ReactionManager/ReactionTriggerEvaluator.ts

import type { ReactionTriggerType } from '@/types/OmikujiData'
import type { ReactionStatsManagerType } from './ReactionStatsManager'

type ReactionType = 'heart' | 'smile' | 'celebrate' | 'surprise' | 'praise'

export function evaluateReactionTrigger(
  trigger: ReactionTriggerType,
  stats: ReactionStatsManagerType,
  firedLabels: Set<string>
): boolean {
  const { reactions, comparison, value } = trigger

  if (!reactions || reactions.length === 0) return false

  const targetTypes = reactions as ReactionType[]

  switch (comparison) {
    case 'increased':
      // 今回のペイロードに指定ラベルが含まれているか
      return targetTypes.some((t) => firedLabels.has(t))

    case 'burst':
      return evaluateBurst(targetTypes, value, stats)
    case 'lowerBound':
      return evaluateLowerBound(targetTypes, value, stats)
    case 'upperBound':
      return evaluateUpperBound(targetTypes, value, stats)
    case 'equal':
      return evaluateEqual(targetTypes, value, stats)
    case 'loop':
      return evaluateLoop(targetTypes, value, stats)
    default:
      return false
  }
}

function sumInLast30s(types: ReactionType[], stats: ReactionStatsManagerType): number {
  return types.reduce((acc, t) => acc + stats.countInLast30Seconds(t), 0)
}

function sumTotal(types: ReactionType[], stats: ReactionStatsManagerType): number {
  return stats.getTotal(types)
}

function evaluateBurst(types: ReactionType[], threshold: number | undefined, stats: ReactionStatsManagerType): boolean {
  if (!threshold || threshold <= 0) return false
  return sumInLast30s(types, stats) >= threshold
}

function evaluateLowerBound(
  types: ReactionType[],
  threshold: number | undefined,
  stats: ReactionStatsManagerType
): boolean {
  if (!threshold) return false
  return sumTotal(types, stats) >= threshold
}

function evaluateUpperBound(
  types: ReactionType[],
  threshold: number | undefined,
  stats: ReactionStatsManagerType
): boolean {
  if (threshold === undefined) return false
  return sumTotal(types, stats) <= threshold
}

function evaluateEqual(types: ReactionType[], threshold: number | undefined, stats: ReactionStatsManagerType): boolean {
  if (threshold === undefined) return false
  return sumTotal(types, stats) === threshold
}

function evaluateLoop(types: ReactionType[], threshold: number | undefined, stats: ReactionStatsManagerType): boolean {
  if (!threshold || threshold <= 0) return false
  const total = sumTotal(types, stats)
  return total > 0 && total % threshold === 0
}
