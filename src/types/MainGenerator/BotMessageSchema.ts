// src\types\MainGenerator\BotMessageSchema.ts
import { z } from 'zod'
import { CharacterColorScheme, CharacterEmotionSchema } from '../OmikujiData/CharacterSchema'
import { RankingMessageSchema } from '../OmikujiData/ActionMessage'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { v4 } from 'uuid'

/**
 * CommentBubbleSchema
 */
export const CommentBubbleSchema = z.object({
  name: z.string().default('error'),
  message: z.string(),
  isToast: z.boolean().default(false),
  characterKey: z.string().nullable().default(null),
  iconKey: CharacterEmotionSchema.default('default'),
  displaySeconds: z.number().min(0).max(60).optional(),
  color: CharacterColorScheme.catch(CharacterColorScheme.parse({})),
})
export type CommentBubbleType = z.infer<typeof CommentBubbleSchema>

/**
 * BotMessageBaseSchema
 */
const BotMessageBaseSchema = z.object({
  id: z.string().default(() => v4()),
  timestamp: z.string().default(() => new Date().toISOString()),
  delaySeconds: z.number().default(0),
})

const SystemMessageSchema = BotMessageBaseSchema.extend({
  type: z.literal('system'),
  bubble: CommentBubbleSchema,
})

const CommentMessageSchema = BotMessageBaseSchema.extend({
  type: z.literal('comment'),
  bubble: CommentBubbleSchema,
  user: UserNameSchema,
  ranking: RankingMessageSchema.optional(),
})

const RankingOnlyMessageSchema = BotMessageBaseSchema.extend({
  type: z.literal('rankingOnly'),
  ranking: RankingMessageSchema,
  user: UserNameSchema.optional(),
})

export const BotMessageSchema = z.discriminatedUnion('type', [
  SystemMessageSchema,
  CommentMessageSchema,
  RankingOnlyMessageSchema,
])

export type BotMessageType = z.infer<typeof BotMessageSchema>
