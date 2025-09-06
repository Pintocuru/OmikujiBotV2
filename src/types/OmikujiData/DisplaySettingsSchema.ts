// src/types/DisplaySettingsSchema.ts
// 250716_1 新規追加
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

  /**
   * トースト設定 toastBubble
   * TODO:トースト表示にバリエーションの必要性とは？
   * トースト、電光掲示板、2つ目のフキダシなど。
   */
  //  showToasts トーストを表示するか
  showToasts: z.boolean().default(true).catch(true),

  /**
   * キャラクター設定 showCharacter
   */
  // キャラクターにフレーム（円形の背景）を表示するか
  showCharacterFrame: z.boolean().default(true).catch(true),
  // キャラクターを常時表示するか（コメント消失後も表示継続）
  showCharacterPersistent: z.boolean().default(false).catch(false),
  // キャラクターサムネイルを表示するか
  showCharacterThumbnail: z.boolean().default(true).catch(true),
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
  placeholders: AccessLevelSchema.default('basic').catch('basic'), // placeholders
  characters: AccessLevelSchema.default('basic').catch('basic'), // characters
  // コンポーネントの特定の箇所
  characterVisible: AccessLevelSchema.default('basic').catch('basic'),
  wordPartyLoading: AccessLevelSchema.default('basic').catch('basic'),
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

// フキダシ
export const BubbleSettingsSchema = z.object({
  displaySize: z.enum(displaySize).default('md'),
  fontFamily: z.enum(fontFamilyOptions).default('default'),
  bubbleMotionEnter: z.enum(motionLabel).default('slideUp'),
  bubbleMotionLeave: z.enum(motionLabel).default('slideUp'),
});

// トースト
export const ToastSettingsSchema = z.object({
  showToasts: z.boolean().default(true),
});

// キャラクター
export const CharacterOptionsSchema = z.object({
  showCharacterFrame: z.boolean().default(true),
  showCharacterPersistent: z.boolean().default(false),
  showCharacterThumbnail: z.boolean().default(true),
});

// エディター
export const EditorSettingsSchema = z.object({
  daisyUiTheme: z.enum(themes).default('dark'),
});

// 元の BaseSettingsSchema を集約スキーマとして再定義
export const BaseSettingsSchema = z.object({
  bubble: BubbleSettingsSchema,
  toast: ToastSettingsSchema,
  character: CharacterOptionsSchema,
  editor: EditorSettingsSchema,
});


 */
