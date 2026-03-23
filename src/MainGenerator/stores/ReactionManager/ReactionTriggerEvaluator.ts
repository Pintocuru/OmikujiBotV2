// src/MainGenerator/stores/ReactionState/ReactionTriggerEvaluator.ts
import type { ReactionTriggerType } from '@/types/OmikujiData'
import { ReactionStatsManagerType } from './ReactionStatsManager'

/**
 * リアクショントリガーの評価
 */
export function evaluateReactionTrigger(
  trigger: ReactionTriggerType,
  reactionStats: ReactionStatsManagerType
): boolean {
  const { reactions, comparison, value } = trigger

  // リアクション指定なし → 常に false（発動しない）
  if (!reactions || reactions.length === 0) return false

  switch (comparison) {
    case 'burst':
      return evaluateBurstCondition(reactions, value, reactionStats)

    // 将来、他の条件を追加するならここに書く
    default:
      return false
  }
}

/**
 * burst 条件の評価
 * 30秒以内に指定値以上のリアクションがあれば true
 */
function evaluateBurstCondition(
  reactionTypes: string[],
  threshold: number | undefined,
  reactionStats: ReactionStatsManagerType
): boolean {
  if (!threshold || threshold <= 0) return false

  // 指定された複数リアクションの合計をチェック
  let total = 0
  for (const type of reactionTypes) {
    total += reactionStats.countInLast30Seconds(type)
  }

  return total >= threshold
}
