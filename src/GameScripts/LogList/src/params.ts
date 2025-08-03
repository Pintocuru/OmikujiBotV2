// src/params.ts
import {
 GameState,
 UserStatistics,
 ScriptPlaceholderItem,
 ParameterItem
} from '@shared/types/GameScriptTypes';

// 追加game定義
export type GameStatePlus = GameState<
 // 追加プロパティ
 {
  rankings: UserRankingType[];
 },
 // UserStatistics の追加データ
 ranks
>;

export type GameStateExtras = {
 rankings: UserRankingType[];
};

// ランキングデータ定義
interface ranks {
 itemValue1: string; // 項目1
 itemValue2: string; // 項目2
 itemValue3: string; // 項目3
 priority: number; // 優先度(高いほどリストが上位になる)
}

export type UserRankingType<T extends object = ranks> = UserStatistics<T>;

/**
 * settings
 */
export interface GameSettings {}

export const settings: ParameterItem<GameSettings>[] = [];

/**
 * params
 */
export type GameParams = {
 enableCount: number;
} & ranks;

export const params: ParameterItem<GameParams>[] = [
 {
  key: 'enableCount', // キー名
  name: '上限回数', // ルール名
  description: 'この回数を超える場合、結果はリストに入りません(0で無限)', // 説明文
  inputType: 'number', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: 5, // デフォルト値
  min: 0,
  max: 100
 },
 {
  key: 'itemValue1', // キー名
  name: '項目1', // ルール名
  description: '項目1',
  inputType: 'string', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: '項目1' // デフォルト値
 },
 {
  key: 'itemValue2', // キー名
  name: '項目2', // ルール名
  description: '項目2',
  inputType: 'string', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: '項目2' // デフォルト値
 },
 {
  key: 'itemValue3', // キー名
  name: '項目3', // ルール名
  description: '項目3',
  inputType: 'string', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: '項目3' // デフォルト値
 },
 {
  key: 'priority', // キー名
  name: '優先度', // ルール名
  description: 'この数値が高いほど、リストの上位に上がります',
  inputType: 'number', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: 0 // デフォルト値
 }
];

/**
 * placeholders
 */
export type GamePlaceholder = {
 announceMessage: string;
 totalDraws: string;
 winsRank: string;
};
export const placeholders: ScriptPlaceholderItem<GamePlaceholder>[] = [
 {
  key: 'announceMessage',
  name: 'アナウンス',
  description: 'priorityの高い順で順位を表示します',
  value: 'userさんの順位は、4位だよ。'
 },
 {
  key: 'totalDraws',
  name: 'このおみくじをした回数',
  description: 'この配信でのおみくじした回数を返します',
  value: '10'
 },
 {
  key: 'winsRank',
  name: 'ユーザーの順位',
  description: 'パラメータのランキングモードを参照し、配信枠内での順位を数値で返します',
  value: '4'
 }
];
