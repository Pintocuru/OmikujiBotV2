// src/types/OmikujiData/ReactionTriggerSchema.ts
import { z } from 'zod'
import { reactionConditionMap, reactionMap } from '../MetaMaps'

/**
 * 条件タイプのラベル
 */
export const reactionKeys = Object.keys(reactionMap.youtube) as Array<keyof typeof reactionMap.youtube>
export type ReactionReaction = keyof typeof reactionMap.youtube

/**
 * ReactionTrigger
 * 現在はYoutubeのみを対象としている
 */
const reactionCondition = Object.keys(reactionConditionMap)
export const ReactionTriggerSchema = z.object({
  platform: z.enum(['youtube']).default('youtube'),
  reactions: z.array(z.enum(reactionKeys)).default([]), // 押された対象(配列、nullで対象なし)
  comparison: z.enum(reactionCondition).default('changed').catch('changed'), // 数値の指定
  value: z.number().min(0).optional(),
})
export type ReactionTriggerType = z.infer<typeof ReactionTriggerSchema>
