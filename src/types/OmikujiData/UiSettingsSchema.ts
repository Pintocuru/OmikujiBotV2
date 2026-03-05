// src/types/OmikujiData/UiSettingsSchema.ts
import { z } from 'zod'
import { enterMotionKeys } from '@main/scripts/MotionVariants/MotionVariants'
import { DaisyUiThemeFieldsSchema, themes } from '@shared/styles/DaisyUiTheme'
import {
  counterComponentMap,
  flashComponentMap,
  flightSeatLayoutMap,
  liverComponentMap,
  liverDefaultMap,
  rankingComponentMap,
  rankingSortOrderMap,
  winnerComponentMap,
} from '../MetaMaps'
import { normalizedObject } from './ParsedDefault'
import { ScriptGameExtendedKeySchema } from './ActionSet'
import { BaseVariantLabels } from '@shared/components/parts/ItemVariantTypes'

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
  showCharacters: normalizedObject(ShowCharactersSchema),
  characterSize: z.number().default(48).catch(48), // キャラクターの横幅
  bubbleMotionEnter: z.enum(enterMotionKeys).default('slideUp').catch('slideUp'), // フキダシのアニメーション(開始・表示中)
  bubbleTextAnimate: z.boolean().default(false).catch(false), // フキダシの文字表示をアニメーションさせるか
  bubbleTextSpeed: z.number().min(10).max(200).default(50).catch(50), // 文字送りの速度
})
export type SettingsBubbleType = z.infer<typeof SettingsBubbleSchema>

/**
 * トースト・サムネイル CommentBubble
 */
export const SettingsToastSchema = z.object({
  showToastsOnRight: z.boolean().default(true).catch(true), // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsCharacter: z.boolean().default(false).catch(false), // トースト表示時、キャラクターを表示するか
  showThumbnail: z.array(z.string()).default([]).catch([]), // サムネイルとして表示したいキャラクターのkeyを並べる(新設)
})
export type SettingsToastType = z.infer<typeof SettingsToastSchema>

/**
 * ニュースフラッシュ FlashBanner
 */
const flashComponentsEnum = Object.keys(flashComponentMap) as FlashComponent[]
export type FlashComponent = keyof typeof flashComponentMap

const defaultMessage = `<<
  'チャンネル登録・高評価、お願いします！',
  '現在の視聴数 【<<viewer>>】 / 高評価 【<<upVote>>】',
  'コメントはお気軽にどうぞ！',
  '【<<commenter>>名】がコメントしてくれてます！',
  '【<<winner>>さん】もコメントありがとう！',
  '応援してくれると励みになります！',
  '高評価が配信の支えになります！',
  'コメントがあると、配信が賑やかになります！気軽にどうぞ！',
  '登録者数【<<follower>>】人 ご視聴ありがとうございます'
>>`

export const SettingsFlashBannerSchema = z.object({
  component: z.enum(flashComponentsEnum).default('standard').catch('standard'),
  label: z.string().default('速報').catch(''),
  iconSize: z.number().int().min(0).max(24).default(12).catch(12), // アイコンの表示サイズ (px)
  displaySeconds: z.number().int().min(0).max(60).nullable().default(null).catch(null), // 表示時間
  showItemOnRight: z.boolean().default(false).catch(false), // キャラクターを右側に表示するか(falseで左側)
  defaultCharacterKey: z.string().nullable().default(null).catch(null), // デフォルトキャラクター
  defaultMessage: z.string().default(defaultMessage).catch(defaultMessage), // デフォルトメッセージ(通常プレースホルダーのみ使用可)
})
export type SettingsFlashBannerType = z.infer<typeof SettingsFlashBannerSchema>

/**
 * ランキング GameRanking
 */
const rankingSortOrder = Object.keys(rankingSortOrderMap) as RankingSortOrder[]
export type RankingSortOrder = keyof typeof rankingSortOrderMap

const rankingComponentsEnum = Object.keys(rankingComponentMap) as RankingComponent[]
export type RankingComponent = keyof typeof rankingComponentMap

export const SettingsRankingSchema = z.object({
  targetScriptKeys: z.array(ScriptGameExtendedKeySchema).default(['basicList']).catch(['basicList']),
  title: z.string().default('🍉スイカランキング🍉').catch('🍉スイカランキング🍉'),
  color: z.enum(themes).default('lofi').catch('lofi'),
  limit: z.number().min(1).max(20).default(5).catch(5),
  sortOrder: z.enum(rankingSortOrder).default('new').catch('new'),
  component: z.enum(rankingComponentsEnum).default('rankStandard').catch('rankStandard'),
})
export type SettingsRankingType = z.infer<typeof SettingsRankingSchema>

/**
 * カウンター・ユーザーリスト Counter
 */
const counterComponentValues = Object.keys(counterComponentMap) as CounterComponent[]
export type CounterComponent = keyof typeof counterComponentMap

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
export type WinnerComponent = keyof typeof winnerComponentMap
const winnerComponentValues = Object.keys(winnerComponentMap) as WinnerComponent[]

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
export type SeatLayout = keyof typeof flightSeatLayoutMap

export const SettingsFlightSeatSchema = z.object({
  layout: z
    .enum(Object.keys(flightSeatLayoutMap) as [keyof typeof flightSeatLayoutMap])
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
 * ライバーカウンターv2 LiverCounter
 */

const liverComponentValues = Object.keys(liverComponentMap) as LiverComponent[]
export type LiverComponent = keyof typeof liverComponentMap

const liverDefaultKeyLabels = Object.keys(liverDefaultMap) as LiverDefaultKey[]
export type LiverDefaultKey = keyof typeof liverDefaultMap

export const SettingsLiverCounterSchema = z.object({
  component: z.enum(liverComponentValues).default('basicCircle').catch('basicCircle'), // カウンタースタイル
  color: z.enum(themes).default('lofi').catch('lofi'), // DaisyUiテーマ
  colorCycle: z
    .array(z.enum(BaseVariantLabels))
    .default(['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'])
    .catch([]), // 任意color
  defaultCounters: z.array(z.enum(liverDefaultKeyLabels)).default(['lc']).catch(['upVote']), // デフォルトカウンター（6種から選ぶ、順序なし）
  eventCounters: z.array(z.string()).max(8).default([]).catch([]), // event カウンター CommentRuleSchema.key
})
export type SettingsLiverCounterType = z.infer<typeof SettingsLiverCounterSchema>

/**
 * settings オブジェクトのスキーマ
 */
export const UiSettingsSchema = z.object({
  bubble: SettingsBubbleSchema.optional(),
  toast: SettingsToastSchema.optional(),
  ranking: SettingsRankingSchema.optional(),
  counter: SettingsCounterSchema.optional(),
  winnerGroup: SettingsWinnerGroupSchema.optional(),
  flightSeat: SettingsFlightSeatSchema.optional(),
  flashBanner: SettingsFlashBannerSchema.optional(),
  liverCounter: SettingsLiverCounterSchema.optional(),
})

export type UiSettingsType = z.infer<typeof UiSettingsSchema>
