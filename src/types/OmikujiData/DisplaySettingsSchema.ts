// src/types/DisplaySettingsSchema.ts
import { z } from 'zod'
import { AccessLevelSchema } from '@shared/types/'
import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
import { themes } from '@shared/styles/DaisyUiTheme'
import { fontFamilyOptions } from '@/types/BotComponents/useFontFamily'

// ジェネレーター全体設定
export const SettingsGlobalSchema = z.object({
  fontFamily: z.enum(fontFamilyOptions).default('default').catch('default'),
})

// フキダシ・キャラクター
export const SettingsBubbleSchema = z.object({
  showCharacters: z.array(z.array(z.string())).default([]).catch([]), // キャラクターのkeyを並べる(新設)
  showCharacterFrame: z.boolean().default(true), // キャラクターにフレーム（円形の背景）を表示するか
  characterSize: z.number().default(320).catch(320), // キャラクターの横幅(新設)
  bubbleMotionEnter: z.enum(motionLabel).default('slideUp'), // フキダシのアニメーション(開始・表示中)
  bubbleMotionLeave: z.enum(motionLabel).default('slideUp'), // フキダシのアニメーション(終了時)
  bubbleTextAnimate: z.boolean().default(false).catch(false), // フキダシの文字表示をアニメーションさせるか
  bubbleTextSpeed: z.number().min(10).max(200).default(50).catch(50), // 文字送りの速度
  bubbleTextSound: z.string().optional(), // 文字送り時のサウンド
})

export type SettingsBubbleType = z.infer<typeof SettingsBubbleSchema>

// トースト・サムネイル
export const SettingsToastSchema = z.object({
  showToastsOnRight: z.boolean().default(true).catch(true), // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsCharacter: z.boolean().default(false).catch(false), // トースト表示時、キャラクターを表示するか
  showThumbnail: z.array(z.string()).default([]).catch([]), // サムネイルとして表示したいキャラクターのkeyを並べる(新設)
})
export type SettingsToastType = z.infer<typeof SettingsToastSchema>

// ランキング Ranking
export const SettingsRankingSchema = z.object({
  scriptKey: z.string().min(1).nullable().default(null).catch(null), // 対象のGameScript TODO:配列にする(スイカゲーム・カボチャゲームで得点を並べたいので)
  title: z.string().default('Ranking').catch('Ranking'), // タイトル
  limit: z.number().default(10).catch(10), // 表示するランキング数
  showScore: z.boolean().default(true).catch(true), // スコア表示
  showRankNumber: z.boolean().default(true).catch(true), // 順位の表示
  color: z.enum(themes).default('dark').catch('dark'), // テーマカラー(DaisyUi)
})

// カウンター Counter
// idを指定することで、稼働した回数や、稼働させたユーザー数、ユーザーリストが出せる
export const SettingsCounterSchema = z.object({
  ruleKey: z.string().min(1).nullable().default(null).catch(null), // どのruleを対象にするか
  target: z.enum(['runCount', 'userCount', 'userName']).default('runCount').catch('runCount'),
  label: z.string().default('Counter').catch('Counter'), // カウンターのラベル
  firstValue: z.number().default(0).catch(0), // 初期値（開始値）
  isDirectionUp: z.boolean().default(true).catch(true), // true=カウントアップ, false=カウントダウン
  color: z.enum(themes).default('dark').catch('dark'), // DaisyUIテーマカラー
  showLabel: z.boolean().default(true).catch(true), // ラベルを表示するか
})

//

export const settingsComponentsCondition = ['bubble', 'toast', 'ranking', 'counter'] as const
export type SettingsComponentsCondition = (typeof settingsComponentsCondition)[number]

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
  //wordPartyLoading: AccessLevelSchema.default('internal').catch('internal'),
  licenseVisible: AccessLevelSchema.default('basic').catch('basic'),
  // ゲームスクリプト
  //gameScriptSettings: AccessLevelSchema.default('basic').catch('basic'),
  gameScripts: z.array(z.string()).default([]).catch([]), //
  // ツール系
  //wordPartySettings: AccessLevelSchema.default('basic').catch('basic'),
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
  //'wordPartyLoading',
  'licenseVisible',
  //  'gameScriptSettings',
  //  'wordPartySettings',
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
  global: SettingsGlobalSchema.catch(SettingsGlobalSchema.parse({})),
  components: SettingsComponentsSchema.catch(SettingsComponentsSchema.parse({})),
  editor: SettingsEditorSchema.catch(SettingsEditorSchema.parse({})),
  developer: DeveloperSettingsSchema.catch(DeveloperSettingsSchema.parse({})),
})

export type DisplaySettingsType = z.infer<typeof DisplaySettingsSchema>

