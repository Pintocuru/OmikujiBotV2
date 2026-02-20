// src/types/OmikujiData/CommentTriggerSchema.ts
import { z } from 'zod'
import { GiftConditionSchema, SyokenConditionSchema } from '@shared/types/Threshold/'
import { AccessConditionSchema, CountConditionSchema } from '@shared/types/trigger'
import { commentTriggerCondition } from '../MetaMaps'

/**
 * Comment Trigger
 */
export const CommentTriggerSchema = z
  .object({
    conditions: z.array(z.enum(commentTriggerCondition)).catch([]),
    userName: z.array(z.string()).catch([]),
    access: z.array(AccessConditionSchema).catch([]),
    gift: z.array(GiftConditionSchema).catch([]),
    comment: z.array(z.string()).catch([]),

    // v2では非推奨
    syoken: z.array(SyokenConditionSchema).optional(),
    count: CountConditionSchema.optional(),
  })
  // v2 では transform を使用(v3では削除予定)
  .transform((data) => {
    const cond = data.conditions ?? []
    return {
      ...data,
      syoken: cond.includes('syoken') ? data.syoken : undefined,
      count: cond.includes('count') ? data.count : undefined,
    }
  })
export type CommentTriggerType = z.infer<typeof CommentTriggerSchema>
