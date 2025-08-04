// src/params.ts
import { z } from 'zod';
import { ScriptPlaceholderItem, ParameterItem } from '@/types/';
import {
 GamePlaceholder as LogGamePlaceholder,
 placeholders as logPlaceholders
} from '@/GameScripts/LogRank/src/params';

/**
 * settings
 */
export const GameSettingsSchema = z.object({
 isParty: z.boolean().default(true).catch(true),
 rankingLimit: z.number().int().min(1).max(30).default(10).catch(10),
 enableCount: z.number().int().min(0).max(100).default(5).catch(5)
});
export type GameSettings = z.infer<typeof GameSettingsSchema>;

export const settings: ParameterItem<GameSettings>[] = [
 {
  key: 'isParty', // キー名
  name: 'WordPartyで音を鳴らすか', // ルール名
  description: 'ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない', // 説明文
  inputType: 'boolean', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: true // デフォルト値
 },
 {
  key: 'rankingLimit', // キー名
  name: '上位何位まで表示させるか', // ルール名
  description: '大きくしすぎるとはみ出ます。', // 説明文
  inputType: 'number', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: 10, // デフォルト値
  min: 1,
  max: 30
 },
 {
  key: 'enableCount', // キー名
  name: 'ランキング上限回数', // ルール名
  description: 'この回数を超える場合、結果はランキングに入りません', // 説明文
  inputType: 'number', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: 5, // デフォルト値
  min: 0,
  max: 100
 }
];

/**
 * params
 */
export const suika = ['スイカゲーム', 'カボチャゲーム', 'クジラゲーム'] as const;
export const GameParamsSchema = z.object({
 mode: z.enum(suika).default('スイカゲーム').catch('スイカゲーム')
});
export type GameParams = z.infer<typeof GameParamsSchema>;
export const params: ParameterItem<GameParams>[] = [
 {
  key: 'mode', // キー名
  name: 'モード', // ルール名
  description: '降ってくるアイテムや得点が変わります', // 説明文
  inputType: 'select', // 'select' | 'number' | 'string' | 'boolean'
  values: ['スイカゲーム', 'カボチャゲーム', 'クジラゲーム'], // 選択肢
  defaultValue: 'スイカゲーム' // デフォルト値
 }
];

/**
 * placeholders
 */
export type GamePlaceholder = {
 message: string;
 mode: string;
 points: number;
} & LogGamePlaceholder; // LogRank のプレースホルダーを継承

// logPlaceholders から必要なプロパティを抜粋
const wantedLogPlaceholderIds = ['announceMessage', 'totalDraws', 'winsRank', 'totalPoints'];
const selectedLogPlaceholders: ScriptPlaceholderItem<LogGamePlaceholder>[] = logPlaceholders.filter(
 (item) => wantedLogPlaceholderIds.includes(item.key)
);
export const placeholders: ScriptPlaceholderItem<GamePlaceholder>[] = [
 {
  key: 'message',
  name: '標準メッセージ',
  description: 'デフォルトのスイカジェネレーターの返答',
  value: 'userの得点は1500!'
 },
 {
  key: 'points',
  name: 'ゲームモード',
  description: 'どのゲームモードだったかを返します',
  value: 'カボチャゲーム'
 },
 {
  key: 'points',
  name: 'ポイント',
  description: 'スイカジェネレーターの得点を返します',
  value: '1500'
 },
 // LogRank のプレースホルダーを継承
 ...selectedLogPlaceholders
];
