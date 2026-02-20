// src/types/MetaMaps/CriteriaThresholdMaps.ts
import { thresholdConditionLabels, thresholdConditionDescriptions } from '@shared/types/Threshold/'

/**
 * criteria Threshold
 */
export const criteriaThresholdCondition = [
  'username',
  'access', // アクセスレベル(管理者権限など)
  'gift', // プレミアムモードで使えるので
  'syoken',
  'count',
  'comment', // 追加のコメント内容
] as const
export type CriteriaThresholdCondition = (typeof criteriaThresholdCondition)[number]

/**
 * 条件ラベルマップ
 */
export const criteriaThresholdConditionLabels = Object.fromEntries(
  criteriaThresholdCondition.map((key) => [key, thresholdConditionLabels[key]])
) as Record<CriteriaThresholdCondition, string>

/**
 * 条件説明文マップ
 */
export const criteriaThresholdConditionDescriptions = Object.fromEntries(
  criteriaThresholdCondition.map((key) => [key, thresholdConditionDescriptions[key]])
) as Record<CriteriaThresholdCondition, string>
