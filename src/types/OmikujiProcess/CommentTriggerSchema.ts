// src\types\OmikujiProcess\CommentTriggerSchema.ts
import { z } from 'zod'
import { GiftConditionSchema, SyokenConditionSchema, thresholdConditionMap } from '@shared/types/Threshold/'
import { AccessConditionSchema, CountConditionSchema } from '@shared/types/trigger'

/**
 * Comment Trigger
 */
export const commentTriggerCondition = [
  'comment',
  'access',
  'gift',
  'username',
  // v2では非推奨
  'syoken',
  'count',
] as const
export type CommentTriggerCondition = (typeof commentTriggerCondition)[number]

export const commentTriggerConditionInfo = Object.fromEntries(
  commentTriggerCondition.map((key) => [key, thresholdConditionMap[key]])
) as Record<CommentTriggerCondition, (typeof thresholdConditionMap)[CommentTriggerCondition]>


export const CommentTriggerConditionSchema = z.enum(commentTriggerCondition).default('comment').catch('comment')

export const CommentTriggerSchema = z
  .object({
    conditions: z.array(CommentTriggerConditionSchema).catch([]),
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
