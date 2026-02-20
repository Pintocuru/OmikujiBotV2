// src/types/OmikujiData/MetaTriggerSchema.ts
import { z } from 'zod'
import { metaComparisonConditionMap, MetaSimpleComparisonConditionMap, metaTriggerConditionMap } from '../MetaMaps'

/**
 * 比較条件のUI表示情報（label + description）
 */
// 使わない気がするので export してない
const metaComparisonCondition = Object.keys(metaComparisonConditionMap)
type MetaComparisonCondition = keyof typeof metaComparisonConditionMap

/**
 * MetaConditionSchema
 */
export const MetaConditionSchema = z.object({
  comparison: z.enum(metaComparisonCondition).default('changed').catch('changed'),
  value: z.number().min(0).optional(), // lowerBound / upperBound / equal / loop の時だけ使用
})
export type MetaConditionType = z.infer<typeof MetaConditionSchema>

/**
 * MetaSimpleComparisonCondition の部分マップ（greaterThanPeakを除く）
 */
// 使わない気がするので export してない
type MetaSimpleComparisonCondition = keyof typeof MetaSimpleComparisonConditionMap

/**
 * 条件タイプのラベル
 */
const metaTriggerConditionKeys = Object.keys(metaTriggerConditionMap) as MetaTriggerCondition[]
const MetaTriggerConditionSchema = z.enum(metaTriggerConditionKeys)
export type MetaTriggerCondition = keyof typeof metaTriggerConditionMap

/**
 * metaTrigger
 */
export const MetaTriggerSchema = z.object({
  condition: MetaTriggerConditionSchema.default('upVote').catch('upVote'),
  upVote: MetaConditionSchema.optional(),
  viewer: MetaConditionSchema.optional(),
  follower: z.literal(true).optional(),
  elapsedMinutes: z.number().min(0).optional(),
})

export type MetaTriggerType = z.infer<typeof MetaTriggerSchema>
