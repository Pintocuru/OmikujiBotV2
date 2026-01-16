// types/OmikujiBot/OmikujiSchema.ts
// 250722_1 OmikujiLimits の新規作成
import { z } from 'zod'
import { CriteriaThresholdSchema } from '../OmikujiProcess/CriteriaThresholdSchema'
import { ActionSetSchema } from './ActionSet'

/**
 * OmikujiItemSchema
 */
export const OmikujiItemSchema = z.object({
  ...ActionSetSchema.shape,
  weight: z.number().min(0).default(1).catch(1), // 出現割合
  rank: z.number().min(0).max(1).optional(), // 優先度
  isPriority: z.boolean().default(false).catch(false), // 優先 trueならrank=1
  criteria: z.union([CriteriaThresholdSchema, z.null()]).default(null).catch(null),
})
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>

/**
 * OmikujiSet おみくじ
 */
export const OmikujiSetSchema = z
  .array(OmikujiItemSchema)
  .default([
    OmikujiItemSchema.parse({
      postActions: [
        {
          characterKey: '',
          iconKey: 'default',
          actionType: 'message',
          message: {
            bubble: '<<user>>さんの運勢は【大吉】',
          },
          delaySeconds: 0,
        },
      ],
    }),
  ])
  .catch([])
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>
