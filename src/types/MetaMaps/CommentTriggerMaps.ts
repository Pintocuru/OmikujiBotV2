// src/types/MetaMaps/CommentTriggerMaps.ts
import { thresholdConditionMap } from '@shared/types/Threshold/'
import type { CommentTriggerCondition } from '../OmikujiProcess/CommentTriggerSchema'
import { commentTriggerCondition } from '../OmikujiProcess/CommentTriggerSchema'

/**
 * コメントトリガー条件のUI表示情報（thresholdConditionMapから抽出）
 */
export const commentTriggerConditionInfo = Object.fromEntries(
  commentTriggerCondition.map((key) => [key, thresholdConditionMap[key]])
) as Record<CommentTriggerCondition, (typeof thresholdConditionMap)[CommentTriggerCondition]>
