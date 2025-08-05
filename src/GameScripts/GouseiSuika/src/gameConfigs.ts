// src/gameConfigs.ts
import { PostActionWordPartyType } from '@/types/';

/**
 * 型定義
 */
// 各ゲーム（例: suika）がキー
export type GameConfigs = Record<string, GameConfigDetails>;

export type GameConfigDetails = {
 small: GameConfigItem[]; // small ゲーム設定の配列
 big: GameConfigItem[]; // big ゲーム設定の配列
};

export type GameConfigItem = {
 chance: number; // 確率
 times?: number; // オプショナル: 繰り返し回数
 points: number; // ポイント
 damage?: number; // オプショナル: ダメージ
 party: string; // キャラクターやアイテムの名前
};

export interface GameResult {
 points: number;
 postArray: PostActionWordPartyType[];
}

// ---

/**
 * 設定値
 */

export const GAME_CONFIGS: GameConfigs = {
 // スイカゲーム
 スイカゲーム: {
  small: [
   { chance: 67, times: 15, points: 1, party: '🍓' }, // いちご：1点
   { chance: 50, times: 15, points: 3, party: '🍇' }, // ぶどう：3点
   { chance: 50, times: 10, points: 10, party: '🍊' }, // デコポン：10点
   { chance: 50, times: 8, points: 20, party: '🦪' }, // かき：20点
   { chance: 67, times: 5, points: 50, party: '🍎' } // りんご：50点
  ],
  big: [
   { chance: 25, points: 300, damage: 1, party: '🍐' }, // なし
   { chance: 25, points: 400, damage: 1, party: '🍍' }, // パイナップル
   { chance: 33, points: 500, damage: 2, party: '🍑' }, // もも
   { chance: 33, points: 700, damage: 2, party: '🍈' }, // メロン
   { chance: 50, points: 1000, damage: 3, party: '🍉' }, // スイカ
   { chance: 100, points: 1000, damage: 0, party: '🍉' } // ダブル
  ]
 },

 // カボチャゲーム
 カボチャゲーム: {
  small: [
   { chance: 67, times: 15, points: 1, party: '🍓' },
   { chance: 50, times: 15, points: 3, party: '🍇' },
   { chance: 50, times: 10, points: 10, party: '🍊' },
   { chance: 50, times: 8, points: 20, party: '🦪' },
   { chance: 67, times: 5, points: 50, party: '🍎' }
  ],
  big: [
   { chance: 25, points: 150, damage: 0, party: '🍬' }, // キャンディー
   { chance: 33, points: 300, damage: 1, party: '🍐' }, // なし
   { chance: 33, points: 400, damage: 1, party: '🍍' }, // パイナップル
   { chance: 33, points: 500, damage: 2, party: '🍑' }, // もも
   { chance: 33, points: 700, damage: 2, party: '🍈' }, // メロン
   { chance: 50, points: 1000, damage: 3, party: '🍉' }, // スイカ
   { chance: 50, points: 1000, damage: 0, party: '🍉' }, // ダブル
   { chance: 100, points: 1200, damage: 0, party: '🎃' } // カボチャ
  ]
 },

 // クジラゲーム
 クジラゲーム: {
  small: [
   { chance: 50, times: 5, points: 11, party: '!クマノミ' },
   { chance: 50, times: 5, points: 22, party: '!クラゲ' },
   { chance: 50, times: 5, points: 33, party: '!フグ' },
   { chance: 50, times: 5, points: 44, party: '!カニ' },
   { chance: 50, times: 5, points: 55, party: '!マグロ、ご期待ください' }
  ],
  big: [
   { chance: 33, points: 300, damage: 1, party: '!ウミガメ' },
   { chance: 33, points: 350, damage: 1, party: '!マンボウ' },
   { chance: 33, points: 400, damage: 1, party: '!ジンベエザメ' },
   { chance: 33, points: 450, damage: 1, party: '!シャチ' },
   { chance: 100, points: 500, damage: 0, party: '!クジラ' }
  ]
 }
};
