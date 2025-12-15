// types/OmikujiBot/OmikujiSchema.ts
// 250722_1 OmikujiLimits の新規作成
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { BaseRecordSchema } from '@shared/types'
import { soundList } from '@/Toolkit/sounds/soundMap'

import { PostActionType as OldPostActionType } from '@/Toolkit/migrations/v1_to_v2/OmikujiDataV1/OmikujiSchema'
import { CriteriaThresholdSchema } from '../OmikujiProcess/CriteriaThresholdSchema'

// PostAction delaySeconds
const PostActionBaseSchema = z.object({
  delaySeconds: z
    .number()
    .min(POST_SETTINGS.basicDelaySeconds * -1)
    .default(0)
    .catch(0),
})

// PostAction MessageBody
export const PostActionMessageBodySchema = z
  .object({
    bubble: z.string().optional().catch(undefined),
    toast: z.string().optional().catch(undefined),
    rankingKey: z.string().optional().catch(undefined), // コンポーネント用key
    rankingDisplayScore: z.string().optional().catch(undefined), // 表示用
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
  priority: z.boolean().default(false).catch(false), // 優先 trueならrank=2
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
export type PostActionType = z.infer<typeof PostActionSchema>
export type PostActionMessageType = z.infer<typeof PostActionMessageSchema>
export type PostActionSoundType = z.infer<typeof PostActionSoundSchema>
export type PostActionWordPartyType = z.infer<typeof PostActionWordPartySchema>
export type PostActionActionSetType = z.infer<typeof PostActionActionSetSchema>
export type GameScriptsType = z.infer<typeof GameScriptsSchema>

export type PostActionRecordType = z.infer<typeof ActionSetSchema>
export type PostActionSetType = z.infer<typeof PostActionSetSchema>
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>

// ---
// マイグレーション用関数

/**
 * 古い PostAction オブジェクトを新しい判別共用体形式 (PostActionSchema) にマイグレーションする。
 * messageContent/messageToast を message.bubble/message.toast に変換し、
 * 古い単一のアクションから複数のアクションが生成される可能性があるため、配列を返します。
 */
function migratePostAction(oldAction: OldPostActionType): PostActionType[] {
  if (oldAction.messageContent === undefined || oldAction.messageContent === null) {
    const parseResult = PostActionSchema.safeParse(oldAction)
    if (parseResult.success) return [parseResult.data]
  }

  const newActions: PostActionType[] = []

  const baseFields = {
    delaySeconds: oldAction.delaySeconds ?? 0,
  }

  // 1. actionSet の移行 (最優先)
  if (oldAction.actionSetKey && oldAction.actionSetKey.trim() !== '') {
    newActions.push({
      ...baseFields,
      actionType: 'actionSet',
      actionSetKey: oldAction.actionSetKey,
    })
    return newActions
  }

  // 2. message / toast の移行 (新しい 'message' actionTypeに集約)
  const hasMessageOrToast =
    (oldAction.messageContent && oldAction.messageContent.trim() !== '') ||
    (oldAction.messageToast && oldAction.messageToast.trim() !== '')

  if (hasMessageOrToast) {
    newActions.push({
      ...baseFields,
      actionType: 'message',
      characterKey: oldAction.characterKey ?? '',
      iconKey: oldAction.iconKey ?? 'default',
      sound: oldAction.sound as z.infer<typeof PostActionMessageSchema>['sound'],
      message: {
        bubble: oldAction.messageContent, // ★ messageContent -> message.bubble
        toast: oldAction.messageToast, // ★ messageToast -> message.toast
      },
    })
  }

  // 3. wordParty の移行
  if (oldAction.wordParty && oldAction.wordParty.trim() !== '') {
    newActions.push({
      ...baseFields,
      actionType: 'wordParty',
      wordParty: oldAction.wordParty,
    })
  }

  // 4. sound の移行 (messageアクションに統合されなかった場合のみ)
  const isSoundOnly = oldAction.sound && oldAction.sound.trim() !== '' && !hasMessageOrToast
  if (isSoundOnly) {
    newActions.push({
      ...baseFields,
      actionType: 'sound',
      sound: oldAction.sound as z.infer<typeof PostActionSoundSchema>['sound'],
    })
  }

  // 5. フォールバック (何も設定されていなかった場合)
  if (newActions.length === 0) {
    newActions.push({
      ...baseFields,
      actionType: 'message',
      characterKey: oldAction.characterKey ?? '',
      iconKey: oldAction.iconKey ?? 'default',
      sound: oldAction.sound as z.infer<typeof PostActionMessageSchema>['sound'],
      message: {},
    })
  }

  return newActions
}
