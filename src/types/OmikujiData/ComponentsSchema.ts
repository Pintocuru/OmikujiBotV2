// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\types\OmikujiData\ComponentsSchema.ts
import { z } from 'zod'
import { AccessLevelSchema } from '@shared/types/'
import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
import { DaisyUiThemeFieldsSchema, themes } from '@shared/styles/DaisyUiTheme'
import { fontFamilyOptions } from '@/types/BotComponents/useFontFamily'
import { CharacterColorScheme } from './CharacterSchema'

// フキダシ・キャラクター
export const SettingsBubbleSchema = z.object({
  // キャラクターのkeyを並べる(新設) 0番地は非表示、1番から常時表示
  showCharacters: z.array(z.array(z.string())).default([[], []]).catch([[], []]),
  defaultColor: CharacterColorScheme.catch(CharacterColorScheme.parse({})),
  characterSize: z.number().default(48).catch(48), // キャラクターの横幅(新設)
  fontFamily: z.enum(fontFamilyOptions).default('default').catch('default'),
  bubbleMotionEnter: z.enum(motionLabel).default('slideUp'), // フキダシのアニメーション(開始・表示中)
  bubbleTextAnimate: z.boolean().default(false).catch(false), // フキダシの文字表示をアニメーションさせるか
  bubbleTextSpeed: z.number().min(10).max(200).default(50).catch(50), // 文字送りの速度
})

export type SettingsBubbleType = z.infer<typeof SettingsBubbleSchema>

// トースト・サムネイル
export const SettingsToastSchema = z.object({
  defaultColor: CharacterColorScheme.catch(CharacterColorScheme.parse({})),
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

// ランキング Ranking
export const SettingsRankingSchema = z.object({
  scriptKey: z.string().default('basicList').catch('basicList'),
  title: z.string().default('🍉スイカランキング🍉').catch('🍉スイカランキング🍉'),
  limit: z.number().min(1).max(20).default(5).catch(5),
  sortOrder: z.enum(rankingSortOrders).default('new').catch('new'),
  color: z.enum(themes).default('lofi').catch('lofi'),
})

export type SettingsRankingType = z.infer<typeof SettingsRankingSchema>

// カウンター・ユーザーリスト Counter
// idを指定することで、稼働した回数や、稼働させたユーザー数、ユーザーリストが出せる
export const SettingsCounterSchema = z.object({
  ruleKey: z.string().min(1).nullable().default(null).catch(null), // どのruleを対象にするか
  target: z.enum(['draw', 'user']).default('draw').catch('draw'), // 対象は回数かユーザー数か
  label: z.string().default('Counter').catch('Counter'), // カウンターのラベル
  showCounter: z.boolean().default(true).catch(true), // カウンターを表示するか
  firstValue: z.number().default(0).catch(0), // 初期値（開始値）
  isDirectionUp: z.boolean().default(true).catch(true), // true=カウントアップ, false=カウントダウン
  maxUsers: z.number().min(0).max(300).default(0).catch(0), // ユーザーリスト表示数
  color: DaisyUiThemeFieldsSchema.catch(DaisyUiThemeFieldsSchema.parse({})), // DaisyUIテーマカラー
})

export type SettingsCounterType = z.infer<typeof SettingsCounterSchema>

// コンポーネント設定
export const settingsComponentsCondition = ['bubble', 'toast', 'ranking', 'counter'] as const
export type SettingsComponentsCondition = (typeof settingsComponentsCondition)[number]

// コンポーネント名のマッピング
export const componentLabels: Record<SettingsComponentsCondition, string> = {
  bubble: '💬 フキダシコンポーネント',
  toast: '🍞 トーストコンポーネント',
  ranking: '🏆 ランキングコンポーネント',
  counter: '🔢 カウンターコンポーネント',
}

export const settingsComponentsConditionSchema = z.enum(settingsComponentsCondition).default('bubble').catch('bubble')

export const SettingsComponentsSchema = z.object({
  conditions: z.array(settingsComponentsConditionSchema).catch(['bubble', 'toast']),
  bubble: SettingsBubbleSchema.catch(SettingsBubbleSchema.parse({})),
  toast: SettingsToastSchema.catch(SettingsToastSchema.parse({})),
  ranking: SettingsRankingSchema.catch(SettingsRankingSchema.parse({})),
  counter: SettingsCounterSchema.catch(SettingsCounterSchema.parse({})),
})

// エディター
// DisplaySettingsSchema.editor として再定義
export const SettingsEditorSchema = z.object({
  licenseKeyHash: z.string().default('').catch(''),
  daisyUiTheme: z.enum(themes).default('dark'),
})

// 更新されたvisibilityスキーマ
const visibilitySchema = z.object({
  // 基本コンポーネント
  comments: AccessLevelSchema.default('basic').catch('basic'), // comments
  timers: AccessLevelSchema.default('basic').catch('basic'), // timers
  actionSets: AccessLevelSchema.default('basic').catch('basic'), // actionSets
  placeholders: AccessLevelSchema.default('basic').catch('basic'), // placeholders
  characters: AccessLevelSchema.default('basic').catch('basic'), // characters
  // コンポーネントの特定の箇所
  characterVisible: AccessLevelSchema.default('basic').catch('basic'),
  licenseVisible: AccessLevelSchema.default('basic').catch('basic'),
  // ゲームスクリプト
  gameScripts: z.array(z.string()).default([]).catch([]), //
  // ツール系
  jsonMergeSettings: AccessLevelSchema.default('basic').catch('basic'),
})
export const visibilityKeys = [
  'jsonMergeSettings',
  'comments',
  'timers',
  'actionSets',
  'placeholders',
  'characters',
  'characterVisible',
  'licenseVisible',
  'gameScripts',
] as const

export type VisibilityKey = (typeof visibilityKeys)[number]

/*
 * DeveloperSettingsSchema
 */
export const DeveloperSettingsSchema = z.object({
  // 各表示・非表示機能
  visibility: visibilitySchema.catch(visibilitySchema.parse({})),
})

// DisplaySettingsSchema
// BOTの表示部分に関わる設定
export const DisplaySettingsSchema = z.object({
  components: SettingsComponentsSchema.catch(SettingsComponentsSchema.parse({})),
  editor: SettingsEditorSchema.catch(SettingsEditorSchema.parse({})),
  developer: DeveloperSettingsSchema.catch(DeveloperSettingsSchema.parse({})),
})

export type DisplaySettingsType = z.infer<typeof DisplaySettingsSchema>
