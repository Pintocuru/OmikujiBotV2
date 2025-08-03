// src/params.ts
import { z } from 'zod';
import { ScriptPlaceholderItem, ParameterItem } from '@shared/types/GameScriptTypes';

/**
 * settings
 */
export const GameSettingsSchema = z.object({
 rankMode: z.enum(['wins', 'rate', 'point']),
 enableCount: z.number().int().min(0).max(100)
});
export type GameSettings = z.infer<typeof GameSettingsSchema>;

export const settings: ParameterItem<GameSettings>[] = [
 {
  key: 'rankMode', // キー名
  name: 'ランキングモード', // ルール名
  description: 'wins:勝数/ rate:レート/ point:1回のポイント', // 説明文
  inputType: 'select', // 'select' | 'number' | 'string' | 'boolean'
  values: ['wins', 'rate', 'point'], // 選択肢',
  defaultValue: 'wins'
 },
 {
  key: 'enableCount', // キー名
  name: 'ランキング上限回数', // ルール名
  description: 'この回数を超える場合、結果はランキングに入りません(0で無限)', // 説明文
  inputType: 'number', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: 5, // デフォルト値
  min: 0,
  max: 100
 }
];

/**
 * params
 */
export const GameParamsSchema = z.object({
 isWin: z.boolean(),
 getPoint: z.number(),
 itemValue1: z.string().optional(),
 itemValue2: z.string().optional(),
 itemValue3: z.string().optional()
});
export type GameParams = z.infer<typeof GameParamsSchema>;

export const params: ParameterItem<GameParams>[] = [
 {
  key: 'isWin', // キー名
  name: '勝利したか', // ルール名
  description: '勝敗フラグ',
  inputType: 'boolean', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: false // デフォルト値
 },
 {
  key: 'getPoint', // キー名
  name: '獲得したポイント', // ルール名
  description: '入力した数値を、ポイントとして加算します',
  inputType: 'number', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: 0 // デフォルト値
 },
 {
  key: 'itemValue1', // キー名
  name: '任意の項目1', // ルール名
  description: 'ランキングで補助的に使用したい要素を入れます',
  inputType: 'string', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: '' // デフォルト値
 },
 {
  key: 'itemValue2', // キー名
  name: '任意の項目2', // ルール名
  description: 'ランキングで補助的に使用したい要素を入れます',
  inputType: 'string', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: '' // デフォルト値
 },
 {
  key: 'itemValue3', // キー名
  name: '任意の項目3', // ルール名
  description: 'ランキングで補助的に使用したい要素を入れます',
  inputType: 'string', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: '' // デフォルト値
 }
];

/**
 * placeholders
 */
export const GamePlaceholderSchema = z.object({
 announceMessage: z.string().default(''),
 totalDraws: z.number().default(0),
 winsCount: z.number().default(0),
 winsRank: z.union([z.number(), z.literal('ランキング外')]).default('ランキング外'),
 winsRate: z.string().default('0.0'),
 totalPoints: z.number().default(0)
});
export type GamePlaceholder = z.infer<typeof GamePlaceholderSchema>;

export const placeholders: ScriptPlaceholderItem<GamePlaceholder>[] = [
 {
  key: 'announceMessage',
  name: 'アナウンス',
  description: 'ランキングの順位または超過であることを表示します',
  value: 'userさんの順位は、4位だよ。/userさんは上限を超えているから、参考記録だよ。'
 },
 {
  key: 'totalDraws',
  name: 'このおみくじをした回数',
  description: 'この配信でのおみくじした回数を返します',
  value: '10'
 },
 {
  key: 'winsCount',
  name: '勝利数(勝ち負けがある場合)',
  description: 'コメントしたユーザーの、配信枠内での勝数を返します',
  value: '2'
 },
 {
  key: 'winsRank',
  name: 'ユーザーの順位',
  description: 'パラメータのランキングモードを参照し、配信枠内での順位を数値で返します',
  value: '4'
 },
 {
  key: 'winsRate',
  name: 'ユーザーの勝率(%)',
  description: 'コメントしたユーザーの、配信枠内での勝率を返します',
  value: '20.0'
 },
 {
  key: 'totalPoints',
  name: 'ユーザーの総得点',
  description: 'コメントしたユーザーの、配信枠内での総得点を返します',
  value: '100'
 }
];
