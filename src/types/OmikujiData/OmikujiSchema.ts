// types/OmikujiBot/OmikujiSchema.ts
// 250722_1 OmikujiLimits の新規作成
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { BaseRecordSchema } from '@shared/types'

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
})

/**
 * PostAction わんコメ・BOTちゃんに投稿する型定義
 */
export const PostActionSchema = z.object({
  ...PostActionWordPartySchema.shape,
  characterKey: z.string().default('').catch(''),
  iconKey: CharacterEmotionSchema.default('default').catch('default'),
  messageContent: z.string().default('').catch(''),
  messageToast: z.string().optional().catch(undefined),
  enterMotion: z.enum(motionLabel).optional().catch(undefined),
  sound: z.string().optional().catch(undefined),
})

/**
 * OmikujiItem 抽選用重さ付きおみくじデータ
 */
export const OmikujiItemSchema = z.object({
  ...BaseRecordSchema.shape,
  weight: z.number().min(0).default(1).catch(1),
  postActions: z
    .array(PostActionSchema)
    .default([])
    .catch([])
    .transform((actions) => {
      // delaySecondsが小さい順に並べ替え
      return actions.sort((a, b) => a.delaySeconds - b.delaySeconds)
    }),
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

export type PostActionType = z.infer<typeof PostActionSchema>
export type PostActionWordPartyType = z.infer<typeof PostActionWordPartySchema>
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>
