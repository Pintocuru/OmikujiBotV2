// src/types/OmikujiData/UiSettings/FlightSeatSchema.ts
import { z } from 'zod'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { normalizedObject } from '../ParsedDefault'

// -----------------------------------------------
// コンポーネント定義（マスター）
// -----------------------------------------------

type PresetItem = {
  label: string
  layout: number[]
}

type FlightComponentDef = {
  label: string
  accessLevel: 'pro'
  /** number: 固定席数 / string: JSON配列文字列（カスタムレイアウト） */
  defaultLayout: number | string
  presets: Record<string, PresetItem> | null
}

export const flightComponentDefs = {
  plain: {
    label: 'プレーン',
    accessLevel: 'pro',
    defaultLayout: '[3, 3, 3]',
    presets: {
      p1: { label: '3×3 グリッド', layout: [3, 3, 3] },
      p2: { label: '横一列', layout: [9] },
      p3: { label: '縦一列', layout: [1, 1, 1, 1, 1, 1, 1, 1, 1] },
    },
  },
  nineViewers: {
    label: '9人のユーザー。',
    accessLevel: 'pro',
    defaultLayout: '[3, 3, 3]',
    presets: {
      p1: { label: '3×3 グリッド', layout: [3, 3, 3] },
      p2: { label: '横一列', layout: [9] },
      p3: { label: '縦一列', layout: [1, 1, 1, 1, 1, 1, 1, 1, 1] },
    },
  },
  bingo: {
    label: 'ビンゴカード風',
    accessLevel: 'pro',
    defaultLayout: 24,
    presets: null,
  },
  flightSeat: {
    label: '8時間フライト',
    accessLevel: 'pro',
    defaultLayout: '[4, 6, 6, 6]',
    presets: {
      p1: { label: 'スタンダードキャビン', layout: [4, 6, 6, 6] },
      p2: { label: 'リージョナルジェット', layout: [3, 3, 4] },
      p3: { label: 'ワイドボディ配列', layout: [3, 4, 4, 4, 3] },
      p4: { label: '満席ロングフライト', layout: [6, 8, 8, 8, 8, 6, 4] },
      p5: { label: '超大型機キャビン', layout: [4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4] },
    },
  },
  graduation: {
    label: '卒業写真',
    accessLevel: 'pro',
    defaultLayout: '[12, 13, 12]',
    presets: {
      p1: { label: '一般的なクラス', layout: [12, 13, 12] },
      p2: { label: '小さなクラス', layout: [8, 7, 8] },
      p3: { label: '2クラス合同', layout: [16, 17, 16, 17] },
      p4: { label: '学年全員', layout: [20, 21, 20, 21, 18] },
    },
  },
  ferrisWheel: {
    label: '観覧車',
    accessLevel: 'pro',
    defaultLayout: 13,
    presets: null,
  },
  goldenCrowd: {
    label: '300ユーザー',
    accessLevel: 'pro',
    defaultLayout: '[22, 23, 24, 23, 24, 23, 22, 23, 24, 23, 24, 23, 22]',
    presets: {
      p1: { label: 'ともだち100人できるかな', layout: [12, 13, 12, 13, 12, 13, 12, 13] },
      p2: { label: '300人埋めてみろよVTuber', layout: [22, 23, 24, 23, 24, 23, 22, 23, 24, 23, 24, 23, 22] },
    },
  },
} as const satisfies Record<string, FlightComponentDef>

export type FlightComponentKind = keyof typeof flightComponentDefs

// -----------------------------------------------
// 既存インターフェースと互換性のある派生エクスポート
// -----------------------------------------------

/** defaultLayout だけ取り出したマップ */
export const flightComponentDefaults = Object.fromEntries(
  Object.entries(flightComponentDefs).map(([k, v]) => [k, v.defaultLayout])
) as Record<FlightComponentKind, number | string>

/** presets だけ取り出したマップ */
export const presets = Object.fromEntries(
  Object.entries(flightComponentDefs).map(([k, v]) => [k, v.presets])
) as Record<FlightComponentKind, Record<string, PresetItem> | null>

// -----------------------------------------------
// statKey
// -----------------------------------------------

export const statKeyDefs = {
  userName: { label: 'ユーザー名' },
  tc: { label: 'チャット数' },
  giftPrice: { label: 'ギフト金額' },
} as const satisfies Record<string, { label: string }>

export const statKeyNum = Object.keys(statKeyDefs) as [StatKeyNum, ...StatKeyNum[]]
export type StatKeyNum = keyof typeof statKeyDefs

// -----------------------------------------------
// FlightSeatSchema
// -----------------------------------------------

export const FlightSeatSchema = z.object({
  component: z
    .enum(Object.keys(flightComponentDefs) as [FlightComponentKind])
    .default('flightSeat')
    .catch('flightSeat'),
  customLayout: z.string().optional(),
  targetEventKey: z.string().default('').catch(''),
  color: normalizedObject(DaisyUiThemeFieldsSchema),
  statKey: z.enum(statKeyNum).nullable().default(null).catch(null),
})
export type FlightSeatType = z.infer<typeof FlightSeatSchema>
