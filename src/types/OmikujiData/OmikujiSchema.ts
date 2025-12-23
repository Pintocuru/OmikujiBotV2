// types/OmikujiBot/OmikujiSchema.ts
// 250722_1 OmikujiLimits の新規作成
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { BaseRecordSchema } from '@shared/types'
import { soundList } from '@/Toolkit/sounds/soundMap'

import { CriteriaThresholdSchema } from '../OmikujiProcess/CriteriaThresholdSchema'
import { migratePostAction } from './migrations/migratePostAction'
import { PostActionMessageBodySchema } from './PostActionMessage'

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
  actionType: z.literal('message').default('message'),
  characterKey: z.string().catch('omiken'),
  iconKey: CharacterEmotionSchema.default('default').catch('default'),
  sound: z.enum(soundList).default('').catch(''),
  message: PostActionMessageBodySchema,
})
export type PostActionMessageType = z.infer<typeof PostActionMessageSchema>

// PostAction sound
export const PostActionSoundSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('sound').default('sound'),
  sound: z.enum(soundList).default('').catch(''),
})
export type PostActionSoundType = z.infer<typeof PostActionSoundSchema>

// PostAction WordParty
export const PostActionWordPartySchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('wordParty').default('wordParty'),
  wordParty: z.string().default('').catch(''),
})
export type PostActionWordPartyType = z.infer<typeof PostActionWordPartySchema>

// PostAction actionSet
export const PostActionActionSetSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('actionSet').default('actionSet'),
  actionSetKey: z.string().default('').catch(''),
})
export type PostActionActionSetType = z.infer<typeof PostActionActionSetSchema>

// PostAction わんコメ・BOTちゃんに投稿する型定義
export const PostActionSchema = z.discriminatedUnion('actionType', [
  PostActionMessageSchema,
  PostActionSoundSchema,
  PostActionWordPartySchema,
  PostActionActionSetSchema,
])
export type PostActionType = z.infer<typeof PostActionSchema>

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
  scriptId: z.string().default('').catch(''),
  queryString: z.string().default('').catch(''),
  characterKey: z.string().default('').catch(''),
})
export type GameScriptsType = z.infer<typeof GameScriptsSchema>

/**
 * PostActionRecordSchema
 */
export const ActionSetSchema = z.object({
  ...BaseRecordSchema.shape,
  postActions: z
    .array(z.any())
    .default([])
    .catch([])
    .transform((oldActions) => {
      // 1. マイグレーション関数の適用
      const migratedActions = oldActions.flatMap(migratePostAction)

      // 2. delaySecondsでソートし、新しい型として返す
      return migratedActions.sort((a, b) => a.delaySeconds - b.delaySeconds) as PostActionType[]
    }),
  gameScripts: z.union([GameScriptsSchema, z.null()]).default(null).catch(null),
})

/**
 * OmikujiItemSchema
 */
export const OmikujiItemSchema = z.object({
  ...ActionSetSchema.shape,
  weight: z.number().min(0).default(1).catch(1), // 出現割合
  rank: z.number().min(0).max(1).optional(), // 優先度
  isPriority: z.boolean().default(false).catch(false), // 優先 trueならrank=1
  criteria: z.union([CriteriaThresholdSchema, z.null()]).default(null).catch(null),
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
export type PostActionRecordType = z.infer<typeof ActionSetSchema>
export type PostActionSetType = z.infer<typeof PostActionSetSchema>
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>
