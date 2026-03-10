// src/types/OmikujiData/UiSettings/SettingsFlightSchema.ts
import { z } from 'zod'
import { themes } from '@shared/styles/DaisyUiTheme'

export const flightComponentMap = {
  nineViewers: '9人のユーザー。',
  bingo: 'ビンゴカード風',
  flightSeat: '8時間フライト',
  graduation: '卒業写真',
} as const

/**
 * flightSeat フライトシートレイアウトの表示名マップ
 */
export const flightSeatLayoutMap = {
  square: '正方形グリッド',
  circle: 'サークル',
  custom: 'カスタム配列',
} as const

/**
 * 8時間フライト flightSeat
 */
export type SeatLayout = keyof typeof flightSeatLayoutMap

export const statKeyNum = [
  'userName', // ユーザーネーム
  'tc', // 個人の総チャット数
  // 'score', // スコア(未実装)
  'giftPrice', // ギフト金額
] as const
export type StatKeyNum = (typeof statKeyNum)[number]

/**
 * レイアウト固有の設定（component内に収める）
 */
export const FlightSeatComponentSchema = z.object({
  layout: z
    .enum(Object.keys(flightSeatLayoutMap) as [keyof typeof flightSeatLayoutMap])
    .default('square')
    .catch('square'),

  // square の場合: 縦×横
  rows: z.number().min(1).max(30).default(4).catch(4), // 縦（行数）
  cols: z.number().min(1).max(40).default(6).catch(6), // 横（列数）

  // circle専用
  circleSeats: z.number().min(5).max(30).default(12).catch(12).optional(),

  // custom専用: 各行の座席数を配列で指定
  customLayout: z.string().default('[4, 6, 6, 6]').catch('[4, 6, 6, 6]'),
})
export type FlightSeatComponentConfig = z.infer<typeof FlightSeatComponentSchema>

/**
 * SettingsFlightSchema - FlightSeat コンポーネント全体設定
 * layout / rows / cols / circleSeats / customLayout は component 内で管理
 */
export const SettingsFlightSchema = z.object({
  // どのeventを対象にするか。空文字なら全体から
  targetEventKey: z.string().default('').catch(''),

  label: z.string().default('🛫 8時間フライト、どの席に座る？').catch('🛫 8時間フライト、どの席に座る？'),
  color: z.enum(themes).default('lofi').catch('lofi'),
  statKey: z.enum(statKeyNum).nullable().default(null).catch(null),

  // レイアウト固有設定
  component: FlightSeatComponentSchema.default(FlightSeatComponentSchema.parse({})).catch(
    FlightSeatComponentSchema.parse({})
  ),
})
export type SettingsFlightSeatType = z.infer<typeof SettingsFlightSchema>
