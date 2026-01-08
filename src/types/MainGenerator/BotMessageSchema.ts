// src\types\MainGenerator\BotMessageSchema.ts
import { z } from 'zod'
import { CharacterColorScheme, CharacterEmotionSchema } from '../OmikujiData/CharacterSchema'
import { PostActionMessageBodySchema, RankingMessageSchema } from '../OmikujiData/ActionMessage'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'

/**
 * CommentBubbleSchema
 */
export const CommentBubbleSchema = z.object({
  name: z.string().default('error'),
  message: z.string().nullable().default(null),
  toast: z.string().optional(), // 将来消す
  isToast: z.boolean().default(false),
  characterKey: z.string().nullable().default(null),
  iconKey: CharacterEmotionSchema.default('default'),
  displaySeconds: z.number().min(0).max(60).optional(),
  color: CharacterColorScheme.catch(CharacterColorScheme.parse({})),
})
export type CommentBubbleType = z.infer<typeof CommentBubbleSchema>

// BotMessage
export const BotMessageSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  timestamp: z.string().default(() => new Date().toISOString()), // 投稿日時
  delaySeconds: z.number().default(0), // 投稿までの遅延時間（秒）

  name: z.string().default('error'), // 名前
  message: PostActionMessageBodySchema, // コメント
  characterKey: z.string().nullable().default(null), // キャラクターキー
  iconKey: CharacterEmotionSchema.default('default'), // アイコンキー(必要かどうかはわからん…)
  displaySeconds: z.number().min(0).max(60).optional(), // 表示時間（秒）0-60秒の範囲
  color: CharacterColorScheme.catch(CharacterColorScheme.parse({})), // カラー
})
export type BotMessage = z.infer<typeof BotMessageSchema>

// ------------------

// 新しい型定義
export const BotMessageBaseSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  timestamp: z.string().default(() => new Date().toISOString()),
  delaySeconds: z.number().default(0),
  type: z.enum(['system', 'comment', 'rankingOnly']),

  bubble: CommentBubbleSchema.optional(),
  user: UserNameSchema.optional(),
  ranking: RankingMessageSchema.optional(),
})

export const BotMessageSchema2 = BotMessageBaseSchema.superRefine((data, ctx) => {
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
      // ranking は optional なのでチェック不要
      break

    case 'rankingOnly':
      if (!data.ranking) {
        ctx.addIssue({
          code: 'custom',
          message: 'rankingOnly タイプでは ranking が必須です。',
          path: ['ranking'],
        })
      }
      // user は optional
      // bubble は不要
      break
  }
})
export type BotMessage2 = z.infer<typeof BotMessageSchema2>
