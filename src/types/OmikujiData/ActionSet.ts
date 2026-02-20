// src/types/OmikujiData/ActionSet.ts
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { WeightValueSchema } from './PlaceholderSchema'
import { soundKeys } from './SoundKey'
import { normalizedObject } from './ParsedDefault'
import { actionCategoryMap, postActionTypeMaps, actionSpecialMap } from '../MetaMaps'
import { BaseRecordSchema } from '@shared/types'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'

// PostFlow delaySeconds
const PostActionBaseSchema = z.object({
  delaySeconds: z
    .number()
    .min(POST_SETTINGS.basicDelaySeconds * -1)
    .default(0)
    .catch(0),
})

// PostFlow message
export const PostActionMessageContentSchema = z.object({
  bubble: z.string().default('').catch(''),
  isToast: z.boolean().default(false).catch(false),
})

export type PostActionMessageMessageType = z.infer<typeof PostActionMessageContentSchema>

export const PostFlowMessageSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('message').default('message'),
  characterKey: z.string().nullable().default(null).catch(null),
  iconKey: CharacterEmotionSchema.default('default').catch('default'),
  sound: z
    .union([z.enum(soundKeys), z.literal('')])
    .default('')
    .catch(''),
  message: PostActionMessageContentSchema.default(PostActionMessageContentSchema.parse({})).catch(
    PostActionMessageContentSchema.parse({})
  ),
})
export type PostActionMessageType = z.infer<typeof PostFlowMessageSchema>

// PostFlow sound
export const PostFlowSoundSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('sound').default('sound'),
  sound: z
    .union([z.enum(soundKeys), z.literal('')])
    .default('')
    .catch(''),
})
export type PostActionSoundType = z.infer<typeof PostFlowSoundSchema>

// PostFlow WordParty
export const PostFlowWordPartySchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('wordParty').default('wordParty'),
  wordPartyId: z.string().optional(),
  wordParty: z.string().default('').catch(''),
  repeat: z.union([z.number().int().min(1), z.enum(['viewer', 'upVote'])]).optional(),
})
export type PostActionWordPartyType = z.infer<typeof PostFlowWordPartySchema>

// PostFlow actionSet
export const PostFlowActionSetSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('actionSet').default('actionSet'),
  actionSetKeys: z.array(z.union([z.string(), WeightValueSchema])),
})

export type PostActionActionSetType = z.infer<typeof PostFlowActionSetSchema>

// アクションタイプの定義
export type ActionTagType = (typeof postActionTypeMaps)[number]['type']

// PostFlow わんコメ・BOTちゃんに投稿する型定義
export const PostFlowSchema = z.discriminatedUnion('actionType', [
  PostFlowMessageSchema,
  PostFlowSoundSchema,
  PostFlowWordPartySchema,
  PostFlowActionSetSchema,
])
export type PostFlowType = z.infer<typeof PostFlowSchema>

/**
 * PostActionArray わんコメ・BOTちゃんに投稿する型定義
 */
export const PostFlowArraySchema = z
  .array(PostFlowSchema)
  .default([])
  .catch([])
  .transform((actions) => {
    // delaySecondsが小さい順に並べ替え
    return actions.sort((a, b) => a.delaySeconds - b.delaySeconds)
  })

/**
 * GameScriptsSchema ゲームスクリプト
 */
export const GameScriptsSchema = z.object({
  scriptId: z.string().default('').catch(''),
  queryString: z.string().default('').catch(''),
  characterKey: z.string().nullish().default(null).catch(null),
})
export type GameScriptsType = z.infer<typeof GameScriptsSchema>

/**
 * Special
 */
const actionSpecial = Object.keys(actionSpecialMap) as ActionSpecialType[]
export const ActionSpecialSchema = z.enum(actionSpecial).default('return').catch('return')
export type ActionSpecialType = keyof typeof actionSpecialMap

/**
 * ActionSetSchema
 */
export const actionSetCategory = Object.keys(actionCategoryMap) as ActionSetCategory[]
export type ActionSetCategory = keyof typeof actionCategoryMap

export const ActionSetSchema = z.object({
  ...BaseRecordSchema.shape,
  type: z.enum(actionSetCategory).default('postActions').catch('postActions'),
  // TODO(v3) : postActions -> postFlows
  postActions: PostFlowArraySchema,
  gameScripts: normalizedObject(GameScriptsSchema),
  special: normalizedObject(ActionSpecialSchema),
})
export type ActionSetType = z.infer<typeof ActionSetSchema>
