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
const reactionCondition = Object.keys(reactionConditionMap) as [
  keyof typeof reactionConditionMap,
  ...Array<keyof typeof reactionConditionMap>,
]
export const ReactionTriggerSchema = z.object({
  platform: z.enum(['youtube']).default('youtube'),
  reactions: z.array(z.enum(reactionKeys)).default([]), // 押された対象(配列、nullで対象なし)
  comparison: z.enum(reactionCondition).default('milestone').catch('milestone'), // 条件種別
  value: z.number().min(1).default(1).catch(1), // 閾値（burstSustain: n回ごと、等）
  triggerLevel: z.number().min(0).max(3).default(0).catch(0), // burstReach/burstSustain で使用: このレベル以上で有効
})
export type ReactionTriggerType = z.infer<typeof ReactionTriggerSchema>
