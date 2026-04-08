// src/types/MainGenerator/BotMessageSchema.ts
import { z } from 'zod'
import { ScriptGameExtendedKeySchema, eventCategoryLabel } from '../OmikujiData'
import { OmikenCommentSchema, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { DaisyUIColorSchema } from '@shared/styles/DaisyUiTheme'
import { idSchema } from '@shared/types'

/**
 * BotMessageBaseSchema
 */
const BotMessageBaseSchema = z.object({
  id: idSchema,
  timestamp: z.string().default(() => new Date().toISOString()),
  delaySeconds: z.number().default(0),
  source: z
    .object({
      category: z.enum(eventCategoryLabel).optional(),
      eventKey: z.string().optional(),
      omikujiKey: z.string().optional(),
    })
    .optional(),
  origin: OmikenCommentSchema.optional(),
})
export type BotMessageBaseType = z.infer<typeof BotMessageBaseSchema>

/**
 * ExtraMessageSchema
 */
export const ExtraListsSchema = z.object({
  listName: z.string().optional(), // 名前
  symbol: z.string().optional(), // 名前の隣につけるやつ
  text: z.string().default(''), // 表示用得点
  order: z.number().optional(), // 比較用
  variant: DaisyUIColorSchema.optional(), // 得点表示のカラー
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
 * CommentBubbleSchema
 */
const CommentBubbleSchema = z.object({
  name: z.string().nullable().default(null),
  message: z.string(),
  isToast: z.boolean().default(false),
  characterKey: z.string().nullable().default(null),
  iconKey: z.string().default('default').catch('default'),
  displaySeconds: z.number().min(0).max(60).nullable().optional(),
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
  slots: ExtraSlotsSchema.optional(),
  display: DisplayStatusSchema.optional(),
})
export type BotMessageBubbleType = z.infer<typeof BotMessageBubbleSchema>

/**
 * BotMessageExtraSchema
 */
export const BotMessageExtraSchema = BotMessageBaseSchema.extend({
  type: z.literal('extra').default('extra'),
  scriptKey: ScriptGameExtendedKeySchema, // アイテム判別用key
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
  type: z.literal('empty').default('empty'),
})
export type BotMessageEmptyType = z.infer<typeof BotMessageEmptySchema>

const _BotMessageSchema = z.discriminatedUnion('type', [
  BotMessageBubbleSchema,
  BotMessageExtraSchema,
  BotMessageEmptySchema,
])
export type BotMessageType = z.infer<typeof _BotMessageSchema>
