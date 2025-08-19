// types/OmikujiBot/OmikujiSchema.ts
// 250722_1 OmikujiLimits の新規作成
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { BaseRecordSchema } from '@shared/types'

// PostActionWordParty
export const PostActionWordPartySchema = z.object({
  delaySeconds: z
    .number()
    .min(POST_SETTINGS.basicDelaySeconds * -1)
    .default(0)
    .catch(0),
  wordParty: z.string().default('').catch(''),
})

// PostAction
export const PostActionSchema = z.object({
  ...PostActionWordPartySchema.shape,
  characterKey: z.string().default('').catch(''),
  iconKey: CharacterEmotionSchema.default('default').catch('default'),
  messageContent: z.string().default('').catch(''),
  messageToast: z.string().optional().catch(undefined),
})

// Omikuji
export const OmikujiSetSchema = z.object({
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

export const ArrayOmikujiSetSchema = z
  .array(OmikujiSetSchema)
  .default([
    OmikujiSetSchema.parse({
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
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>
