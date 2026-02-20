// src/common/migrations/v1_to_v2/OmikujiDataV200/old/CommentThresholdSchema.ts
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
 * Comment Threshold
 */
export const commentThresholdCondition = ['comment', 'syoken', 'access', 'gift', 'count'] as const
export type CommentThresholdCondition = (typeof commentThresholdCondition)[number]

export const commentThresholdConditionLabels = Object.fromEntries(
  commentThresholdCondition.map((key) => [key, thresholdConditionLabels[key]])
) as Record<CommentThresholdCondition, string>

export const commentThresholdConditionDescriptions = Object.fromEntries(
  commentThresholdCondition.map((key) => [key, thresholdConditionDescriptions[key]])
) as Record<CommentThresholdCondition, string>

export const CommentThresholdConditionSchema = z.enum(commentThresholdCondition).default('comment').catch('comment')

export const CommentThresholdSchema = z.object({
  conditions: z.array(CommentThresholdConditionSchema).catch([]),
  syoken: z.array(SyokenConditionSchema).catch([]),
  access: z.array(AccessConditionSchema).catch([]),
  gift: z.array(GiftConditionSchema).catch([]),
  count: CountConditionSchema.catch(CountConditionSchema.parse({})),
  comment: z.array(z.string()).catch([]),
})
export type CommentThresholdType = z.infer<typeof CommentThresholdSchema>
