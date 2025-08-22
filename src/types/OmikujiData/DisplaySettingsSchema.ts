// src/types/DisplaySettingsSchema.ts
// 250716_1 新規追加
import { z } from 'zod'
import { displaySize } from '@shared/types/'
import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
import { themes } from '@shared/styles/DaisyUiTheme'
import { fontFamilyOptions } from '@/types/BotComponents/useFontFamily'

// BaseSettingsSchema
// 通常の表示設定(おみくじBOT、ゲームスクリプトの両方に影響する設定)
export const BaseSettingsSchema = z
  .object({
    // 文字・画像の大きさ指定
    displaySize: z.enum(displaySize).default('md').catch('md'),
    // フキダシのアニメーション(開始・表示中)
    bubbleMotionEnter: z.enum(motionLabel).default('slideUp').catch('slideUp'),
    // フキダシのアニメーション(終了時)
    bubbleMotionLeave: z.enum(motionLabel).default('slideUp').catch('slideUp'),

    // フォントの指定(プリセットされているものだけ)
    fontFamily: z.enum(fontFamilyOptions).default('default').catch('default'),

    // showCharacterIcon キャラクターサムネイルを表示するか(個別はしてもいいかもね)
    showCharacterIcon: z.boolean().default(true).catch(true),
    //  showToasts トーストを表示するか
    showToasts: z.boolean().default(true).catch(true),

    // DaisyUiのテーマカラー
    daisyUiTheme: z.enum(themes).default('dark').catch('dark'),
  })
  .catch({
    displaySize: 'md',
    bubbleMotionEnter: 'slideUp',
    bubbleMotionLeave: 'slideUp',
    fontFamily: 'default',
    showCharacterIcon: true,
    showToasts: true,
    daisyUiTheme: 'dark',
  })

/*
 * DeveloperSettingsSchema
 */
export const DeveloperSettingsSchema = z
  .object({
    // 起動時に表示するコンポーネント
    startup: z.object({
      // TODO:コンポーネントの種類を別ファイルで管理したい
      component: z.enum(['omikujiBot', 'gameScript']).default('omikujiBot'),
      // defaultComponent === 'script' のときのみ利用
      scriptKey: z.string().nullable().default(null).nullable().default(null),
    }),

    // 各表示・非表示機能
    // TODO:boolean ではなく、 accessLevel にしたい(basic/proと、internal:配布で見せてもいい場所 experimental:配布でも見せちゃ駄目な場所)
    visibility: z.object({
      comments: z.boolean().default(true).catch(true), // comments
      timers: z.boolean().default(true).catch(true), // timers
      placeholders: z.boolean().default(true).catch(true), // placeholders
      characters: z.boolean().default(true).catch(true), // characters
      // 表示するゲームスクリプト
      gameScripts: z.array(z.string()).default([]).catch([]), // 参加ユーザーの履歴（時系列順）
      // ゲームスクリプトの設定を許可するか
      gameScriptSettings: z.boolean().default(true).catch(true),
      wordPartySettings: z.boolean().default(true).catch(true), // wordPartySettings
    }),
  })
  .catch({
    startup: {
      component: 'omikujiBot',
      scriptKey: null,
    },
    visibility: {
      comments: true,
      timers: true,
      placeholders: true,
      characters: true,
      gameScripts: [],
      gameScriptSettings: true,
      wordPartySettings: true,
    },
  })

// DisplaySettingsSchema
// BOTの表示部分に関わる設定
export const DisplaySettingsSchema = z.object({
  // ライセンス(GOD-MODE / PRO / basic の3種)
  licenseKeyHash: z.string().default('').catch(''),
  base: BaseSettingsSchema,
  developer: DeveloperSettingsSchema,
})

export type DisplaySettingsType = z.infer<typeof DisplaySettingsSchema>
