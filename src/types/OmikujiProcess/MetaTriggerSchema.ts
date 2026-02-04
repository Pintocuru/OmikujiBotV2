// src\types\OmikujiProcess\MetaTriggerSchema.ts
import { z } from 'zod'

export const metaComparisonConditionMap = {
  changed: {
    label: '変化した',
    description: '前回の値と異なる場合に条件を満たします',
  },
  increased: {
    label: '増えた',
    description: '前回の値より増加した場合に条件を満たします',
  },
  decreased: {
    label: '減った',
    description: '前回の値より減少した場合に条件を満たします',
  },
  greaterThanPeak: {
    label: 'ピーク値を超えた',
    description: '過去最高値を超えた場合に条件を満たします',
  },
  lowerBound: {
    label: '指定値以上',
    description: '指定値以上の場合に条件を満たします',
  },
  upperBound: {
    label: '指定値以下',
    description: '指定値以下の場合に条件を満たします',
  },
  equal: {
    label: '指定値と等しい',
    description: '指定値と等しい場合に条件を満たします',
  },
  loop: {
    label: 'ループ',
    description: '指定値の倍数の時に条件を満たします（例：10増えるごと）',
  },
} as const

export type MetaComparisonCondition = keyof typeof metaComparisonConditionMap
export const metaComparisonCondition = Object.keys(metaComparisonConditionMap) as MetaComparisonCondition[]

export const MetaConditionSchema = z.object({
  comparison: z.enum(metaComparisonCondition).default('changed').catch('changed'),
  value: z.number().min(0).optional(), // lowerBound / upperBound / equal / loop の時だけ使用
})
export type MetaConditionType = z.infer<typeof MetaConditionSchema>

/**
 *
 */
export const MetaSimpleComparisonConditionMap = {
  changed: metaComparisonConditionMap.changed,
  increased: metaComparisonConditionMap.increased,
  decreased: metaComparisonConditionMap.decreased,
  lowerBound: metaComparisonConditionMap.lowerBound,
  upperBound: metaComparisonConditionMap.upperBound,
  equal: metaComparisonConditionMap.equal,
  loop: metaComparisonConditionMap.loop,
} as const

export type MetaSimpleComparisonCondition = keyof typeof MetaSimpleComparisonConditionMap

/**
 * 条件タイプのラベル
 */
export const metaTriggerCondition = {
  upVote: '高評価',
  viewer: '視聴者数',
  follower: '登録者数',
  elapsedMinutes: '配信経過時間',
}

export type MetaTriggerCondition = keyof typeof metaTriggerCondition

export const MetaTriggerConditionSchema = z.enum(
  Object.keys(metaTriggerCondition) as [MetaTriggerCondition, ...MetaTriggerCondition[]]
)

/**
 *
 */
export const MetaTriggerSchema = z.object({
  condition: MetaTriggerConditionSchema.default('upVote').catch('upVote'),
  upVote: MetaConditionSchema.optional(),
  viewer: MetaConditionSchema.optional(),
  follower: z.literal(true).optional(),
  elapsedMinutes: z.number().min(0).optional(),
})

export type MetaTriggerType = z.infer<typeof MetaTriggerSchema>
