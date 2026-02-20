// src/types/MetaMaps/CriteriaThresholdMaps.ts
import { thresholdConditionLabels, thresholdConditionDescriptions } from '@shared/types/Threshold/'
import type { CriteriaThresholdCondition } from '../OmikujiProcess/CriteriaThresholdSchema'
import { criteriaThresholdCondition } from '../OmikujiProcess/CriteriaThresholdSchema'

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
