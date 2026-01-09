// src\types\OmikujiData\ActionSet.ts
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { soundList } from '@sounds/soundMap'
import { PostActionType as OldPostActionType } from '@migrations/v1_to_v2/OmikujiDataV1/OmikujiSchema'
import { BaseRecordSchema } from '@shared/types'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { WeightValueSchema } from './PlaceholderSchema'

// PostAction delaySeconds
const PostActionBaseSchema = z.object({
  delaySeconds: z
    .number()
    .min(POST_SETTINGS.basicDelaySeconds * -1)
    .default(0)
    .catch(0),
})

// PostAction message
// PostAction MessageBody
export const PostActionMessageMessageSchema = z
  .object({
    bubble: z.string().nullable().default(null).catch(null),
    toast: z.string().optional(),
    isToast: z.boolean().default(false).catch(false),
  })
  .transform((v) => {
    if (v.toast)
      return {
        bubble: v.toast ?? null,
        isToast: true,
        toast: undefined,
      }
    else return v
  })

export type PostActionMessageMessageType = z.infer<typeof PostActionMessageMessageSchema>

export const PostActionMessageSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('message').default('message'),
  characterKey: z.string().catch('omiken'),
  iconKey: CharacterEmotionSchema.default('default').catch('default'),
  sound: z.enum(soundList).default('').catch(''),
  message: PostActionMessageMessageSchema.default(PostActionMessageMessageSchema.parse({})).catch(
    PostActionMessageMessageSchema.parse({})
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
  wordParty: z.string().default('').catch(''),
})
export type PostActionWordPartyType = z.infer<typeof PostActionWordPartySchema>

// PostAction actionSet
export const PostActionActionSetSchema = z.object({
  ...PostActionBaseSchema.shape,
  actionType: z.literal('actionSet').default('actionSet'),
  actionSetKeys: z.union([z.string(), z.array(z.union([z.string(), WeightValueSchema]))]).transform((value) => {
    if (typeof value === 'string') {
      return value === '' ? [] : [value]
    }
    return value
  }),
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
 * GameScriptsSchema ゲームスクリプト用
 */
export const GameScriptsSchema = z.object({
  scriptId: z.string().default('').catch(''),
  queryString: z.string().default('').catch(''),
  characterKey: z.string().default('').catch(''),
})
export type GameScriptsType = z.infer<typeof GameScriptsSchema>

/**
 * ActionSetSchema
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
export type ActionSetType = z.infer<typeof ActionSetSchema>

// ---
// マイグレーション用関数

/**
 * 古い PostAction オブジェクトを新しい判別共用体形式 (PostActionSchema) にマイグレーションする。
 * messageContent/messageToast を message.bubble/message.toast に変換し、
 * 古い単一のアクションから複数のアクションが生成される可能性があるため、配列を返します。
 */
export function migratePostAction(oldAction: OldPostActionType): PostActionType[] {
  if (oldAction.messageContent === undefined || oldAction.messageContent === null) {
    const parseResult = PostActionSchema.safeParse(oldAction)
    if (parseResult.success) return [parseResult.data]
  }

  const newActions: PostActionType[] = []

  const baseFields = {
    delaySeconds: oldAction.delaySeconds ?? 0,
  }
  // 1. actionSet の移行
  if (oldAction.actionSetKey && oldAction.actionSetKey.trim() !== '') {
    newActions.push({
      ...baseFields,
      actionType: 'actionSet',
      actionSetKeys: [oldAction.actionSetKey],
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
      message: PostActionMessageMessageSchema.parse({
        bubble: oldAction.messageContent, // ★ messageContent -> message.bubble
        toast: oldAction.messageToast, // ★ messageToast -> message.toast
        isToast: oldAction.messageToast ? true : false,
      }),
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
      message: PostActionMessageMessageSchema.parse({
        bubble: oldAction.messageContent,
        toast: oldAction.messageToast,
        isToast: oldAction.messageToast ? true : false,
      }),
    })
  }

  return newActions
}
