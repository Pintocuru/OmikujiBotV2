// src\types\OmikujiData\ComponentsSchema.ts
import { z } from 'zod'
import { motionLabel } from '@main/scripts/MotionVariants/MotionVariants'
import { DaisyUiThemeFieldsSchema, themes } from '@shared/styles/DaisyUiTheme'
import { fontFamilyOptions } from '@/types/MainGenerator/useFontFamily'
import { CharacterColorScheme } from './CharacterSchema'

/**
 * v2.1: スロット定義
 */
export const ComponentSlotSchema = z.enum(['primary', 'secondary', 'extra'])
export type ComponentSlot = z.infer<typeof ComponentSlotSchema>

/**
 * v2.1: コンポーネント種類
 */
export const ComponentKindSchema = z.enum([
  'bubble',
  'toast',
  'ranking',
  'counter',
  // future...
])
export type ComponentKind = z.infer<typeof ComponentKindSchema>

/**
 * v2.1: 共通スタイル設定
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
export const ShowCharactersSchema = z.object({
  center: z.array(z.string()).default([]), // 中央上部に表示
  slot1: z.array(z.string()).default([]),
  slot2: z.array(z.string()).default([]),
  slot3: z.array(z.string()).default([]),
  slot4: z.array(z.string()).default([]),
})
export type ShowCharacters = z.infer<typeof ShowCharactersSchema>

export const SettingsBubbleSchema = z.object({
  slotType: z.literal('primary').default('primary').catch('primary'), // v2.1で追加

  // キャラクターのkeyを並べる(新設) 0番地は非表示、1番から常時表示
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
  slotType: z.literal('secondary').default('secondary').catch('secondary'), // v2.1で追加

  showToastsOnRight: z.boolean().default(true).catch(true), // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsCharacter: z.boolean().default(false).catch(false), // トースト表示時、キャラクターを表示するか
  showThumbnail: z.array(z.string()).default([]).catch([]), // サムネイルとして表示したいキャラクターのkeyを並べる(新設)
})
export type SettingsToastType = z.infer<typeof SettingsToastSchema>

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
  slotType: z.literal('extra').default('extra').catch('extra'), // v2.1で追加
  
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
export const componentValues = Object.keys(counterComponents) as CounterComponent[]

export const SettingsCounterSchema = z.object({
  slotType: z.literal('extra').default('extra').catch('extra'), // v2.1で追加
  
  ruleKey: z.string().min(1).nullable().default(null).catch(null), // どのruleを対象にするか
  component: z.enum(componentValues).default('counterUser').catch('counterUser'),
  target: z.enum(['draw', 'user']).default('draw').catch('draw'), // 対象は回数かユーザー数か
  label: z.string().default('Counter').catch('Counter'), // カウンターのラベル
  color: DaisyUiThemeFieldsSchema.catch(DaisyUiThemeFieldsSchema.parse({})), // DaisyUIテーマカラー
})
export type SettingsCounterType = z.infer<typeof SettingsCounterSchema>

/**
 * v2.1: コンポーネント条件（スロットと種類の組み合わせ）
 */
export const ComponentsConditionSchema = z.object({
  slot: ComponentSlotSchema,
  kind: ComponentKindSchema,
})
export type ComponentsCondition = z.infer<typeof ComponentsConditionSchema>

/**
 * v2.1: コンポーネント条件配列（最大3つ、スロット重複不可）
 */
export const ComponentsConditionsSchema = z
  .array(ComponentsConditionSchema)
  .max(3)
  .refine(
    (v) => new Set(v.map((c) => c.slot)).size === v.length,
    { message: 'slot は重複不可' }
  )
export type ComponentsConditions = z.infer<typeof ComponentsConditionsSchema>

/**
 * v2.1: settings オブジェクトのスキーマ
 */
export const ComponentsSettingsSchema = z.object({
  bubble: SettingsBubbleSchema.default(SettingsBubbleSchema.parse({})).catch(SettingsBubbleSchema.parse({})),
  toast: SettingsToastSchema.default(SettingsToastSchema.parse({})).catch(SettingsToastSchema.parse({})),
  ranking: SettingsRankingSchema.default(SettingsRankingSchema.parse({})).catch(SettingsRankingSchema.parse({})),
  counter: SettingsCounterSchema.default(SettingsCounterSchema.parse({})).catch(SettingsCounterSchema.parse({})),
})
export type ComponentsSettings = z.infer<typeof ComponentsSettingsSchema>

/**
 * v2.1: ComponentsSchema
 */
export const ComponentsSchema = z.object({
  conditions: ComponentsConditionsSchema.default([
    { slot: 'primary', kind: 'bubble' },
    { slot: 'secondary', kind: 'toast' },
  ]).catch([
    { slot: 'primary', kind: 'bubble' },
    { slot: 'secondary', kind: 'toast' },
  ]),

  commonStyle: ComponentsCommonStyleSchema
    .default(ComponentsCommonStyleSchema.parse({}))
    .catch(ComponentsCommonStyleSchema.parse({})),

  settings: ComponentsSettingsSchema
    .default(ComponentsSettingsSchema.parse({}))
    .catch(ComponentsSettingsSchema.parse({})),
})

export type ComponentsType = z.infer<typeof ComponentsSchema>

/**
 * 旧版との互換性のため残す（非推奨）
 */
export const componentLabels = {
  bubble: 'フキダシ',
  toast: 'トースト',
  ranking: 'ランキング',
  counter: 'カウンター',
} as const
export type SettingsComponentsCondition = keyof typeof componentLabels