/**

// フキダシ・キャラクター
export const SettingsBubbleSchema = z.object({
  showCharacters: z.array(z.array(z.string())).default([]).catch([]),  // キャラクターのkeyを並べる(新設)
  showCharacterFrame: z.boolean().default(true),    // キャラクターにフレーム（円形の背景）を表示するか
  characterSize: z.number.default(320).catch(320), // キャラクターの横幅(新設)

  fontFamily: z.enum(fontFamilyOptions).default('default'),  // フォントファミリー
  bubbleMotionEnter: z.enum(motionLabel).default('slideUp'),  // フキダシのアニメーション(開始・表示中)
  bubbleMotionLeave: z.enum(motionLabel).default('slideUp'),  // フキダシのアニメーション(終了時)
  bubbleTextAnimate: z.boolean().default(false).catch(false),  // フキダシの文字表示をアニメーションさせるか
  bubbleTextSpeed: z.number().min(10).max(200).default(50).catch(50),  // 文字送りの速度
  bubbleTextSound:z.string().optional(), // 文字送り時のサウンド
});

// トースト
export const SettingsToastSchema = z.object({
  showToastsOnRight: z.boolean().default(true).catch(true),  // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsCharacter: z.boolean().default(false).catch(false),  // トースト表示時、キャラクターを表示するか
});

// サムネイル Thumbnail
export const SettingsThumbnailSchema = z.object({
  // サムネイルとして表示したいキャラクターのkeyを並べる(新設)
  showThumbnail:  z.array(z.string()).default([]).catch([]),
});

// ランキング Ranking
export const SettingsRankingSchema = z.object({
  scriptId: z
    .string()
    .min(1)
    .nullable()
    .default(null)
    .catch(null), // 対象のGameScript TODO:配列にする(スイカゲーム・カボチャゲームで得点を並べたいので)
  title: z.string().default('Ranking').catch('Ranking'), // タイトル
  limit: z.number().default(10).catch(10), // 表示するランキング数
  showScore: z.boolean().default(true).catch(true),
  showRankNumber: z.boolean().default(true).catch(true),
  color: z.enum(themes).default('dark').catch('dark'),
});

// カウンター Counter
// idを指定することで、稼働した回数や、稼働させたユーザー数、ユーザーリストが出せる
export const SettingsCounterSchema = z.object({
  id: : z
    .string()
    .min(1)
    .nullable()
    .default(null)
    .catch(null),                        // コンポーネント識別子
    target: z.enum(['runCount','userCount','userName']).default('runCount').catch('runCount'),
  label: z.string().default('Counter'),         // カウンターのラベル
  value: z.number().default(0).catch(0),        // 現在のカウント値
  color: z.enum(themes).default('primary'),     // DaisyUIテーマカラー
  showLabel: z.boolean().default(true).catch(true), // ラベルを表示するか
})


// BaseSettingsSchema -> OmikujiBotSettingsとして再定義
export const SettingsComponentsSchema = z.object({
  bubble: SettingsBubbleSchema,
  toast: SettingsToastSchema,
  thumbnail: SettingsThumbnailSchema,
  ranking:SettingsRankingSchema,
  counter:SettingsCounterSchema,
});

// エディター
// DisplaySettingsSchema.editor として再定義
export const SettingsEditorSchema = z.object({
  licenseKeyHash: z.string().default('').catch(''),
  daisyUiTheme: z.enum(themes).default('dark'),
});


export const DisplaySettingsSchema = z.object({
  components:SettingsComponentsSchema,
  editor:SettingsEditorSchema,
  developer: DeveloperSettingsSchema.catch(DeveloperSettingsSchema.parse({})),
})

 */

/**



// BaseSettingsSchema
// 通常の表示設定(おみくじBOT、ゲームスクリプトの両方に影響する設定)
export const BaseSettingsSchema = z.object({

   * フキダシ設定 commentBubble
  // 表示サイズ
  displaySize: z.enum(displaySize).default('md').catch('md'),
  // フォントファミリー
  fontFamily: z.enum(fontFamilyOptions).default('default').catch('default'),
  // フキダシのアニメーション(開始・表示中)
  bubbleMotionEnter: z.enum(motionLabel).default('slideUp').catch('slideUp'),
  // フキダシのアニメーション(終了時)
  bubbleMotionLeave: z.enum(motionLabel).default('slideUp').catch('slideUp'),
  // フキダシの文字表示をアニメーションさせるか
  bubbleTextAnimate: z.boolean().default(false).catch(false),
  // 文字送りの速度
  // 10-200 までで、Sliderを使って調整
  bubbleTextSpeed: z.number().min(10).max(200).default(50).catch(50),

   * トースト設定 toastBubble
  // トースト表示
  showToasts: z.boolean().default(true).catch(true),
  // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsOnRight: z.boolean().default(true).catch(true),
  // トースト表示時、キャラクターを表示するか
  showToastsCharacter: z.boolean().default(false).catch(false),
  // キャラクターサムネイルを表示するか
  // TODO:showCharacterThumbnail -> showThumbnail に移行
  showCharacterThumbnail: z.boolean().default(true).catch(true),

   * キャラクター設定 showCharacter

  // キャラクターにフレーム（円形の背景）を表示するか
  showCharacterFrame: z.boolean().default(true).catch(true),
  // キャラクターを常時表示するか（コメント消失後も表示継続）
  showCharacterPersistent: z.boolean().default(false).catch(false),
  // キャラクター統合モード / 常時表示時やサムネイルは、Character のorder1のみを表示させる
  bundleCharacters: z.boolean().default(false).catch(false),

   * エディター設定
  // DaisyUiのテーマカラー
  daisyUiTheme: z.enum(themes).default('dark').catch('dark'),
})

// DisplaySettingsSchema
// BOTの表示部分に関わる設定
export const DisplaySettingsSchema = z.object({
  // ライセンス(GOD-MODE / PRO / basic の3種)
  licenseKeyHash: z.string().default('').catch(''),
  base: BaseSettingsSchema.catch(BaseSettingsSchema.parse({})),
  developer: DeveloperSettingsSchema.catch(DeveloperSettingsSchema.parse({})),
})

 * 
 */
