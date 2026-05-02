// src/types/OmikujiData/UiSchema.ts
import { z } from 'zod'
import { CharacterColorScheme, DisplayOptionSchema } from './CharacterSchema'
import { normalizedObject } from './ParsedDefault'
import { fontFamilyMap, uiKindMap, UiSlotMap, uiSpecialSetMap } from '../MetaMaps'
import { CommentBubbleSchema } from './UiSettings/CommentBubbleSchema'
import { ToastWidgetsSchema } from './UiSettings/ToastWidgetsSchema'
import { FlashBannerSchema } from './UiSettings/FlashBannerSchema'
import { CommentSpinSchema } from './UiSettings/CommentSpinSchema'
import { GameRankingSchema } from './UiSettings/GameRankingSchema'
import { CounterPreviewSchema } from './UiSettings/CounterPreviewSchema'
import { WinnerGroupSchema } from './UiSettings/WinnerGroupSchema'
import { FlightSeatSchema } from './UiSettings/FlightSeatSchema'
import { SocialRosterSchema } from './UiSettings/SocialRosterSchema'
import { StreamCounterSchema } from './UiSettings/StreamCounterSchema'
import { DeadAirSchema } from './UiSettings/DeadAirSchema'
import { LiveClockSchema } from './UiSettings/LiveClockSchema'
import { CookieCounterSchema } from './UiSettings/CookieCounterSchema'
import { KujibikiPanelSchema } from './UiSettings/KujibikiPanelSchema'

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

/** 読み込み済みフォントのキャッシュ（セッション中に重複挿入しない） */
const _loadedFonts = new Set<string>()

/**
 * フォントクラス名を返す。
 * googleFontsUrl が設定されている場合、未読み込みなら <link> を動的挿入する。
 */
export const useFontFamily = (font: FontFamilyType): string => {
  const entry = fontFamilyMap[font] ?? fontFamilyMap.default
  if (entry.googleFontsUrl && !_loadedFonts.has(font)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = entry.googleFontsUrl
    document.head.appendChild(link)
    _loadedFonts.add(font)
  }
  return entry.className ?? ''
}

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
export const settingsSchemaMap = {
  bubble: CommentBubbleSchema,
  toast: ToastWidgetsSchema,
  liveClock: LiveClockSchema,
  ranking: GameRankingSchema,
  counter: CounterPreviewSchema,
  winnerGroup: WinnerGroupSchema,
  flightSeat: FlightSeatSchema,
  socialRoster: SocialRosterSchema,
  flashBanner: FlashBannerSchema,
  commentSpin: CommentSpinSchema,
  streamCounter: StreamCounterSchema,
  cookieCounter: CookieCounterSchema,
  deadAir: DeadAirSchema,
  kujibikiPanel: KujibikiPanelSchema,
} satisfies Record<UiKind, z.ZodTypeAny>

export const UiSettingsSchema = z.object({
  bubble: CommentBubbleSchema.optional(),
  toast: ToastWidgetsSchema.optional(),
  liveClock: LiveClockSchema.optional(),
  ranking: GameRankingSchema.optional(),
  counter: CounterPreviewSchema.optional(),
  winnerGroup: WinnerGroupSchema.optional(),
  flightSeat: FlightSeatSchema.optional(),
  socialRoster: SocialRosterSchema.optional(),
  flashBanner: FlashBannerSchema.optional(),
  commentSpin: CommentSpinSchema.optional(),
  streamCounter: StreamCounterSchema.optional(),
  cookieCounter: CookieCounterSchema.optional(),
  deadAir: DeadAirSchema.optional(),
  kujibikiPanel: KujibikiPanelSchema.optional(),
} satisfies Record<UiKind, z.ZodTypeAny>)

export type UiSettingsType = z.infer<typeof UiSettingsSchema>

/**
 * ComponentsSchema
 */
export const UiSchema = z.object({
  conditions: UiConditionsSchema.default([]).catch([]),
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
