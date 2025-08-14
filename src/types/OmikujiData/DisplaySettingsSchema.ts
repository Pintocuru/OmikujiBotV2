// src/types/DisplaySettingsSchema.ts
// 250716_1 新規追加
import { z } from 'zod';
import { ScriptGameKey, scriptGameKeys } from '@ConfigComponents/GameScripts/GameScriptsMap';
import { displaySize } from '@shared/types/';

// ------------------------------------
// 個別のスキーマに分割
// ------------------------------------

// BaseSettingsSchema
// 通常の表示設定(おみくじBOT、ゲームスクリプトの両方に影響する設定)
export const BaseSettingsSchema = z
 .object({
  // 文字・画像の大きさ指定
  displaySize: z.enum(displaySize).default('md').catch('md'),
  // 音を鳴らすか(将来、おみくじBOTで音を採用するときに使う)
  // TODO:実装
  // フォントの指定(プリセットされているものだけ)
  // TODO:実装

  // ! 下記は、omikujiBot に移行
  // キャラクターサムネイルを表示するか(個別はしてもいいかもね)
  // ! プロパティ名は変更したほうがいいかも
  modeSwitchEnabled: z.boolean().default(true).catch(true),
  // トーストを表示するか
  toastEnabled: z.boolean().default(true).catch(true)
 })
 .catch({
  displaySize: 'md',
  modeSwitchEnabled: true,
  toastEnabled: true
 });

/*
 * DeveloperSettingsSchema
 */
export const DeveloperSettingsSchema = z
 .object({
  // 開発者モードの有効化
  godModeEnabled: z.boolean().default(false).catch(false),
  // プロ版モード (有料版の機能を表示するか)
  proModeEnabled: z.boolean().default(true).catch(true),

  // 起動時に表示するコンポーネント
  startup: z.object({
   component: z.enum(['omikujiBot', 'gameScript']).default('omikujiBot'),
   // defaultComponent === 'script' のときのみ利用
   scriptKey: z.string().nullable().default(null).nullable().default(null)
  }),

  visibility: z.object({
   comments: z.boolean().default(true).catch(true), // comments
   timers: z.boolean().default(true).catch(true), // timers
   placeholders: z.boolean().default(true).catch(true), // placeholders
   characters: z.boolean().default(true).catch(true), // characters
   // 表示するゲームスクリプト
   gameScripts: z.array(z.string()).default([]).catch([]), // 参加ユーザーの履歴（時系列順）
   // ゲームスクリプトの設定を許可するか
   gameScriptSettings: z.boolean().default(true).catch(true),
   wordPartySettings: z.boolean().default(true).catch(true) // wordPartySettings
  })
 })
 .catch({
  godModeEnabled: false,
  proModeEnabled: false,
  startup: {
   component: 'omikujiBot',
   scriptKey: null
  },
  visibility: {
   comments: true,
   timers: true,
   placeholders: true,
   characters: true,
   gameScripts: [],
   gameScriptSettings: true,
   wordPartySettings: true
  }
 });

// ------------------------------------
// 分割したスキーマを結合
// ------------------------------------

// DisplaySettingsSchema
// BOTの表示部分に関わる設定
export const DisplaySettingsSchema = z.object({
 base: BaseSettingsSchema,
 developer: DeveloperSettingsSchema
});

export type DisplaySettingsType = z.infer<typeof DisplaySettingsSchema>;
