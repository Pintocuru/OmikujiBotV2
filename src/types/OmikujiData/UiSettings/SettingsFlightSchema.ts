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
  nineViewers: 9,
  bingo: 24,
  flightSeat: 22, // '[4, 6, 6, 6]'
  graduation: 37, // '[12, 13, 12]'
  ferrisWheel: 13,
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
