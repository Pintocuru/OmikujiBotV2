// src/types/OmikujiData/UiSettings/SettingsLiverSchema.ts
import { z } from 'zod'
import { themes } from '@shared/styles/DaisyUiTheme'
import { BaseVariantLabels } from '@shared/components/parts/ItemVariantTypes'

/**
 * ライバーカウンターコンポーネントの表示名マップ
 */
export const liverComponentMap = {
  basicCirclePlain: '丸型シンプル',
  basicCircle: '丸型カラー',
  pixelBadgePlain: 'ピクセルバッジ',
  pixelBadge: 'ピクセルカラー',
  magicalStone: '魔法石',
  starBurst: '星',
  hexGrid: 'ヘキサゴン',
} as const

export const liverDefaultMap = {
  upVote: '高評価数',
  viewer: '視聴者数',
  syoken: '初見さん数',
  commenter: 'コメントしたユーザー数',
  lc: '配信コメント数',
  totalPrice: '合計金額',
} as const

/**
 * ライバーカウンターv2 LiverCounter
 */
const liverComponentValues = Object.keys(liverComponentMap) as LiverComponent[]
export type LiverComponent = keyof typeof liverComponentMap

const liverDefaultKeyLabels = Object.keys(liverDefaultMap) as LiverDefaultKey[]
export type LiverDefaultKey = keyof typeof liverDefaultMap

export const SettingsLiverSchema = z.object({
  component: z.enum(liverComponentValues).default('basicCircle').catch('basicCircle'), // カウンタースタイル
  color: z.enum(themes).default('lofi').catch('lofi'), // DaisyUiテーマ
  colorCycle: z
    .array(z.enum(BaseVariantLabels))
    .default(['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'])
    .catch([]), // 任意color
  defaultCounters: z.array(z.enum(liverDefaultKeyLabels)).default(['lc']).catch(['upVote']), // デフォルトカウンター（6種から選ぶ、順序なし）
  eventCounters: z.array(z.string()).max(8).default([]).catch([]), // event カウンター CommentRuleSchema.key
})
export type SettingsLiverCounterType = z.infer<typeof SettingsLiverSchema>
