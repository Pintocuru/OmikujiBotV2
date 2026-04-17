// src/types/OmikujiData/UiSettings/StreamCounterSchema.ts
import { z } from 'zod'
import { daisyUIColor, themes } from '@shared/styles/DaisyUiTheme'
import { idSchema } from '@shared/types'

/**
 * ライバーカウンターコンポーネントの表示名マップ
 */
export const streamComponentMap = {
  basicCirclePlain: {
    label: '丸型シンプル',
    accessLevel: 'basic',
    layout: 'horizontal', // 横並び
  },
  basicCircle: {
    label: '丸型カラー',
    accessLevel: 'pro',
    layout: 'horizontal',
  },
  pixelBadgePlain: {
    label: 'ピクセルバッジ',
    accessLevel: 'basic',
    layout: 'horizontal',
  },
  pixelBadge: {
    label: 'ピクセルカラー',
    accessLevel: 'pro',
    layout: 'horizontal',
  },
  magicalStone: {
    label: '魔法石',
    accessLevel: 'pro',
    layout: 'horizontal',
  },
  starBurst: {
    label: '星',
    accessLevel: 'pro',
    layout: 'horizontal',
  },
  hexGrid: {
    label: 'ヘキサゴン',
    accessLevel: 'pro',
    layout: 'horizontal',
  },
  badge: {
    label: 'バッジ',
    accessLevel: 'godMode',
    layout: 'vertical',
  },
} as const

const streamComponentValues = Object.keys(streamComponentMap) as LiverComponent[]
export type LiverComponent = keyof typeof streamComponentMap

export const labelStyleMap = {
  lucide: 'アイコン',
  emoji: '絵文字',
  text: 'テキスト',
} as const
const labelStyleValues = Object.keys(labelStyleMap) as LiverLabelStyle[]
export type LiverLabelStyle = keyof typeof labelStyleMap

export const streamDefaultMap = {
  syoken: '初コメ',
  commenter: 'コメントをしたユーザー数',
  lc: '配信コメント数',
  totalComments: '累計コメント数',
  upVote: '高評価数',
  viewer: '同時接続数',
  totalPrice: 'ギフト金額',
  follower: '登録者数',
  reaction: 'リアクション数(Youtubeのみ)',
} as const
export const streamDefaultKeyLabels = Object.keys(streamDefaultMap) as StreamDefaultKey[]
export type StreamDefaultKey = keyof typeof streamDefaultMap

export const StreamCounterVariablesSchema = z.object({
  id: idSchema,
  type: z.literal('variable').default('variable'),
  target: z.string(),
  label: z.string(),
})
export type StreamCounterVariable = z.infer<typeof StreamCounterVariablesSchema>

/**
 * ライバーカウンターv2 StreamCounter
 */

export const StreamCounterSchema = z.object({
  component: z.enum(streamComponentValues).default('basicCircle').catch('basicCircle'), // カウンタースタイル
  color: z.enum(themes).default('lofi').catch('lofi'), // DaisyUiテーマ
  colorCycle: z
    .array(z.enum(daisyUIColor))
    .default(['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'])
    .catch([]), // 任意color
  labelStyle: z.enum(labelStyleValues).default('lucide').catch('lucide'), // ラベルスタイル
  defaultCounters: z
    .array(z.enum(streamDefaultKeyLabels))
    .default(['syoken', 'commenter', 'upVote', 'viewer'])
    .catch(['upVote']), // デフォルトカウンター（6種から選ぶ、順序なし）
  eventCounters: z.array(z.string()).max(16).default([]).catch([]), // event カウンター CommentRuleSchema.key
  variableCounters: z.array(StreamCounterVariablesSchema).default([]),
})
export type StreamCounterType = z.infer<typeof StreamCounterSchema>
