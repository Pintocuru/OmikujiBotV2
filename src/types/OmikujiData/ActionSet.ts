// src/types/OmikujiData/ActionSet.ts
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { soundList } from '@sounds/soundMap'
import { BaseRecordSchema } from '@shared/types'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { WeightValueSchema } from './PlaceholderSchema'
import { MessageSquare, PartyPopper, Volume2, MessagesSquare } from 'lucide-vue-next'

// PostAction delaySeconds
const PostActionBaseSchema = z.object({
  delaySeconds: z
    .number()
    .min(POST_SETTINGS.basicDelaySeconds * -1)
    .default(0)
    .catch(0),
})

// PostAction message
export const PostActionMessageContentSchema = z.object({
  bubble: z.string().default('').catch(''),
  isToast: z.boolean().default(false).catch(false),
})

export type PostActionMessageMessageType = z.infer<typeof PostActionMessageContentSchema>

export const PostActionMessageSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('message').default('message'),
  characterKey: z.string().nullable().default(null).catch(null),
  iconKey: CharacterEmotionSchema.default('default').catch('default'),
  sound: z.enum(soundList).default('').catch(''),
  message: PostActionMessageContentSchema.default(PostActionMessageContentSchema.parse({})).catch(
    PostActionMessageContentSchema.parse({})
  ),
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
  wordPartyId: z.string().optional(),
  wordParty: z.string().default('').catch(''),
  repeat: z.union([z.number().int().min(1), z.enum(['viewer', 'upVote'])]).optional(),
})
export type PostActionWordPartyType = z.infer<typeof PostActionWordPartySchema>

// PostAction actionSet
export const PostActionActionSetSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('actionSet').default('actionSet'),
  actionSetKeys: z.array(z.union([z.string(), WeightValueSchema])),
})

export type PostActionActionSetType = z.infer<typeof PostActionActionSetSchema>

// アクションタイプの定義
export const postActionTypes = [
  { type: 'message' as const, label: 'メッセージ', icon: MessageSquare },
  { type: 'sound' as const, label: 'サウンド', icon: Volume2 },
  { type: 'wordParty' as const, label: 'WordParty', icon: PartyPopper },
  { type: 'actionSet' as const, label: 'アクションセット', icon: MessagesSquare },
]
export type PostActionTypes = (typeof postActionTypes)[number]['type']

// PostAction わんコメ・BOTちゃんに投稿する型定義
export const PostActionSchema = z.discriminatedUnion('actionType', [
  PostActionMessageSchema,
  PostActionSoundSchema,
  PostActionWordPartySchema,
  PostActionActionSetSchema,
])
export type PostActionType = z.infer<typeof PostActionSchema>

/**
 * PostActionArray わんコメ・BOTちゃんに投稿する型定義
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
export const specialActionMap = {
  return: {
    label: '処理を終了する(return)',
    description: 'このルールで処理を終了し、以降のルールは実行されません。',
    variant: 'warning',
  },
  continue: {
    label: '次のルールへ進む(continue)',
    description: '次のルールへ処理を進めます。通常の動作と同じです。',
    variant: 'info',
  },
  log: {
    label: 'ログを出力する(log)',
    description: 'わんコメにおみくじ回数のログを投稿します。',
    variant: 'success',
  },
  reset: {
    label: 'おみくじ回数をリセットする(reset)',
    description: 'おみくじの抽選回数をリセットします。',
    variant: 'neutral',
  },
} as const

export type ActionSetSpecialType = keyof typeof specialActionMap
export const specialAction = Object.keys(specialActionMap) as ActionSetSpecialType[]

export const SpecialActionSchema = z.enum(specialAction).default('return').catch('return')
export type PostActionSpecialType = z.infer<typeof SpecialActionSchema>

/**
 * ActionSetSchema
 */
export const ActionSetMap = {
  postActions: {
    label: 'BOTアクション',
    description: '下記の内容をわんコメやジェネレーターで表示します',
    icon: 'Bot',
  },
  gameScripts: {
    label: 'ゲームスクリプト',
    description: 'ゲームを実行し、結果をわんコメやジェネレーターで表示します',
    icon: 'Gamepad2',
  },
  special: {
    label: '特殊動作',
    description: 'おみくじの実行フローを制御する特殊な処理',
    icon: 'Zap',
  },
} as const

export type ActionSetCategory = keyof typeof ActionSetMap
export const actionSetCategory = Object.keys(ActionSetMap) as ActionSetCategory[]

export const ActionSetSchema = z.object({
  ...BaseRecordSchema.shape,
  type: z.enum(actionSetCategory).default('postActions').catch('postActions'),
  postActions: PostActionArraySchema,
  gameScripts: GameScriptsSchema.default(GameScriptsSchema.parse({})).catch(GameScriptsSchema.parse({})),
  special: SpecialActionSchema.default(SpecialActionSchema.parse({})).catch(SpecialActionSchema.parse({})),
})
export type ActionSetType = z.infer<typeof ActionSetSchema>
