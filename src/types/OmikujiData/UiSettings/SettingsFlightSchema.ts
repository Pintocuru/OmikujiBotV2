// src/types/OmikujiData/UiSettings/SettingsFlightSchema.ts
import { z } from 'zod'
import { themes } from '@shared/styles/DaisyUiTheme'

export const statKeyNum = [
  'userName', // ユーザーネーム
  'tc', // 個人の総チャット数
  'giftPrice', // ギフト金額
] as const
export type StatKeyNum = (typeof statKeyNum)[number]

/**
 * コンポーネント種別マップ
 */
export const flightComponentMap = {
  nineViewers: '9人のユーザー。',
  bingo: 'ビンゴカード風',
  flightSeat: '8時間フライト',
  graduation: '卒業写真',
  ferrisWheel: '観覧車',
} as const
export type FlightComponentKind = keyof typeof flightComponentMap

/**
 * コンポーネント種別ごとのデフォルト設定
 * number: 固定席数（計算不要）
 * string: JSON配列文字列（カスタムレイアウト、パースして使用）
 */
export const flightComponentDefaults: Record<FlightComponentKind, number | string> = {
  nineViewers: '[3, 3, 3]',
  bingo: 24,
  flightSeat: '[4, 6, 6, 6]',
  graduation: '[12, 13, 12]',
  ferrisWheel: 13,
}

type PresetItem = {
  label: string
  layout: number[]
}

export const presets: Record<FlightComponentKind, Record<string, PresetItem> | null> = {
  nineViewers: {
    p1: { label: '3×3 グリッド', layout: [3, 3, 3] },
    p2: { label: '横一列', layout: [9] },
    p3: { label: '縦一列', layout: [1, 1, 1, 1, 1, 1, 1, 1, 1] },
  },

  bingo: null,

  flightSeat: {
    p1: { label: 'スタンダードキャビン', layout: [4, 6, 6, 6] },
    p2: { label: 'リージョナルジェット', layout: [3, 3, 4] },
    p3: { label: 'ワイドボディ配列', layout: [3, 4, 4, 4, 3] },
    p4: { label: '満席ロングフライト', layout: [6, 8, 8, 8, 8, 6, 4] },
    p5: { label: '超大型機キャビン', layout: [4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4] },
  },

  graduation: {
    p2: { label: '一般的なクラス', layout: [12, 13, 12] },
    p1: { label: '小さなクラス', layout: [8, 7, 8] },
    p3: { label: '学年全員', layout: [16, 17, 16, 17] },
    p4: { label: '学年全員（大）', layout: [20, 21, 20, 21, 20] },
    p5: { label: '学校全員(先生・給食のおばちゃん含む)', layout: [24, 23, 24, 23, 24, 23, 24, 23, 24, 23, 24, 23, 24] },
  },

  ferrisWheel: null,
}

/**
 * SettingsFlightSchema
 */
export const SettingsFlightSchema = z.object({
  component: z
    .enum(Object.keys(flightComponentMap) as [FlightComponentKind])
    .default('flightSeat')
    .catch('flightSeat'),
  customLayout: z.string().optional(),
  targetEventKey: z.string().default('').catch(''),
  label: z.string().default('ユーザーリスト').catch('ユーザーリスト'), // 🛫 8時間フライト、どの席に座る？
  color: z.enum(themes).default('lofi').catch('lofi'),
  statKey: z.enum(statKeyNum).nullable().default(null).catch(null),
})
export type SettingsFlightSeatType = z.infer<typeof SettingsFlightSchema>
