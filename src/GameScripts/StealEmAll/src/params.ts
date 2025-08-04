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
export const GameParamsSchema = z.object({});
export type GameParams = z.infer<typeof GameParamsSchema>;
export const params: ParameterItem<GameParams>[] = [];

/**
 * placeholders
 */
export type GamePlaceholder = {
 message: string;
 stage: number;
 payout: number;
} & LogGamePlaceholder; // LogRank のプレースホルダーを継承

export const placeholders: ScriptPlaceholderItem<GamePlaceholder>[] = [
 {
  key: 'message',
  name: '標準メッセージ',
  description: 'デフォルトの返答',
  value: 'userのダンジョン攻略!5/7/25/55/250!合計1000枚獲得!'
 },
 {
  key: 'stage',
  name: '倒した敵の数',
  description: '倒した敵の数です',
  value: '5'
 },
 {
  key: 'payout',
  name: '獲得したポイント',
  description: '獲得したポイントを返します',
  value: '0'
 },
 {
  key: 'winsRank',
  name: '順位',
  description: '今回の順位を返します',
  value: '1'
 }
];

// ---

// 支払いテーブルのインターフェース定義
export interface GameResult {
 stage: number;
 name: string;
 ways: number[];
 payout: number;
}
