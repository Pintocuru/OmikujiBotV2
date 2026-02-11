// src\types\MainGenerator\BotMessageSchema.ts
import { z } from 'zod'
import { CharacterEmotionSchema } from '../OmikujiData/CharacterSchema'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { v4 } from 'uuid'

/**
 * BotMessageBaseSchema
 */
const BotMessageBaseSchema = z.object({
  id: z.string().default(() => v4()),
  timestamp: z.string().default(() => new Date().toISOString()),
  delaySeconds: z.number().default(0),
})

/**
 * CommentBubbleSchema
 */
const CommentBubbleSchema = z.object({
  name: z.string().default('error'),
  message: z.string(),
  isToast: z.boolean().default(false),
  characterKey: z.string().nullable().default(null),
  iconKey: CharacterEmotionSchema.default('default'),
  displaySeconds: z.number().min(0).max(60).optional(),
})

const DisplayStatusSchema = z.object({
  visible: z.boolean().default(true),
  hideTimeout: z.number().optional(),
})

/**
 * BotMessageBubbleSchema
 */
export const BotMessageBubbleSchema = BotMessageBaseSchema.extend({
  type: z.literal('comment').default('comment'),
  bubble: CommentBubbleSchema,
  display: DisplayStatusSchema.optional(),
})
export type BotMessageBubbleType = z.infer<typeof BotMessageBubbleSchema>

/**
 * ExtraMessageSchema
 */
export const ExtraListsSchema = z.object({
  listName: z.string().optional(), // 名前
  symbol: z.string().optional(), // 名前の隣につけるやつ
  text: z.string().default(''), // 表示用得点
  order: z.number().optional(), // 比較用
  variant: z.string().optional(), // 得点表示のカラー(型は BaseVariant)
  tags: z.array(z.string()).optional(),
  isVisible: z.boolean().default(true), // リストに載せるか
  isUnique: z.boolean().default(false), // 1ユーザー1つか複数か
  flag: z.boolean().optional(),
})
export type ExtraListsType = z.infer<typeof ExtraListsSchema>

export const ExtraSlotsSchema = z.object({
  slot0: z.string().optional(),
  slot1: z.string().optional(),
  slot2: z.string().optional(),
  slot3: z.string().optional(),
  slot4: z.string().optional(),
  slot5: z.string().optional(),
  slot6: z.string().optional(),
  slot7: z.string().optional(),
  slot8: z.string().optional(),
  slot9: z.string().optional(),
})
export type ExtraSlotsType = z.infer<typeof ExtraSlotsSchema>

/**
 * BotMessageExtraSchema
 */
export const BotMessageExtraSchema = BotMessageBaseSchema.extend({
  type: z.literal('extra').default('extra'),
  componentKey: z.string(), // アイテム判別用key
  user: UserNameSchema.optional(),
  lists: ExtraListsSchema.optional(),
  slots: ExtraSlotsSchema.optional(),
})
export type BotMessageExtraType = z.infer<typeof BotMessageExtraSchema>

/**
 * BotMessageEmptySchema
 * 特殊な動作 returnで使用
 */
export const BotMessageEmptySchema = BotMessageBaseSchema.extend({
  type: z.literal('empty'),
})
export type BotMessageEmptyType = z.infer<typeof BotMessageEmptySchema>

const BotMessageSchema = z.discriminatedUnion('type', [
  BotMessageBubbleSchema,
  BotMessageExtraSchema,
  BotMessageEmptySchema,
])
export type BotMessageType = z.infer<typeof BotMessageSchema>
