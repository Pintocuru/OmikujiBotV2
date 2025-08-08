// src/types/DisplaySettingsSchema.ts
// 250716_1 新規追加
import { z } from 'zod';
import { ScriptGameKey, scriptGameKeys } from '@/ConfigMaker/components/GameScripts/ScriptGameMap';
import { displaySize } from '@shared/types/';

// DisplaySettingsSchema
// BOTの表示部分に関わる設定
export const DisplaySettingsSchema = z.object({
 // 通常の表示設定
 base: z
  .object({
   // 文字・画像の大きさ指定
   displaySize: z.enum(displaySize).default('md').catch('md'),
   // キャラクターサムネイルを表示するか
   modeSwitchEnabled: z.boolean().default(true).catch(true),
   // トーストを表示するか
   toastEnabled: z.boolean().default(true).catch(true)
  })
  .catch({
   displaySize: 'md',
   modeSwitchEnabled: true,
   toastEnabled: true
  }),

 // 開発者モード（GOD-MODE）
 developer: z
  .object({
   // 開発者モードの有効化
   godModeEnabled: z.boolean().default(false).catch(false),

   // 起動時に表示するコンポーネント
   // 現在は2種類のみ
   selectComponent: z.enum(['omikujiBot', 'gameScript']).default('omikujiBot'),

   // defaultComponent === 'script' のときのみ利用
   defaultScriptKey: z
    .enum(scriptGameKeys as [ScriptGameKey, ...ScriptGameKey[]])
    .nullable()
    .default(null),

   // 表示するゲームスクリプト
   availableGameScripts: z.array(z.string()).default([]).catch([]), // 参加ユーザーの履歴（時系列順）

   // ゲームスクリプトの設定を許可するか
   enabledGameScriptSettings: z.boolean().default(true).catch(true),

   // 「テンプレート出力ボタン」を表示するか
   showTemplateButton: z.boolean().default(true).catch(true)
  })
  .catch({
   godModeEnabled: true,
   selectComponent: 'omikujiBot',
   availableGameScripts: [],
   defaultScriptKey: null,
   enabledGameScriptSettings: true,
   showTemplateButton: true
  })
});

// ルートカテゴリの表示設定
// recordCategoryType = ['comments', 'timers', 'placeholders', 'characters']
// 以上の4つは常に表示するので設定不要
//
// GOD-MODE:「おみくじBot コンフィグエディター」のタイトルに「DEV」が付く
//
// scriptSettings:ゲームスクリプト設定が可能に。
// おみくじ>ゲームスクリプト設定 の「ゲームスクリプトを使用」が表示され
// 「ゲームスクリプト」が選択できるようになる
//
// displaySettings:開発者モードの設定が可能に。
//
// wordPartySettings:WordPartyのconfig.js読み込み機能が表示される
// 開発者モードで設定できる箇所は、黄色く表示する
