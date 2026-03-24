// src/MainGenerator/scripts/EventProcess/ReactionTriggerEvaluator.ts
import { ReactionStatsManagerType } from '@/MainGenerator/stores/ReactionManager/ReactionStatsManager'
import type { ReactionTriggerType } from '@/types/OmikujiData'
import type { ReactionReaction } from '@/types/OmikujiData/ReactionTriggerSchema'

export function evaluateReactionTrigger(trigger: ReactionTriggerType, stats: ReactionStatsManagerType): boolean {
  const { reactions, comparison, value, triggerLevel } = trigger

  if (!reactions || reactions.length === 0) return false

  const targetTypes = reactions as ReactionReaction[]

  switch (comparison) {
    case 'milestone':
      return evaluateMilestone(targetTypes, value, stats)

    case 'equal':
      return evaluateEqual(targetTypes, value, stats)

    case 'burstReach':
      return evaluateBurstReach(triggerLevel, stats)

    case 'burstSustain':
      return evaluateBurstSustain(triggerLevel, value, stats)

    case 'burstDrop':
      return evaluateBurstDrop(triggerLevel, stats)

    default:
      return false
  }
}

// -------------------------------------------------------
// 各条件の評価
// -------------------------------------------------------

/**
 * milestone: 累計がvalueの倍数に達するたびに発火
 * value=0 は無効
 */
function evaluateMilestone(types: ReactionReaction[], value: number, stats: ReactionStatsManagerType): boolean {
  if (value <= 0) return false
  const total = stats.getTotal(types)
  return total > 0 && total % value === 0
}

/**
 * equal: 累計がvalueにぴったり一致したとき発火
 */
function evaluateEqual(types: ReactionReaction[], value: number, stats: ReactionStatsManagerType): boolean {
  return stats.getTotal(types) === value
}

/**
 * burstReach: 指定レベル以上に到達した瞬間に1回だけ発火
 */
function evaluateBurstReach(triggerLevel: number, stats: ReactionStatsManagerType): boolean {
  const burst = stats.getBurstState()
  if (burst.level >= triggerLevel && burst.reachedLevel >= triggerLevel) {
    stats.consumeReachedLevel()
    return true
  }
  return false
}

/**
 * burstSustain: 指定レベル以上の間、value回押されるたびに発火
 * value=0 または value=1 は押されるたびに毎回発火
 */
function evaluateBurstSustain(triggerLevel: number, value: number, stats: ReactionStatsManagerType): boolean {
  const burst = stats.getBurstState()
  if (burst.level < triggerLevel) return false
  if (value <= 1) return true
  if (burst.sustainCount >= value) {
    stats.resetSustainCount()
    return true
  }
  return false
}

/**
 * burstDrop: 指定レベル以下に下がった瞬間に1回だけ発火
 */
function evaluateBurstDrop(triggerLevel: number, stats: ReactionStatsManagerType): boolean {
  const burst = stats.getBurstState()
  if (burst.droppedLevel !== -1 && burst.droppedLevel <= triggerLevel) {
    stats.consumeDroppedLevel()
    return true
  }
  return false
}
