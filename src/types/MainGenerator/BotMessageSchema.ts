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
export const BotMessageBaseSchema = z.object({
  id: z.string().default(() => v4()),
  timestamp: z.string().default(() => new Date().toISOString()),
  delaySeconds: z.number().default(0),
  type: z.enum(['system', 'comment', 'rankingOnly']),

  bubble: CommentBubbleSchema.optional(),
  user: UserNameSchema.optional(),
  ranking: RankingMessageSchema.optional(),
})

export const BotMessageSchema = BotMessageBaseSchema.superRefine((data, ctx) => {
  switch (data.type) {
    case 'system':
      if (!data.bubble) {
        ctx.addIssue({
          code: 'custom',
          message: 'system タイプでは bubble が必須です。',
          path: ['bubble'],
        })
      }
      if (data.user) {
        ctx.addIssue({
          code: 'custom',
          message: 'system タイプでは user は使用できません。',
          path: ['user'],
        })
      }
      if (data.ranking) {
        ctx.addIssue({
          code: 'custom',
          message: 'system タイプでは ranking は使用できません。',
          path: ['ranking'],
        })
      }
      break

    case 'comment':
      if (!data.bubble) {
        ctx.addIssue({
          code: 'custom',
          message: 'comment タイプでは bubble が必須です。',
          path: ['bubble'],
        })
      }
      if (!data.user) {
        ctx.addIssue({
          code: 'custom',
          message: 'comment タイプでは user が必須です。',
          path: ['user'],
        })
      }
      break

    case 'rankingOnly':
      if (!data.ranking) {
        ctx.addIssue({
          code: 'custom',
          message: 'rankingOnly タイプでは ranking が必須です。',
          path: ['ranking'],
        })
      }
      break
  }
})
export type BotMessageType = z.infer<typeof BotMessageSchema>
