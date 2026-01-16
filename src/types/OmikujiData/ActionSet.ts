// src\types\OmikujiData\ActionSet.ts
import { z } from 'zod'
import { CharacterEmotionSchema } from './CharacterSchema'
import { soundList } from '@sounds/soundMap'
import { PostActionType as OldPostActionType } from '@/common/migrations/v1_to_v2/OmikujiDataV130/OmikujiSchema'
import { BaseRecordSchema } from '@shared/types'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { WeightValueSchema } from './PlaceholderSchema'
import { MessageSquare, PartyPopper, Volume2, MessagesSquare, Sparkles } from 'lucide-vue-next'

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
    bubble: z.string().default('').catch(''),
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
  characterKey: z.string().default('').catch(''),
})
export type GameScriptsType = z.infer<typeof GameScriptsSchema>

/**
 * Special
 */
export const specialActionMap = {
  return: {
    label: '処理を終了する（return）',
    description: 'このルールで処理を終了し、以降のルールは実行されません。',
    variant: 'warning',
  },
  continue: {
    label: '次のルールへ進む（continue）',
    description: '次のルールへ処理を進めます。通常の動作と同じです。',
    variant: 'info',
  },
  log: {
    label: 'ログを出力する（log）',
    description: 'わんコメにおみくじ回数のログを投稿します。',
    variant: 'success',
  },
  reset: {
    label: 'おみくじ回数をリセットする（reset）',
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
  gameScripts: GameScriptsSchema.default(GameScriptsSchema.parse({})).catch(GameScriptsSchema.parse({})),
  special: SpecialActionSchema.default(SpecialActionSchema.parse({})).catch(SpecialActionSchema.parse({})),
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
