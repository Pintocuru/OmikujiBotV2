// src/types/DisplaySettingsSchema.ts
import { z } from 'zod'
import { AccessLevelSchema, displaySize } from '@shared/types/'
import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
import { themes } from '@shared/styles/DaisyUiTheme'
import { fontFamilyOptions } from '@/types/BotComponents/useFontFamily'

// BaseSettingsSchema
// 通常の表示設定(おみくじBOT、ゲームスクリプトの両方に影響する設定)
export const BaseSettingsSchema = z.object({
  /**
   * フキダシ設定 commentBubble
   */
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

  /**
   * トースト設定 toastBubble
   */
  // トースト表示
  showToasts: z.boolean().default(true).catch(true),
  // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsOnRight: z.boolean().default(true).catch(true),
  // トースト表示時、キャラクターを表示するか
  showToastsCharacter: z.boolean().default(false).catch(false),
  // キャラクターサムネイルを表示するか
  // TODO:showCharacterThumbnail -> showThumbnail に移行
  showCharacterThumbnail: z.boolean().default(true).catch(true),

  /**
   * キャラクター設定 showCharacter
   */

  // キャラクターにフレーム（円形の背景）を表示するか
  showCharacterFrame: z.boolean().default(true).catch(true),
  // キャラクターを常時表示するか（コメント消失後も表示継続）
  showCharacterPersistent: z.boolean().default(false).catch(false),
  // キャラクター統合モード / 常時表示時やサムネイルは、Character のorder1のみを表示させる
  bundleCharacters: z.boolean().default(false).catch(false),

  /**
   * エディター設定
   */
  // DaisyUiのテーマカラー
  daisyUiTheme: z.enum(themes).default('dark').catch('dark'),
})

// 製品アクセスレベル
export const componentSelectLabels = [
  'omikujiBot', // おみくじBOT
  'gameScript', // ゲームスクリプト
] as const
export type ComponentSelectType = (typeof componentSelectLabels)[number]
export const ComponentSelectSchema = z.enum(componentSelectLabels)

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
  wordPartyLoading: AccessLevelSchema.default('internal').catch('internal'),
  licenseVisible: AccessLevelSchema.default('basic').catch('basic'),
  // ゲームスクリプト
  gameScriptSettings: AccessLevelSchema.default('basic').catch('basic'),
  gameScripts: z.array(z.string()).default([]).catch([]), //
  // ツール系
  wordPartySettings: AccessLevelSchema.default('basic').catch('basic'),
})

/*
 * DeveloperSettingsSchema
 */
export const DeveloperSettingsSchema = z.object({
  // 起動時に表示するコンポーネント
  startup: z
    .object({
      component: ComponentSelectSchema.default('omikujiBot'),
      // defaultComponent === 'script' のときのみ利用
      scriptKey: z.string().nullable().default(null).catch(null),
    })
    .catch({
      component: 'omikujiBot',
      scriptKey: null,
    }),

  // 各表示・非表示機能
  visibility: visibilitySchema.catch(visibilitySchema.parse({})),
})

// DisplaySettingsSchema
// BOTの表示部分に関わる設定
export const DisplaySettingsSchema = z.object({
  // ライセンス(GOD-MODE / PRO / basic の3種)
  licenseKeyHash: z.string().default('').catch(''),
  base: BaseSettingsSchema.catch(BaseSettingsSchema.parse({})),
  developer: DeveloperSettingsSchema.catch(DeveloperSettingsSchema.parse({})),
})

export type DisplaySettingsType = z.infer<typeof DisplaySettingsSchema>

/**

// キャラクター
export const CharacterSettingsSchema = z.object({ 
  // キャラクターのkeyを並べる(新設)
  showCharacters: z.array(z.array(z.string())).default([]).catch([]),
  showCharacterFrame: z.boolean().default(true),  
  // showCharacterPersistent , bundleCharacters は廃止
  // showCharacters にいないキャラクターは、すべてポップアップで出る
});

// フキダシ
export const BubbleSettingsSchema = z.object({
  // 文字の大きさ変更(displaySize)は廃止
  widthSize: z.enum(displaySize).default('md').catch('md'), // フキダシの横幅(新設)
  fontFamily: z.enum(fontFamilyOptions).default('default'),
  bubbleMotionEnter: z.enum(motionLabel).default('slideUp'),
  bubbleMotionLeave: z.enum(motionLabel).default('slideUp'),
  bubbleTextAnimate: z.boolean().default(false).catch(false),
  bubbleTextSpeed: z.number().min(10).max(200).default(50).catch(50),
});

// トースト
export const ToastSettingsSchema = z.object({
  showToasts: z.boolean().default(true).catch(true),
  showToastsOnRight: z.boolean().default(true).catch(true),
  showToastsCharacter: z.boolean().default(false).catch(false),
});

// サムネイル Thumbnail
export const ThumbnailSettingsSchema = z.object({
  // サムネイルとして表示したいキャラクターのkeyを並べる(新設)
  showThumbnail:  z.array(z.string()).default([]).catch([]),
});



// BaseSettingsSchema -> OmikujiBotSettingsとして再定義
export const OmikujiBotSettingsSchema = z.object({
  bubble: BubbleSettingsSchema,
  toast: ToastSettingsSchema,
  character: CharacterSettingsSchema,
});

// エディター
// DisplaySettingsSchema.editor として再定義
export const EditorSettingsSchema = z.object({
  licenseKeyHash: z.string().default('').catch(''),
  daisyUiTheme: z.enum(themes).default('dark'),
});


 */
