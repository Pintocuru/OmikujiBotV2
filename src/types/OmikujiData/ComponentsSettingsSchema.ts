// src/types/OmikujiData/ComponentsSettingsSchema.ts
import { z } from 'zod'
import { motionLabel } from '@main/scripts/MotionVariants/MotionVariants'
import { DaisyUiThemeFieldsSchema, themes, ThemeSchema } from '@shared/styles/DaisyUiTheme'
import { fontFamilyOptions } from '@/types/MainGenerator/useFontFamily'
import { CharacterColorScheme } from './CharacterSchema'

/**
 * 共通スタイル設定
 */
export const ComponentsCommonStyleSchema = z.object({
  fontFamily: z.enum(fontFamilyOptions).default('default').catch('default'),
  defaultColor: CharacterColorScheme.default(CharacterColorScheme.parse({})).catch(CharacterColorScheme.parse({})),
})
export type ComponentsCommonStyle = z.infer<typeof ComponentsCommonStyleSchema>

/**
 * フキダシ・キャラクター
 */
// キャラアイコンの並び順
// キャラクターのkeyを並べる(新設) 0番地は非表示、1番から常時表示
export const ShowCharactersSchema = z.object({
  center: z.array(z.string()).default([]), // 中央上部に表示
  slot1: z.array(z.string()).default([]),
  slot2: z.array(z.string()).default([]),
  slot3: z.array(z.string()).default([]),
  slot4: z.array(z.string()).default([]),
})
export type ShowCharacters = z.infer<typeof ShowCharactersSchema>

export const SettingsBubbleSchema = z.object({
  showCharacters: ShowCharactersSchema.default(ShowCharactersSchema.parse({})).catch(ShowCharactersSchema.parse({})),
  characterSize: z.number().default(48).catch(48), // キャラクターの横幅
  bubbleMotionEnter: z.enum(motionLabel).default('slideUp').catch('slideUp'), // フキダシのアニメーション(開始・表示中)
  bubbleTextAnimate: z.boolean().default(false).catch(false), // フキダシの文字表示をアニメーションさせるか
  bubbleTextSpeed: z.number().min(10).max(200).default(50).catch(50), // 文字送りの速度
})
export type SettingsBubbleType = z.infer<typeof SettingsBubbleSchema>

/**
 * トースト・サムネイル
 */
export const SettingsToastSchema = z.object({
  showToastsOnRight: z.boolean().default(true).catch(true), // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsCharacter: z.boolean().default(false).catch(false), // トースト表示時、キャラクターを表示するか
  showThumbnail: z.array(z.string()).default([]).catch([]), // サムネイルとして表示したいキャラクターのkeyを並べる(新設)
})
export type SettingsToastType = z.infer<typeof SettingsToastSchema>

/**
 * ニュースフラッシュ
 */
export const SettingsFlashBannerSchema = z.object({
  iconSize: z.number().int().min(0).max(32).default(16).catch(16), // アイコンの表示サイズ (px)
  showCharacterOnRight: z.boolean().default(false).catch(false), // キャラクターを右側に表示するか(falseで左側)
  defaultCharacterKey: z.string().nullable().default(null).catch(null), // デフォルトキャラクター
  defaultMessage: z.string().default('').catch(''), // デフォルトメッセージ(通常プレースホルダーのみ使用可)
})
export type SettingsFlashBannerType = z.infer<typeof SettingsFlashBannerSchema>

/**
 * ランキング Ranking
 */
export const rankingSortOrderLabels = {
  new: '新着順',
  high: 'スコア高い順',
  low: 'スコア低い順',
} as const
export const RankingSortOrderSchema = z.enum(
  Object.keys(rankingSortOrderLabels) as [RankingSortOrder, ...RankingSortOrder[]]
)
export type RankingSortOrder = keyof typeof rankingSortOrderLabels

// 現在は１つだけ…
export const rankingComponents = [{ value: 'rankStandard', label: 'カウンター+最後のユーザー' }] as const

export type RankingComponent = (typeof rankingComponents)[number]['value']
export const rankingValues = rankingComponents.map((c) => c.value) as RankingComponent[]

export const SettingsRankingSchema = z.object({
  targetScriptKeys: z.array(z.string()).default(['basicList']).catch(['basicList']),
  title: z.string().default('🍉スイカランキング🍉').catch('🍉スイカランキング🍉'),
  color: z.enum(themes).default('lofi').catch('lofi'),
  limit: z.number().min(1).max(20).default(5).catch(5),
  sortOrder: RankingSortOrderSchema.default('new').catch('new'),
  component: z.enum(rankingValues).default('rankStandard').catch('rankStandard'),
})
export type SettingsRankingType = z.infer<typeof SettingsRankingSchema>

