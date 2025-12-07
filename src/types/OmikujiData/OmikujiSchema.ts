// types/OmikujiBot/OmikujiSchema.ts
// 250722_1 OmikujiLimits の新規作成
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { BaseRecordSchema } from '@shared/types'
import { soundList } from '@/Toolkit/sounds/soundMap'

// 将来実装したいやつ

// PostAction delaySeconds
const PostActionBaseSchema = z.object({
  delaySeconds: z
    .number()
    .min(POST_SETTINGS.basicDelaySeconds * -1)
    .default(0)
    .catch(0),
})

// PostAction message
export const PostActionMessageSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('message'),
  characterKey: z.string().default('').catch(''),
  iconKey: CharacterEmotionSchema.default('default').catch('default'),
  enterMotion: z.enum(motionLabel).optional().catch(undefined),
  sound: z.enum(soundList).optional().catch(undefined),
  message: z
    .object({
      hukidasi: z.string().optional().catch(undefined), // 吹き出し用
      toast: z.string().optional().catch(undefined), // トースト用
      banner: z.string().optional().catch(undefined), // 例: バナー用
      dialog: z.string().optional().catch(undefined), // 例: ダイアログ用
    })
    .default({})
    .catch({}),
})

// PostAction sound
export const PostActionSoundSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('sound'),
  sound: z.enum(soundList).optional().catch(undefined),
})

// PostAction WordParty
export const PostActionWordPartySchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('wordParty'),
  wordParty: z.string().default('').catch(''),
})

// PostAction actionSet
export const PostActionActionSetSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('actionSet'),
  actionSetKey: z.string().default('').catch(''),
})

// PostAction わんコメ・BOTちゃんに投稿する型定義
export const PostActionSchema = z.discriminatedUnion('actionType', [
  PostActionMessageSchema,
  PostActionSoundSchema,
  PostActionWordPartySchema,
  PostActionActionSetSchema,
])

/**
 * PostActions わんコメ・BOTちゃんに投稿する型定義
 */
export const PostActionArraySchema = z
  .array(PostActionSchema)
  .default([])
  .catch([])
  .transform((actions) => {
    // delaySecondsが小さい順に並べ替え
    return actions.sort((a, b) => a.delaySeconds - b.delaySeconds)
  })

/**
 * PostActionSetSchema アクションセットデータ
 */
export const PostActionRecordSchema = z.object({
  ...BaseRecordSchema.shape,
  postActions: PostActionArraySchema,
})

/**
 * OmikujiItem 抽選用重さ付きおみくじデータ
 */
export const OmikujiItemSchema = z.object({
  ...PostActionRecordSchema.shape,
  weight: z.number().min(0).default(1).catch(1),
  rankingScore: z.number().optional(),
})

/**
 * OmikujiSet おみくじ
 */
export const OmikujiSetSchema = z
  .array(OmikujiItemSchema)
  .default([
    OmikujiItemSchema.parse({
      postActions: [
        {
          characterKey: '',
          iconKey: 'default',
          messageContent: '<<user>>さんの運勢は【大吉】',
          delaySeconds: 0,
        },
      ],
    }),
  ])
  .catch([])

/**
 * PostActionSetSchema アクションセットデータ
 */
export const PostActionSetSchema = z.record(z.string(), PostActionRecordSchema).default({}).catch({})

// 型定義
export type PostActionType = z.infer<typeof PostActionSchema>
export type PostActionWordPartyType = z.infer<typeof PostActionWordPartySchema>
export type PostActionRecordType = z.infer<typeof PostActionRecordSchema>
export type PostActionSetType = z.infer<typeof PostActionSetSchema>
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>
