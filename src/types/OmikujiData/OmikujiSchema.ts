// types/OmikujiBot/OmikujiSchema.ts
// 250722_1 OmikujiLimits の新規作成
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { BaseRecordSchema } from '@shared/types'

/**

// 将来実装したいやつ

// PostAction delaySeconds
const PostActionBaseSchema = z.object({
  delaySeconds: z
    .number()
    .min(POST_SETTINGS.basicDelaySeconds * -1)
    .default(0)
    .catch(0),
});

// PostAction messageContent
export const PostActionMessageSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal("message"),
  characterKey: z.string().default("").catch(""),
  iconKey: CharacterEmotionSchema.default("default").catch("default"),
  enterMotion: z.enum(motionLabel).optional().catch(undefined),
  messageContent: z.string().default("").catch(""),
  wordParty: z.string().optional().catch(undefined),
  sound: z.string().optional().catch(undefined),
});

// PostAction トースト
export const PostActionToastSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal("toast"),
  characterKey: z.string().default("").catch(""),
  messageToast: z.string().default("").catch(""),
  wordParty: z.string().optional().catch(undefined),
  sound: z.string().optional().catch(undefined),
});

// PostAction WordParty
export const PostActionWordPartySchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal("wordParty"),
  wordParty: z.string().default("").catch(""),
});

// PostAction actionSet
export const PostActionActionSetSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal("actionSet"),
  actionSetId: z.string().default("").catch(""),
});


// PostAction わんコメ・BOTちゃんに投稿する型定義
export const PostActionSchema = z.discriminatedUnion("actionType", [
  PostActionMessageSchema,
  PostActionToastSchema,
  PostActionWordPartySchema,
]);

 */

/**
 * PostAction WordParty用
 */
export const PostActionWordPartySchema = z.object({
  delaySeconds: z
    .number()
    .min(POST_SETTINGS.basicDelaySeconds * -1)
    .default(0)
    .catch(0),
  wordParty: z.string().default('').catch(''),
  actionType: z.literal('wordParty').default('wordParty'),
})

/**
 * PostAction わんコメ・BOTちゃんに投稿する型定義
 */
export const PostActionSchema = z
  .object({
    delaySeconds: z
      .number()
      .min(POST_SETTINGS.basicDelaySeconds * -1)
      .default(0)
      .catch(0),
    wordParty: z.string().default('').catch(''),
    characterKey: z.string().default('').catch(''),
    iconKey: CharacterEmotionSchema.default('default').catch('default'),
    messageContent: z.string().default('').catch(''),
    messageToast: z.string().optional().catch(undefined),
    enterMotion: z.enum(motionLabel).optional().catch(undefined),
    sound: z.string().optional().catch(undefined),
    actionType: z
      .union([
        z.literal('legacy'), // 廃止
        z.literal('message'),
        z.literal('toast'),
        z.literal('wordParty'),
        z.literal('actionSet'),
      ])
      .default('message')
      .catch('message'),
  })
  .transform((data) => {
    let actionType: typeof data.actionType = 'legacy'

    if (data.messageContent && data.messageContent.trim() !== '') {
      actionType = 'message'
    } else if (data.messageToast && data.messageToast.trim() !== '') {
      actionType = 'toast'
    } else if (data.wordParty && data.wordParty.trim() !== '') {
      actionType = 'wordParty'
    }

    return {
      ...data,
      actionType,
    }
  })

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
