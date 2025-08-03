// src/params.ts
import { ScriptPlaceholderItem, ParameterItem } from '@shared/types/GameScriptTypes';

/**
 * settings
 */
export interface GameSettings {
 isSound: boolean;
}
export const settings: ParameterItem<GameSettings>[] = [
 {
  key: 'isSound', // キー名
  name: 'WordPartyで音を鳴らすか', // ルール名
  description: 'ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない', // 説明文
  inputType: 'boolean', // 'select' | 'number' | 'string' | 'boolean'
  defaultValue: true // デフォルト値
 }
];

/**
 * params
 */
export type GameParams = {};
export const params: ParameterItem<GameParams>[] = [];

/**
 * placeholders
 */
export type GamePlaceholder = {
 message: string;
 rarity: string;
};

export const placeholders: ScriptPlaceholderItem<GamePlaceholder>[] = [
 {
  key: 'message',
  name: '標準メッセージ',
  description: 'デフォルトの返答',
  value: 'userの3連おみくじ!ミャー吉!メェー吉!【激レア!】巨象吉!'
 },
 {
  key: 'rarity',
  name: 'レアリティ',
  description: '今回出た中で最も高いレア度',
  value: '【R】'
 }
];

// ---

export const omikujiItems: RewardItem[] = [
 // コモン:544 / 動物の鳴き声(2-3文字)
 {
  weight: 544,
  content: [
   'ワン',
   'バウ',
   'モー',
   'ピヨ',
   'コケ',
   'ケロ',
   'ブー',
   'モグ',
   'チュン',
   'メェー',
   'チュー',
   'ミャー',
   'クワッ',
   'キュイ',
   'ヒヒン',
   'キャン',
   'クエッ',
   'ガルル',
   'ガオー'
  ],
  prefix: '',
  rarity: 0,
  rarityName: 'N'
 },
 // アンコモン:334 / 動物の鳴き声(4文字-)
 {
  weight: 334,
  content: [
   'ゲコゲコ',
   'ホーホー',
   'カッコー',
   'ウキーッ',
   'ブヒブヒ',
   'ヒヒーン',
   'パオーン',
   'ギャオン',
   'クルッポー',
   'コケコッコー',
   'キュルキュル',
   'ホーホケキョ',
   'ピィーヒョロロ'
  ],
  prefix: '',
  rarity: 1,
  rarityName: 'R'
 },
 // レア:100 / 動物の漢字 / 連での当選率:27.1%
 {
  weight: 100,
  content: [
   '紅鶴',
   '黒豹',
   '青鯨',
   '銀狼',
   '蒼鷹',
   '虎狼',
   '金熊',
   '斑馬',
   '黒熊',
   '山猫',
   '雪豹',
   '銀狐',
   '海豚',
   '森鹿',
   '雪熊',
   '銀鯱',
   '火狐',
   '水獺',
   '巨象',
   '虎王',
   '獅子',
   '鷹目',
   '稲荷',
   '蝶舞',
   '獏夢'
  ],
  prefix: '【激レア!】',
  rarity: 2,
  rarityName: 'SR'
 },
 // スペシャルスーパーレア:20 / 幻獣+それっぽい漢字1文字 / 連での当選率:5.88%
 {
  weight: 20,
  content: [
   '鳳凰王',
   '麒麟聖',
   '龍神帝',
   '玄亀甲',
   '白虎皇',
   '朱雀炎',
   '青龍天',
   '仙狐霊',
   '天狗翼',
   '九狐幻',
   '八蛇魔'
  ],
  prefix: '【超激レア!!】',
  rarity: 3,
  rarityName: 'SSR'
 },
 // シークレットレア:2 / ネタ / 連での当選率:0.6%
 {
  weight: 2,
  content: ['福沢諭'],
  prefix: '【伝説の究極レア!!!】',
  rarity: 4,
  rarityName: 'LR'
 }
];

// 報酬アイテムの定義
export interface RewardItem {
 weight: number;
 content: string[];
 prefix: string;
 rarity: number;
 rarityName: string;
}
