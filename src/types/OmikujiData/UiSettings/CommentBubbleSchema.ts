// src/types/OmikujiData/UiSettings/CommentBubbleSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../ParsedDefault'
import { enterMotionMap } from '@/types/MetaMaps/enterMotionMaps'

/**
 * フキダシ・キャラクター
 */
// キャラアイコンの並び順
// キャラクターのkeyを並べる(新設) 0番地は非表示、1番から常時表示
export const ShowCharactersSchema = z.object({
  center: z.array(z.string()).default([]), // 中央上部に表示
  slot1: z.array(z.string()).default([]),
  slot2: z.array(z.string()).default([]),
  slot3: z.array(z.string()).default([]),
  slot4: z.array(z.string()).default([]),
})
export type ShowCharacters = z.infer<typeof ShowCharactersSchema>

//
export const enterMotionKeys = Object.keys(enterMotionMap) as EnterMotionType[]
export type EnterMotionType = keyof typeof enterMotionMap

export const CommentBubbleSchema = z.object({
  showCharacters: normalizedObject(ShowCharactersSchema),
  characterSize: z.number().default(48).catch(48), // キャラクターの横幅
  bubbleMotionEnter: z.enum(enterMotionKeys).default('slideUp').catch('slideUp'), // フキダシのアニメーション(開始・表示中)
  bubbleTextAnimate: z.boolean().default(false).catch(false), // フキダシの文字表示をアニメーションさせるか
  bubbleTextSpeed: z.number().min(10).max(200).default(50).catch(50), // 文字送りの速度
})
export type CommentBubbleType = z.infer<typeof CommentBubbleSchema>
