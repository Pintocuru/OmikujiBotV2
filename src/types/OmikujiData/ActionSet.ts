// src/types/OmikujiData/ActionSet.ts
import { z } from 'zod'
import { WeightValuesArraySchema } from './PlaceholderSchema'
import { soundKeys } from './SoundKey'
import { normalizedObject } from './ParsedDefault'
import { actionSetKindMap, PostFlowKindMaps, actionSpecialMap } from '../MetaMaps'
import { BaseRecordSchema } from '@shared/types'
import { gameMetaMap } from '../MetaMaps/'

// PostFlow delaySeconds
const PostFlowBaseSchema = z.object({
  delaySeconds: z.number().default(0).catch(0),
})

// sound
const SoundMixin = {
  sound: z
    .union([z.enum(soundKeys), z.literal('')])
    .default('')
    .catch(''),
  soundPath: z.string().default('').catch(''),
}

// PostFlow message
export const PostFlowMessageContentSchema = z.object({
  bubble: z.string().default('').catch(''),
  // TODO(v3) : isToast -> isOneComme 、マイグレーション時にbool値を入れ替える
  isToast: z.boolean().default(false).catch(false),
})
export type PostFlowMessageContentType = z.infer<typeof PostFlowMessageContentSchema>

export const PostFlowMessageSchema = z.object({
  ...PostFlowBaseSchema.shape,
  // TODO(v3) : actionType -> kind
  actionType: z.literal('message').default('message'),
  characterKey: z.string().nullable().default(null).catch(null),
  iconKey: z.string().default('default').catch('default'),
  ...SoundMixin,
  message: normalizedObject(PostFlowMessageContentSchema),
})
export type PostFlowMessageType = z.infer<typeof PostFlowMessageSchema>

// PostFlow sound
export const PostFlowSoundSchema = z.object({
  ...PostFlowBaseSchema.shape,
  // TODO(v3) : actionType -> kind
  actionType: z.literal('sound').default('sound'),
  ...SoundMixin,
})
export type PostFlowSoundType = z.infer<typeof PostFlowSoundSchema>

// PostFlow WordParty
export const PostFlowWordPartySchema = z.object({
  ...PostFlowBaseSchema.shape,
  // TODO(v3) : actionType -> kind
  actionType: z.literal('wordParty').default('wordParty'),
  wordPartyId: z.string().optional(),
  // TODO(v3) : wordParty -> wordPartyPattern
  wordParty: z.string().default('').catch(''),
  repeat: z.union([z.number().int().min(1), z.enum(['viewer', 'upVote'])]).optional(),
})
export type PostFlowWordPartyType = z.infer<typeof PostFlowWordPartySchema>

// PostFlow Variable
export const PostFlowVariableSchema = z.object({
  ...PostFlowBaseSchema.shape,
  // TODO(v3) : actionType -> kind
  actionType: z.literal('variable').default('variable'),
  message: normalizedObject(PostFlowMessageContentSchema),
})
export type PostFlowVariableType = z.infer<typeof PostFlowVariableSchema>

// PostFlow bot
export const PostFlowBotSchema = PostFlowBaseSchema.extend({
  // TODO(v3) : actionType -> kind
  actionType: z.literal('bot').default('bot'),
  botName: z.string().default('').catch(''),
  message: normalizedObject(PostFlowMessageContentSchema),
})
export type PostFlowBotType = z.infer<typeof PostFlowBotSchema>

// PostFlow actionSet
export const PostFlowCallSchema = z.object({
  ...PostFlowBaseSchema.shape,
  // TODO(v3) : actionType -> kind
  // TODO(v3) : actionSet -> flowCall
  actionType: z.literal('actionSet').default('actionSet'),
  // TODO(v3) : actionSetKeys -> callKeys
  actionSetKeys: WeightValuesArraySchema,
})
export type PostFlowCallType = z.infer<typeof PostFlowCallSchema>

// アクションタイプの定義
export type PostFlowKind = keyof typeof PostFlowKindMaps

/**
 * message プロパティを持つ PostFlow のユニオン型
 */
export type PostFlowWithMessageType = PostFlowMessageType | PostFlowVariableType | PostFlowBotType

/**
 * 与えられた PostFlow が message プロパティを保持しているか判定する
 */
export const hasPostFlowMessage = (flow: PostFlowType): flow is PostFlowWithMessageType => {
  return flow.actionType === 'message' || flow.actionType === 'variable' || flow.actionType === 'bot'
}

