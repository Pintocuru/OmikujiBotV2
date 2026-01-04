// src\types\OmikujiProcess\CommentTriggerSchema.ts
import { z } from 'zod'
import { GiftConditionSchema, thresholdConditionDescriptions, thresholdConditionLabels } from '@shared/types/Threshold/'
import { AccessConditionSchema } from '@shared/types/trigger'

/**
 * Comment Trigger
 */
export const commentTriggerCondition = ['comment', 'access', 'gift', 'username'] as const
export type CommentTriggerCondition = (typeof commentTriggerCondition)[number]

export const commentTriggerConditionLabels = Object.fromEntries(
  commentTriggerCondition.map((key) => [key, thresholdConditionLabels[key]])
) as Record<CommentTriggerCondition, string>

export const commentTriggerConditionDescriptions = Object.fromEntries(
  commentTriggerCondition.map((key) => [key, thresholdConditionDescriptions[key]])
) as Record<CommentTriggerCondition, string>

export const CommentTriggerConditionSchema = z.enum(commentTriggerCondition).default('comment').catch('comment')

export const CommentTriggerSchema = z.object({
  conditions: z.array(CommentTriggerConditionSchema).catch([]),
  userName: z.array(z.string()).catch([]),
  access: z.array(AccessConditionSchema).catch([]),
  gift: z.array(GiftConditionSchema).catch([]),
  comment: z.array(z.string()).catch([]),
})
export type CommentTriggerType = z.infer<typeof CommentTriggerSchema>
