// src/types/DisplaySettingsSchema.ts
// 250716_1 新規追加
import { z } from 'zod';
import { ScriptGameKey, scriptGameKeys } from '@/ScriptGame/ScriptGameMap';
import { displaySize } from '@shared/types/';

// DisplayMode
export const displayMode = ['messages', 'scriptGame'] as const;
export type DisplayMode = (typeof displayMode)[number];
export const displayModeLabels: Record<DisplayMode, string> = {
 messages: 'BOTちゃん',
 scriptGame: 'ゲームスクリプト'
};

// DisplaySettingsSchema
// BOTの表示部分に関わる設定
export const DisplaySettingsSchema = z.object({
 // 文字・画像の大きさ指定
 displaySize: z.enum(displaySize).default('md').catch('md'),
 // 起動時表示するモード(nullでBOTちゃんを表示)
 defaultScriptKey: z
  .enum(scriptGameKeys as [ScriptGameKey, ...ScriptGameKey[]])
  .nullable() // null を許容する
  .default(null), // デフォルトを null（messagesモード）にする
 // キャラクターコントロールパネルを表示するか
 modeSwitchEnabled: z.boolean().default(true).catch(true),
 // トーストを表示するか
 toastEnabled: z.boolean().default(true).catch(true),
 // モードの自動切り替えをする秒数
 autoSwitchInterval: z.number().min(0).default(0).catch(0)
});
