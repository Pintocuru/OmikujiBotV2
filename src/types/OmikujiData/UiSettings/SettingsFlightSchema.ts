// src/types/OmikujiData/UiSettings/SettingsFlightSchema.ts
import { z } from 'zod'
import { themes } from '@shared/styles/DaisyUiTheme'

/**
 * flightSeat フライトシートレイアウトの表示名マップ
 */
export const flightSeatLayoutMap = {
  square: '正方形グリッド',
  circle: 'サークル',
  custom: 'カスタム配列',
} as const
export type SeatLayout = keyof typeof flightSeatLayoutMap

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
  nineViewers: '9人のユーザー',
  bingo: 'ビンゴカード風',
  flightSeat: '8時間フライト',
  graduation: '卒業写真',
  ferrisWheel: '観覧車',
} as const
export type FlightComponentKind = keyof typeof flightComponentMap

/**
 * コンポーネント種別ごとのデフォルト設定
 */
export const flightComponentDefaults: Record<FlightComponentKind, Partial<FlightSeatComponentConfig>> = {
  nineViewers: { layout: 'square', rows: 3, cols: 3 },
  bingo: { layout: 'square', rows: 5, cols: 5 },
  flightSeat: { layout: 'custom', customLayout: '[4, 6, 6, 6]' },
  graduation: { layout: 'custom', customLayout: '[12, 13, 12]' },
  ferrisWheel: { layout: 'circle', circleSeats: 12 },
}

/**
 * レイアウト固有の設定（component内に収める）
 */
export const FlightSeatComponentSchema = z.object({
  kind: z
    .enum(Object.keys(flightComponentMap) as [FlightComponentKind])
    .default('flightSeat')
    .catch('flightSeat'),

  layout: z
    .enum(Object.keys(flightSeatLayoutMap) as [keyof typeof flightSeatLayoutMap])
    .default('custom')
    .catch('custom'),

  rows: z.number().min(1).max(30).default(4).catch(4),
  cols: z.number().min(1).max(40).default(6).catch(6),
  circleSeats: z.number().min(5).max(30).default(12).catch(12).optional(),
  customLayout: z.string().default('[4, 6, 6, 6]').catch('[4, 6, 6, 6]'),
})
export type FlightSeatComponentConfig = z.infer<typeof FlightSeatComponentSchema>

/**
 * SettingsFlightSchema
 */
export const SettingsFlightSchema = z.object({
  targetEventKey: z.string().default('').catch(''),
  label: z.string().default('🛫 8時間フライト、どの席に座る？').catch('🛫 8時間フライト、どの席に座る？'),
  color: z.enum(themes).default('lofi').catch('lofi'),
  statKey: z.enum(statKeyNum).nullable().default(null).catch(null),
  component: FlightSeatComponentSchema.default(FlightSeatComponentSchema.parse({})).catch(
    FlightSeatComponentSchema.parse({})
  ),
})
export type SettingsFlightSeatType = z.infer<typeof SettingsFlightSchema>
