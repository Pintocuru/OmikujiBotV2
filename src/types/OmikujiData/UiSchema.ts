// src/types/OmikujiData/UiSchema.ts
import { z } from 'zod'
import { CharacterColorScheme, DisplayOptionSchema } from './CharacterSchema'
import { normalizedObject } from './ParsedDefault'
import { fontFamilyMap, uiKindMap, UiSlotMap, uiSpecialSetMap } from '../MetaMaps'
import { SettingsBubbleSchema } from './UiSettings/SettingsBubbleSchema'
import { SettingsToastSchema } from './UiSettings/SettingsToastSchema'
import { SettingsBannerSchema } from './UiSettings/SettingsBannerSchema'
import { SettingsRankingSchema } from './UiSettings/SettingsRankingSchema'
import { SettingsCounterSchema } from './UiSettings/SettingsCounterSchema'
import { SettingsWinnerSchema } from './UiSettings/SettingsWinnerSchema'
import { SettingsFlightSchema } from './UiSettings/SettingsFlightSchema'
import { SettingsSocialSchema } from './UiSettings/SettingsSocialSchema'
import { SettingsStreamSchema as SettingsStreamSchema } from './UiSettings/SettingsLiverSchema'
import { SettingsDeadSchema } from './UiSettings/SettingsDeadSchema'
import { SettingsClockSchema } from './UiSettings/SettingsClockSchema'

/**
 * スロット定義
 */
const uiSlots = Object.keys(UiSlotMap) as UiSlotType[]
export type UiSlotType = keyof typeof UiSlotMap

/**
 * コンポーネント種類の定義
 */
const uiKinds = Object.keys(uiKindMap) as UiKind[]
export type UiKind = keyof typeof uiKindMap

/**
 * ComponentSlotで使用可能なComponentKindを取得する
 */
export function getKindsForSlot(slot: UiSlotType): UiKind[] {
  return Object.entries(uiKindMap)
    .filter(([_, config]) => (config.slots as readonly string[]).includes(slot))
    .map(([kind]) => kind as UiKind)
}

/**
 * コンポーネント条件（スロットと種類の組み合わせ）
 * kindとslotの整合性をバリデーション
 */
export const UiConditionSchema = z
  .object({
    slot: z.enum(uiSlots as [UiSlotType, ...UiSlotType[]]),
    kind: z.enum(uiKinds as [UiKind, ...UiKind[]]),
  })
  .refine((data) => (uiKindMap[data.kind].slots as readonly string[]).includes(data.slot), {
    message: 'kindとslotの組み合わせが不正です',
  })
export type UiConditionType = z.infer<typeof UiConditionSchema>

/**
 * コンポーネント条件配列（最大3つ、スロット重複不可）
 */
export const UiConditionsSchema = z
  .array(UiConditionSchema)
  .max(3)
  .refine((v) => new Set(v.map((c) => c.slot)).size === v.length, { message: 'slot は重複不可' })
export type UiConditions = z.infer<typeof UiConditionsSchema>

/**
 * SpecialSet
 */
const uiSpecialSetOptions = Object.keys(uiSpecialSetMap) as UiSpecialSetType[]
export type UiSpecialSetType = keyof typeof uiSpecialSetMap

/**
 * fontFamilyMap
 */
const fontFamilyOptions = Object.keys(fontFamilyMap) as FontFamilyType[]
export type FontFamilyType = keyof typeof fontFamilyMap
export const useFontFamily = (font: FontFamilyType) => fontFamilyMap[font].className ?? ''

/**
 * 共通スタイル設定
 */
export const UiCommonStyleSchema = z.object({
  fontFamily: z.enum(fontFamilyOptions).default('default').catch('default'),
  defaultColor: normalizedObject(CharacterColorScheme),
  defaultVoice: normalizedObject(DisplayOptionSchema),
})
export type UiCommonStyleType = z.infer<typeof UiCommonStyleSchema>

/**
 * UiSettingsSchema オブジェクトのスキーマ
 */
export const UiSettingsSchema = z.object({
  bubble: SettingsBubbleSchema.optional(),
  toast: SettingsToastSchema.optional(),
  liveClock: SettingsClockSchema.optional(),
  ranking: SettingsRankingSchema.optional(),
  counter: SettingsCounterSchema.optional(),
  winnerGroup: SettingsWinnerSchema.optional(),
  flightSeat: SettingsFlightSchema.optional(),
  socialRoster: SettingsSocialSchema.optional(),
  flashBanner: SettingsBannerSchema.optional(),
  streamCounter: SettingsStreamSchema.optional(),
  deadAir: SettingsDeadSchema.optional(),
})

export type UiSettingsType = z.infer<typeof UiSettingsSchema>

/**
 * ComponentsSchema
 */
export const UiSchema = z.object({
  conditions: UiConditionsSchema.default([
    { slot: 'primary', kind: 'bubble' },
    { slot: 'secondary', kind: 'toast' },
  ]).catch([
    { slot: 'primary', kind: 'bubble' },
    { slot: 'secondary', kind: 'toast' },
  ]),
  enableSecondary: z.boolean().default(true).catch(true), // 表示形式 を使用するか

  // スペシャルセット nullでないなら conditions より優先
  specialSet: z.enum(uiSpecialSetOptions).nullable().default(null).catch(null),

  commonStyle: UiCommonStyleSchema.default(
    UiCommonStyleSchema.parse({
      defaultVoice: { mode: 'voice' },
    })
  ).catch(UiCommonStyleSchema.parse({})),
  settings: normalizedObject(UiSettingsSchema),
})

export type UiType = z.infer<typeof UiSchema>
