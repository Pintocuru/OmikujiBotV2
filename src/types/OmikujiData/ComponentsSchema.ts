// src\types\OmikujiData\ComponentsSchema.ts
import { z } from 'zod'
import { motionLabel } from '@main/scripts/MotionVariants/MotionVariants'
import { DaisyUiThemeFieldsSchema, themes } from '@shared/styles/DaisyUiTheme'
import { fontFamilyOptions } from '@/types/MainGenerator/useFontFamily'
import { CharacterColorScheme } from './CharacterSchema'

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
  // キャラクターのkeyを並べる(新設) 0番地は非表示、1番から常時表示
  showCharacters: ShowCharactersSchema.default(ShowCharactersSchema.parse({})).catch(ShowCharactersSchema.parse({})),
  defaultColor: CharacterColorScheme.default(CharacterColorScheme.parse({ isTheme: true })).catch(
    CharacterColorScheme.parse({ isTheme: true })
  ),
  characterSize: z.number().default(48).catch(48), // キャラクターの横幅(新設)
  fontFamily: z.enum(fontFamilyOptions).default('default').catch('default'),
  bubbleMotionEnter: z.enum(motionLabel).default('slideUp'), // フキダシのアニメーション(開始・表示中)
  bubbleTextAnimate: z.boolean().default(false).catch(false), // フキダシの文字表示をアニメーションさせるか
  bubbleTextSpeed: z.number().min(10).max(200).default(50).catch(50), // 文字送りの速度
})
export type SettingsBubbleType = z.infer<typeof SettingsBubbleSchema>

/**
 * トースト・サムネイル
 */
export const SettingsToastSchema = z.object({
  defaultColor: CharacterColorScheme.default(CharacterColorScheme.parse({ isTheme: true })).catch(
    CharacterColorScheme.parse({ isTheme: true })
  ),
  showToastsOnRight: z.boolean().default(true).catch(true), // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsCharacter: z.boolean().default(false).catch(false), // トースト表示時、キャラクターを表示するか
  showThumbnail: z.array(z.string()).default([]).catch([]), // サムネイルとして表示したいキャラクターのkeyを並べる(新設)
})
export type SettingsToastType = z.infer<typeof SettingsToastSchema>

// ソート方法の列挙型
export const rankingSortOrders = ['new', 'high', 'low'] as const
export type RankingSortOrder = (typeof rankingSortOrders)[number]

export const rankingSortOrderLabels: Record<RankingSortOrder, string> = {
  new: '新着順',
  high: 'スコア高い順',
  low: 'スコア低い順',
}

/**
 * ランキング Ranking
 */
export const SettingsRankingSchema = z.object({
  targetScriptKeys: z.array(z.string()).default(['basicList']).catch(['basicList']),
  title: z.string().default('🍉スイカランキング🍉').catch('🍉スイカランキング🍉'),
  limit: z.number().min(1).max(20).default(5).catch(5),
  sortOrder: z.enum(rankingSortOrders).default('new').catch('new'),
  color: z.enum(themes).default('lofi').catch('lofi'),
})
export type SettingsRankingType = z.infer<typeof SettingsRankingSchema>

/**
 * カウンター・ユーザーリスト Counter
 */
// idを指定することで、稼働した回数や、稼働させたユーザー数、ユーザーリストが出せる
export const SettingsCounterSchema = z.object({
  ruleKey: z.string().min(1).nullable().default(null).catch(null), // どのruleを対象にするか
  target: z.enum(['draw', 'user']).default('draw').catch('draw'), // 対象は回数かユーザー数か
  label: z.string().default('Counter').catch('Counter'), // カウンターのラベル
  showCounter: z.boolean().default(true).catch(true), // カウンターを表示するか
  limitUserCount: z.number().min(0).nullable().default(null), // 表示するユーザー数の上限
  color: DaisyUiThemeFieldsSchema.catch(DaisyUiThemeFieldsSchema.parse({})), // DaisyUIテーマカラー
})
export type SettingsCounterType = z.infer<typeof SettingsCounterSchema>

/**
 * アイテム設定
 */
export const settingsComponentsCondition = ['bubble', 'toast', 'ranking', 'counter'] as const
export type SettingsComponentsCondition = (typeof settingsComponentsCondition)[number]

// アイテム名のマッピング
export const componentLabels: Record<SettingsComponentsCondition, string> = {
  bubble: 'フキダシ',
  toast: 'トースト',
  ranking: 'ランキング',
  counter: 'カウンター',
}
export const ComponentsConditionSchema = z.enum(settingsComponentsCondition)

/**
 * ComponentsSchema
 */
export const ComponentsSchema = z.object({
  conditions: z.array(ComponentsConditionSchema).catch(['bubble', 'toast']),
  bubble: SettingsBubbleSchema.catch(SettingsBubbleSchema.parse({})),
  toast: SettingsToastSchema.catch(SettingsToastSchema.parse({})),
  ranking: SettingsRankingSchema.catch(SettingsRankingSchema.parse({})),
  counter: SettingsCounterSchema.catch(SettingsCounterSchema.parse({})),
})

export type ComponentsType = z.infer<typeof ComponentsSchema>