/**
 * カウンター・ユーザーリスト Counter
 */
export const counterComponents = {
  counterUser: 'カウンター+最後のユーザー',
  counterTimer: '最後のユーザーからの経過時間',
  userList: 'ユーザーリスト(バッジ)',
  UserCardScroller: 'ユーザーリスト(縦型)',
} as const

export type CounterComponent = keyof typeof counterComponents
const counterComponentValues = Object.keys(counterComponents) as CounterComponent[]

export const SettingsCounterSchema = z.object({
  component: z.enum(counterComponentValues).default('counterUser').catch('counterUser'),
  ruleKey: z.string().default('').catch(''), // どのruleを対象にするか
  target: z.enum(['draw', 'user']).default('draw').catch('draw'), // 対象は回数かユーザー数か
  label: z.string().default('Counter').catch('Counter'), // カウンターのラベル
  color: DaisyUiThemeFieldsSchema.catch(DaisyUiThemeFieldsSchema.parse({})), // DaisyUIテーマカラー
})
export type SettingsCounterType = z.infer<typeof SettingsCounterSchema>

/**
 * ラッキーメンバーズ WinnerGroup
 */
export const winnerComponents = {
  valentineCoupling: 'バレンタイン・カップリング',
  topStars: 'トップスターズ',
} as const

export type WinnerComponent = keyof typeof winnerComponents
const winnerComponentValues = Object.keys(winnerComponents) as WinnerComponent[]

export const SettingsWinnerGroupSchema = z.object({
  component: z.enum(winnerComponentValues).default('valentineCoupling').catch('valentineCoupling'),
  ruleKey: z.string().default('').catch(''), // どのruleを対象にするか
  label: z.string().default('ラッキーメンバーズ').catch('ラッキーメンバーズ'), // ラベル
  color: z.enum(themes).default('lofi').catch('lofi'), // DaisyUIテーマカラー
  queryString: z.string().default('count=2&label=今日のラッキーさん').catch('count=2&label=今日のラッキーさん'), // クリックで実行するクエリ文字列
})
export type SettingsWinnerGroupType = z.infer<typeof SettingsWinnerGroupSchema>

/**
 * 8時間フライト flightSeat
 */
export const flightSeatLayouts = {
  square: '正方形グリッド',
  circle: 'サークル',
  custom: 'カスタム配列', // ピラミッド・ひな壇などを含む
} as const
export type SeatLayout = keyof typeof flightSeatLayouts

export const SettingsFlightSeatSchema = z.object({
  slotType: z.literal('extra').default('extra').catch('extra'),

  layout: z
    .enum(Object.keys(flightSeatLayouts) as [keyof typeof flightSeatLayouts])
    .default('square')
    .catch('square'),

  // square の場合: 縦×横
  rows: z.number().min(1).max(10).default(4).catch(4), // 縦（行数）
  cols: z.number().min(1).max(15).default(6).catch(6), // 横（列数）

  // circle専用
  circleSeats: z.number().min(3).max(30).default(12).optional(),

  // custom専用: 各行の座席数を配列で指定
  customLayout: z.string().default('[1,2,3,4,5]').catch('[1,2,3,4,5]').optional(),

  label: z.string().default('🛫 8時間フライト、どの席に座る？').catch('🛫 8時間フライト、どの席に座る？'),
  color: z.enum(themes).default('lofi').catch('lofi'),

  // 過去の座席に乗っていたユーザーでも、空席があれば再度座れるようにするか
  allowReseating: z.boolean().default(true).catch(true),
  // 履歴保存数
  historyLimit: z.number().min(0).max(20).default(10).catch(10),
})

export type SettingsFlightSeatType = z.infer<typeof SettingsFlightSeatSchema>

/**
 * settings オブジェクトのスキーマ
 */
export const ComponentsSettingsSchema = z.object({
  bubble: SettingsBubbleSchema.optional(),
  toast: SettingsToastSchema.optional(),
  ranking: SettingsRankingSchema.optional(),
  counter: SettingsCounterSchema.optional(),
  winnerGroup: SettingsWinnerGroupSchema.optional(),
  flightSeat: SettingsFlightSeatSchema.optional(),
  flashBanner: SettingsFlashBannerSchema.optional(),
})

export type ComponentsSettings = z.infer<typeof ComponentsSettingsSchema>
