// src/gameConfig.ts

// ゲーム設定
export const MAX_WIN = 20000;
export const PLAYER_INITIAL_LIFE = 4;
export const ATTACKS_PER_TURN = 3;

// 攻撃確率
export const ATTACK_PROBABILITIES = {
 DENOMINATOR: 15, // 分母
 CRITICAL: 1, // クリティカル(ダメージ2)
 NORMAL: 2 // 通常(ダメージ1)
} as const;

// 攻撃効果
export const ATTACK_EFFECTS = {
 CRITICAL: { damage: 2, heal: 2 },
 NORMAL: { damage: 1, heal: 1 },
 MISS: { damage: 0, heal: 0 }
} as const;

// 敵のテーブル
export const ENEMY_PATTERNS = [
 { weight: 9, enemyLife: [2, 2, 2, 3, 4, 5, 6, 12], name: '通常A' },
 { weight: 8, enemyLife: [2, 3, 2, 3, 5, 4, 6, 12], name: '通常B' },
 { weight: 7, enemyLife: [1, 1, 2, 4, 5, 7, 8, 12], name: '前半チャンスA' },
 { weight: 6, enemyLife: [1, 1, 1, 2, 7, 8, 9, 12], name: '前半チャンスB' },
 { weight: 5, enemyLife: [3, 5, 7, 4, 4, 3, 3, 12], name: '後半チャンスA' },
 { weight: 4, enemyLife: [5, 6, 7, 4, 3, 2, 1, 12], name: '後半チャンスB' },
 { weight: 3, enemyLife: [4, 4, 4, 4, 4, 4, 4, 12], name: '同じ敵' },
 { weight: 2, enemyLife: [10, 1, 1, 1, 1, 1, 1, 12], name: 'ソードマスターヤマト' }
] as const;

// 報酬テーブル
export const STAGE_REWARDS = [10, 50, 100, 500, 1000, 5000, 10000] as const;

// 勝利メッセージテーブル
export const WIN_MESSAGES = [
 [MAX_WIN, '🌟MAX WIN🌟 上限の'],
 [10000, '👑JACKPOT👑'],
 [5000, '💎EPIC WIN💎'],
 [2500, '♕FEVER♕'],
 [1000, '🎯大当り🎯'],
 [500, '✌あたり✌']
] as const;

// 型定義
export type EnemyPattern = (typeof ENEMY_PATTERNS)[number];
export type AttackType = keyof typeof ATTACK_EFFECTS;

export interface BattleResult {
 playerLife: number;
 enemyLife: number;
}

export interface GameResult {
 stage: number;
 name: string;
 ways: number[];
 payout: number;
}
