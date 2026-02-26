// src/types/OmikujiData/ActionSet.ts
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { WeightValueSchema } from './PlaceholderSchema'
import { soundKeys } from './SoundKey'
import { normalizedObject } from './ParsedDefault'
import { actionSetKindMap, PostFlowKindMaps, actionSpecialMap } from '../MetaMaps'
import { BaseRecordSchema } from '@shared/types'
import { POST_SETTINGS } from '@shared/sdk/PostSettings'
import { gameMetaMap } from '../MetaMaps/'

// PostFlow delaySeconds
const PostFlowBaseSchema = z.object({
  delaySeconds: z
    .number()
    .min(POST_SETTINGS.basicDelaySeconds * -1)
    .default(0)
    .catch(0),
})

// PostFlow message
export const PostFlowMessageContentSchema = z.object({
  bubble: z.string().default('').catch(''),
  isToast: z.boolean().default(false).catch(false),
})

export type PostFlowMessageContentType = z.infer<typeof PostFlowMessageContentSchema>

export const PostFlowMessageSchema = z.object({
  ...PostFlowBaseSchema.shape,
  // TODO(v3) : actionType -> kind
  actionType: z.literal('message').default('message'),
  characterKey: z.string().nullable().default(null).catch(null),
  iconKey: CharacterEmotionSchema.default('default').catch('default'),
  sound: z
    .union([z.enum(soundKeys), z.literal('')])
    .default('')
    .catch(''),
  message: normalizedObject(PostFlowMessageContentSchema),
})
export type PostFlowMessageType = z.infer<typeof PostFlowMessageSchema>

// PostFlow sound
export const PostFlowSoundSchema = z.object({
  ...PostFlowBaseSchema.shape,
  // TODO(v3) : actionType -> kind
  actionType: z.literal('sound').default('sound'),
  sound: z
    .union([z.enum(soundKeys), z.literal('')])
    .default('')
    .catch(''),
})
export type PostFlowSoundType = z.infer<typeof PostFlowSoundSchema>

// PostFlow WordParty
export const PostFlowWordPartySchema = z.object({
  ...PostFlowBaseSchema.shape,
  // TODO(v3) : actionType -> kind
  actionType: z.literal('wordParty').default('wordParty'),
  wordPartyId: z.string().optional(),
  wordParty: z.string().default('').catch(''),
  repeat: z.union([z.number().int().min(1), z.enum(['viewer', 'upVote'])]).optional(),
})
export type PostFlowWordPartyType = z.infer<typeof PostFlowWordPartySchema>

// PostFlow actionSet
export const PostFlowCallSchema = z.object({
  ...PostFlowBaseSchema.shape,
  // TODO(v3) : actionType -> kind
  // TODO(v3) : actionSet -> flowCall
  actionType: z.literal('actionSet').default('actionSet'),
  // TODO(v3) : actionSetKeys -> callKeys
  actionSetKeys: z.array(z.union([z.string(), WeightValueSchema])),
})
export type PostFlowCallType = z.infer<typeof PostFlowCallSchema>

// アクションタイプの定義
export type PostFlowKind = (typeof PostFlowKindMaps)[number]['type']

// PostFlow わんコメ・BOTちゃんに投稿する型定義
export const PostFlowSchema = z.discriminatedUnion('actionType', [
  PostFlowMessageSchema,
  PostFlowSoundSchema,
  PostFlowWordPartySchema,
  PostFlowCallSchema,
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
export const scriptGameKeys = Object.keys(gameMetaMap) as ScriptGameKey[]
export type ScriptGameKey = keyof typeof gameMetaMap
export const ScriptGameKeySchema = z.enum(scriptGameKeys)

// ScriptGameKey + 'basicList' の拡張版
export const ScriptGameExtendedKeySchema = z.union([
  ScriptGameKeySchema,
  z.literal('basicList'),
  z.literal('none'), // デバッグ用
])

export const GameScriptsSchema = z.object({
  // TODO(v3) : scriptId -> scriptKey
  scriptId: ScriptGameKeySchema.nullish().default(null).catch(null),
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
export const actionSetKind = Object.keys(actionSetKindMap) as ActionSetKind[]
export type ActionSetKind = keyof typeof actionSetKindMap

export const ActionSetSchema = z.object({
  ...BaseRecordSchema.shape,
  // TODO(v3) : type -> kind
  type: z.enum(actionSetKind).default('postActions').catch('postActions'),
  // TODO(v3) : postActions -> postFlows
  postActions: PostFlowArraySchema,
  gameScripts: normalizedObject(GameScriptsSchema),
  special: normalizedObject(ActionSpecialSchema),
})
export type ActionSetType = z.infer<typeof ActionSetSchema>
