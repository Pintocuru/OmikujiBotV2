// src/params.ts
import { ScriptPlaceholderItem, ParameterItem } from '@type/index';

/**
 * settings
 */
export interface GameSettings {
 isParty: 'ON' | 'OFF';
}
export const settings: ParameterItem<GameSettings>[] = [
 {
  key: 'isParty', // キー名
  name: 'WordPartyで音を鳴らすか', // ルール名
  description: 'ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない', // 説明文
  inputType: 'select', // 'select' | 'number' | 'string' | 'boolean'
  values: ['ON', 'OFF'], // 選択肢
  defaultValue: 'ON' // デフォルト値
 }
];

/**
 * params
 */
export type GameParams = {
 enableCount: number;
};
export const params: ParameterItem<GameParams>[] = [
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
 * placeholders
 */
export type GamePlaceholder = {
 message: string;
 symbol: string;
 payout: string;
 winsRank: string;
};

export const placeholders: ScriptPlaceholderItem<GamePlaceholder>[] = [
 {
  key: 'message',
  name: '標準メッセージ',
  description: 'デフォルトの返答',
  value: 'userのかけざんスピン!残念、配当0でした。'
 },
 {
  key: 'symbol',
  name: 'シンボル',
  description: '当選した図柄を返します',
  value: '-'
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
 symbolIdx: number;
 symbol: string;
 name: string;
 ways: number[];
 payout: number;
 hasBoost: boolean;
}
