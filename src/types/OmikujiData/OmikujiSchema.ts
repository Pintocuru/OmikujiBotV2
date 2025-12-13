// types/OmikujiBot/OmikujiSchema.ts
// 250722_1 OmikujiLimits の新規作成
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { BaseRecordSchema } from '@shared/types'
import { soundList } from '@/Toolkit/sounds/soundMap'
import { CommentThresholdSchema } from '../OmikujiProcess/CommentThresholdSchema'

// PostAction delaySeconds
const PostActionBaseSchema = z.object({
  delaySeconds: z
    .number()
    .min(POST_SETTINGS.basicDelaySeconds * -1)
    .default(0)
    .catch(0),
})

// PostAction MessageBody (独立スキーマ化)
export const PostActionMessageBodySchema = z
  .object({
    bubble: z.string().optional().catch(undefined),
    toast: z.string().optional().catch(undefined),
    rankingRank: z.string().optional().catch(undefined),
    rankingName: z.string().optional().catch(undefined),
    rankingPoint: z.string().optional().catch(undefined),
    rankingSymbol: z.string().optional().catch(undefined),
    dialog: z.string().optional().catch(undefined),
  })
  .default({})
  .catch({})

// PostAction message
export const PostActionMessageSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('message'),
  characterKey: z.string().default('').catch(''),
  iconKey: CharacterEmotionSchema.default('default').catch('default'),
  enterMotion: z.enum(motionLabel).optional().catch(undefined),
  sound: z.enum(soundList).optional().catch(undefined),
  message: PostActionMessageBodySchema,
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
 * GameScriptsSchema ゲームスクリプト用
 */
export const GameScriptsSchema = z.object({
  scriptId: z.union([z.string(), z.null()]).default(null).catch(null),
  scriptParams: z.string().default('').catch(''),
  characterKey: z.string().default('').catch(''),
})

/**
 * PostActionRecordSchema
 */
export const ActionSetSchema = z.object({
  ...BaseRecordSchema.shape,
  postActions: PostActionArraySchema.default([]).catch([]),
  gameScripts: z.union([GameScriptsSchema, z.null()]).default(null).catch(null),
})

/**
 * OmikujiItemSchema
 */
export const OmikujiItemSchema = z.object({
  ...ActionSetSchema.shape,
  weight: z.number().min(0).default(1).catch(1),
  rank: z.number().min(0).default(1).catch(1),
  criteria: CommentThresholdSchema.default(CommentThresholdSchema.parse({})).catch(CommentThresholdSchema.parse),
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
          actionType: 'message', // actionType を明示的に追加 (新しいスキーマに準拠)
          message: {
            bubble: '<<user>>さんの運勢は【大吉】', // 新しい形式
          },
          delaySeconds: 0,
        },
      ],
    }),
  ])
  .catch([])

/**
 * PostActionSetSchema アクションセットデータ
 */
export const PostActionSetSchema = z.record(z.string(), OmikujiItemSchema).default({}).catch({})

// 型定義
export type PostActionType = z.infer<typeof PostActionSchema>
export type PostActionMessageType = z.infer<typeof PostActionMessageSchema>
export type PostActionWordPartyType = z.infer<typeof PostActionWordPartySchema>
export type PostActionRecordType = z.infer<typeof ActionSetSchema>
export type PostActionSetType = z.infer<typeof PostActionSetSchema>
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>
