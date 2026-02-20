// src/types/MetaMaps/CommentTriggerMaps.ts
import { thresholdConditionMap } from '@shared/types/Threshold/'

/**
 * Comment Trigger
 */
export const commentTriggerCondition = [
  'comment',
  'access',
  'gift',
  'username',
  // v2では非推奨
  'syoken',
  'count',
] as const
export type CommentTriggerCondition = (typeof commentTriggerCondition)[number]

/**
 * コメントトリガー条件のUI表示情報（thresholdConditionMapから抽出）
 */
export const commentTriggerConditionMap = Object.fromEntries(
  commentTriggerCondition.map((key) => [key, thresholdConditionMap[key]])
) as Record<CommentTriggerCondition, (typeof thresholdConditionMap)[CommentTriggerCondition]>
