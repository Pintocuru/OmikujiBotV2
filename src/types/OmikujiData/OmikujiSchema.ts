// src/types/OmikujiData/OmikujiSchema.ts
import { z } from 'zod'
import { CriteriaThresholdSchema } from './CriteriaThresholdSchema'
import { ActionSetBaseSchema, PostFlowMessageSchema } from './ActionSet'

/**
 * OmikujiItemSchema
 */
export const OmikujiItemSchema = z.object({
  ...ActionSetBaseSchema.shape,
  weight: z.number().min(0).default(1).catch(1), // 出現割合
  // TODO(v3): 削除
  rank: z.number().min(0).max(1).optional(), // 優先度
  isPriority: z.boolean().default(false).catch(false), // 優先 trueならrank=1
  criteria: z.union([CriteriaThresholdSchema, z.null()]).default(null).catch(null),
})
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>

/**
 * OmikujiSet おみくじ
 */
const parse = OmikujiItemSchema.parse({
  postActions: [
    PostFlowMessageSchema.parse({
      message: { bubble: '<<user>>さんの運勢は【大吉】' },
    }),
  ],
})
export const OmikujiSetSchema = z.array(OmikujiItemSchema).default([parse]).catch([parse])
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>

/**
TODO(v3):

// 優先アイテム（weight を使わない）
const OmikujiPrioritySchema = z.object({
  isPriority: z.literal(true),
  criteria: normalizedObject(CriteriaThresholdSchema),
});

// 通常アイテム（weight を使う）
const OmikujiWeightedSchema = z.object({
  isPriority: z.literal(false).default(false),
  weight: z.number().min(0).default(1),
  criteria: z.union([CriteriaThresholdSchema, z.null()]).default(null),
})

// 統合
export const OmikujiLotterySchema = z.discriminatedUnion('isPriority', [
  OmikujiPrioritySchema,
  OmikujiWeightedSchema,
])


const OmikujiItemSchema = ActionSetSchema.extend({
  omikuji: : normalizedObject(OmikujiLotterySchema),
})
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>



 */
