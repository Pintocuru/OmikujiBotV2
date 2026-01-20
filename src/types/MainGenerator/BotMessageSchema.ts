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
 * RankingMessageSchema
 */
export const RankingMessageSchema = z.object({
  // 得点表示
  listName: z.string().optional(), // 名前
  symbol: z.string().optional(), // 名前の隣につけるやつ
  scoreText: z.string().default(''), // 表示用得点
  scoreValue: z.number().optional(), // 比較用
  variant: z.string().optional(), // 得点表示のカラー(型は BaseVariant)
  // 設定
  scriptKey: z.string().default(''), // アイテム判別用key
  isRank: z.boolean().default(true), // リストに載せるか
  isUniqueUser: z.boolean().default(false), // 1ユーザー1つか複数か
  slots: z.array(z.string()).optional(), // 任意の値
})
export type RankingMessageType = z.infer<typeof RankingMessageSchema>

/**
 * BotMessageRankingSchema
 */
export const BotMessageRankingSchema = BotMessageBaseSchema.extend({
  type: z.literal('ranking').default('ranking'),
  user: UserNameSchema.optional(),
  ranking: RankingMessageSchema,
})
export type BotMessageRankingType = z.infer<typeof BotMessageRankingSchema>

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
  BotMessageRankingSchema,
  BotMessageEmptySchema,
])
export type BotMessageType = z.infer<typeof BotMessageSchema>
