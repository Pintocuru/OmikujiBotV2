// src\types\OmikujiProcess\CommentTriggerSchema.ts
import { z } from 'zod'
import {
  AccessConditionSchema,
  CountConditionSchema,
  GiftConditionSchema,
  SyokenConditionSchema,
  thresholdConditionDescriptions,
  thresholdConditionLabels,
} from '@shared/types/Threshold/'

/**
 * Comment Trigger
 */
export const commentTriggerCondition = ['comment', 'syoken', 'access', 'gift', 'count', 'username'] as const
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
  syoken: z.array(SyokenConditionSchema).catch([]),
  access: z.array(AccessConditionSchema).catch([]),
  gift: z.array(GiftConditionSchema).catch([]),
  count: CountConditionSchema.catch(CountConditionSchema.parse({})),
  comment: z.array(z.string()).catch([]),
  userName: z.array(z.string()).catch([]),
})
export type CommentTriggerType = z.infer<typeof CommentTriggerSchema>
