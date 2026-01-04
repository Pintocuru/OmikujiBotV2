// src\types\OmikujiProcess\CriteriaThresholdSchema.ts
import { z } from 'zod'
import {
  GiftConditionSchema,
  SyokenConditionSchema,
  thresholdConditionDescriptions,
  thresholdConditionLabels,
} from '@shared/types/Threshold/'
import { AccessConditionSchema, CountConditionSchema } from '@shared/types/trigger'

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

export const criteriaThresholdConditionLabels = Object.fromEntries(
  criteriaThresholdCondition.map((key) => [key, thresholdConditionLabels[key]])
) as Record<CriteriaThresholdCondition, string>

export const criteriaThresholdConditionDescriptions = Object.fromEntries(
  criteriaThresholdCondition.map((key) => [key, thresholdConditionDescriptions[key]])
) as Record<CriteriaThresholdCondition, string>

export const CriteriaThresholdConditionSchema = z.enum(criteriaThresholdCondition).default('comment').catch('comment')

export const CriteriaThresholdSchema = z.object({
  conditions: z.array(CriteriaThresholdConditionSchema).catch([]),
  userName: z.array(z.string()).catch([]),
  access: z.array(AccessConditionSchema).catch([]),
  gift: z.array(GiftConditionSchema).catch([]),
  syoken: z.array(SyokenConditionSchema).catch([]),
  count: CountConditionSchema.catch(CountConditionSchema.parse({})),
  comment: z.array(z.string()).catch([]),
})
export type CriteriaThresholdType = z.infer<typeof CriteriaThresholdSchema>
