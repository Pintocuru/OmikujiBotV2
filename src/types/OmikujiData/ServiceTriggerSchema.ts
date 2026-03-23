// src/types/OmikujiData/ServiceTriggerSchema.ts
import { z } from 'zod'
import { serviceConditionMap, serviceTriggerConditionMap } from '../MetaMaps'

/**
 * 比較条件のUI表示情報（label + description）
 */
// 使わない気がするので export してない
const ServiceComparisonCondition = Object.keys(serviceConditionMap)
// type MetaComparisonCondition = keyof typeof metaComparisonConditionMap

/**
 * MetaConditionSchema
 */
export const ServiceConditionSchema = z.object({
  comparison: z.enum(ServiceComparisonCondition).default('changed').catch('changed'),
  value: z.number().min(0).optional(), // lowerBound / upperBound / equal / loop の時だけ使用
})
export type ServiceConditionType = z.infer<typeof ServiceConditionSchema>

/**
 * MetaSimpleComparisonCondition の部分マップ（greaterThanPeakを除く）
 */
// 使わない気がするので export してない
// type MetaSimpleComparisonCondition = keyof typeof MetaSimpleComparisonConditionMap

/**
 * 条件タイプのラベル
 */
const serviceTriggerConditionKeys = Object.keys(serviceTriggerConditionMap) as ServiceTriggerCondition[]
const ServiceTriggerConditionSchema = z.enum(serviceTriggerConditionKeys)
export type ServiceTriggerCondition = keyof typeof serviceTriggerConditionMap

/**
 * metaTrigger
 */
export const ServiceTriggerSchema = z.object({
  condition: ServiceTriggerConditionSchema.default('upVote').catch('upVote'),
  upVote: ServiceConditionSchema.optional(),
  viewer: ServiceConditionSchema.optional(),
  follower: z.literal(true).optional(),
  elapsedMinutes: z.number().min(0).optional(),
})

export type ServiceTriggerType = z.infer<typeof ServiceTriggerSchema>
