// src/gameConfig.ts

// 支払いテーブルのインターフェース定義
export interface GameResult {
  symbolIdx: number
  symbol: string
  attempt:number 
  party:string
  name: string
  ways: number[]
  payout: number
  hasBoost: boolean
}


// ゲーム設定
export const GAME_CONFIG = {
 MAX_WIN: 10000,
 MAX_ATTEMPTS: 3, // ゲーム試行回数
 BOOST_PROBABILITY: 0.2, // ブースト発生確率
 MIN_REELS_FOR_WIN: 3, // 勝利に必要な最小リール数
 REEL_COUNT: 5 // リール数
} as const;

// シンボルデータ
export const SYMBOLS = [
 { weight: 27, payouts: [0.1, 0.1, 0.1], icon: '⛈️', name: '10', party: 'MultiplyBonanzaZugara10' },
 { weight: 21, payouts: [0.2, 0.3, 0.4], icon: '🌙', name: 'J', party: 'MultiplyBonanzaZugaraJ' },
 { weight: 17, payouts: [0.3, 0.8, 2.0], icon: '🎍', name: 'Q', party: 'MultiplyBonanzaZugaraQ' },
 { weight: 15, payouts: [0.5, 1.5, 3.5], icon: '🌊', name: 'K', party: 'MultiplyBonanzaZugaraK' },
 { weight: 12, payouts: [0.8, 2.5, 5.0], icon: '🌸', name: 'ACE', party: 'MultiplyBonanzaZugaraACE' },
 { weight: 9, payouts: [1.5, 4.0, 10.0], icon: '🌟', name: 'SSR', party: 'MultiplyBonanzaZugaraSSR' }
];

// シンボルの重みの合計
export const TOTAL_WEIGHT = SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);

// 勝利メッセージ
export const WIN_MESSAGES = [
 [GAME_CONFIG.MAX_WIN, '🌟MAX WIN🌟 上限の'],
 [10000, '👑JACKPOT👑'],
 [5000, '💎EPIC WIN💎'],
 [2500, '♕FEVER♕'],
 [1000, '🎯大当り🎯'],
 [500, '✌あたり✌']
] as const;