// PostFlow わんコメ・BOTちゃんに投稿する型定義
export const PostFlowSchema = z.discriminatedUnion('actionType', [
  PostFlowMessageSchema,
  PostFlowSoundSchema,
  PostFlowWordPartySchema,
  PostFlowVariableSchema,
  PostFlowBotSchema,
  PostFlowCallSchema,

  //  PostFlowGameSchema, // v3時追加
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
export type ScriptGameExtendedKeyType = z.infer<typeof ScriptGameExtendedKeySchema>

// TODO(v3) : GameScriptsSchema -> PostFlowGameSchema
export const GameScriptsSchema = z.object({
  ...PostFlowBaseSchema.shape, // v3に向けた追加
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
// behavior : special の代わり

// ログ出力系アクション（logUserState / logGame / logOmikuji / logVariable）の設定 */
export const LOG_FORMAT_DEFAULT = '<<user>> <<score>> <<createdAt>>'
const ActionBehaviorLogSchema = z.object({
  targetKey: z.string().default('').catch(''), // 対象の eventKey または GameScript の scriptKey
  // ログ1行のフォーマット文字列（使用可能: <<index>> <<user>> <<userId>> <<score>> <<item>> <<flag>> <<createdAt>>）
  logFormat: z.string().default(LOG_FORMAT_DEFAULT).catch(LOG_FORMAT_DEFAULT),
  logLimit: z.number().min(1).max(100).default(5).catch(5), // 最大出力件数（1〜100）
})

export const ActionBehaviorSchema = z.object({
  type: z.enum(actionSpecial).default('return'), // 特殊アクションの種別
  isCountEvent: z.boolean().default(true), // このアクションをおみくじカウントとして記録するか
  countEvent: z.number().int().default(1).catch(1), // カウントする場合の数値
  log: normalizedObject(ActionBehaviorLogSchema), // ログ出力系アクションの設定
})
export type ActionBehaviorType = z.infer<typeof ActionBehaviorSchema>
export type ActionBehaviorLogType = z.infer<typeof ActionBehaviorLogSchema>

export const ActionSetBaseSchema = z.object({
  ...BaseRecordSchema.shape,
  // TODO(v3) : type -> kind
  type: z.enum(actionSetKind).default('postActions').catch('postActions'),
  // TODO(v3) : postActions -> postFlows
  postActions: PostFlowArraySchema,
  gameScripts: normalizedObject(GameScriptsSchema),
  // TODO(v3) :  behavior -> special に戻す
  special: ActionSpecialSchema.optional(),
  behavior: normalizedObject(ActionBehaviorSchema),

  /** アクション実行後のクールダウン秒数。設定した秒数の間、同一アクションの重複実行をブロックする */
  actionCooldownSeconds: z.number().min(0).optional(),
})

export const ActionSetSchema = ActionSetBaseSchema.transform((value) => {
  // 旧データ（string）の場合は自動変換
  if (value.special !== undefined) {
    return {
      ...value,
      behavior: ActionBehaviorSchema.parse({
        type: value.special === 'return' ? 'return' : 'continue',
        countEvent: value.special === 'return',
      }),
      special: undefined,
    }
  }
  return value
})

export type ActionSetType = z.infer<typeof ActionSetSchema>

/**
TODO(v3):

gameScripts -> postActions の一部にする
既存の gameScripts は廃止。マイグレーション時に transform で変換を行う。

export const PostFlowGameSchema = z.object({
  ...PostFlowBaseSchema.shape,
  actionType: z.literal('gameScript'),
  scriptId: ScriptGameKeySchema.nullish().default(null).catch(null),
  queryString: z.string().default('').catch(''),
  characterKey: z.string().nullish().default(null).catch(null),
})
export type PostFlowGameType = z.infer<typeof PostFlowGameSchema>





const ActionSetPostSchema = BaseRecordSchema.extend({
  // TODO(v3) : type -> kind
  type: z.literal('postActions'),
  // TODO(v3) : postActions -> postFlows
  postActions: PostFlowArraySchema,
})

const ActionSetGameSchema = BaseRecordSchema.extend({
  type: z.literal('gameScripts'),
  gameScripts: normalizedObject(GameScriptsSchema),
})

const ActionSetSpecialSchema = BaseRecordSchema.extend({
  type: z.literal('special'),
  // TODO(v3) :  behavior -> special に戻す
  special: z.enum(actionSpecial).optional(),
  behavior: normalizedObject(ActionBehaviorSchema),
}).transform((value) => {
  // 旧データ（string）の場合は自動変換
  if (value.special !== undefined) {
    return {
      ...value,
      behavior: ActionBehaviorSchema.parse({
        type: value.special === 'return' ? 'return' : 'continue',
        countEvent: value.special === 'return',
      }),
      special: undefined,
    }
  }
  return value
})



export const ActionSetBaseSchema = z.discriminatedUnion('type', [
  ActionSetPostSchema,
  ActionSetGameSchema,
  ActionSetSpecialSchema,
])


 */
