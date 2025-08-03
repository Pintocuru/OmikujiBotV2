// src/execute.ts
import { GameSettings, GameParams, GamePlaceholder, GameResult } from './params';
import { ScriptResult, ScriptClass } from '@shared/types/GameScriptTypes';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { GameStateExtras, UserRankingType } from '@/GameScripts/LogRank/src/params';
import LogRankScript from '@/GameScripts/LogRank/src/execute';

// ゲーム設定
const MAX_WIN = 20000;
const MAX_ATTEMPTS = 3; // ゲーム試行回数
const BOOST_PROBABILITY = 0.15; // ブースト発生確率
const MIN_REELS_FOR_WIN = 3; // 勝利に必要な最小リール数

// ゲームデータ
const SYMBOLS = [
 { weight: 27, payouts: [0.1, 0.1, 0.1], icon: '⛈️', name: '10', party: '!bonanza10' },
 { weight: 21, payouts: [0.2, 0.3, 0.4], icon: '🌙', name: 'J', party: '!bonanzaJ' },
 { weight: 17, payouts: [0.3, 0.8, 2.0], icon: '🎍', name: 'Q', party: '!bonanzaQ' },
 { weight: 15, payouts: [0.5, 1.5, 3.5], icon: '🌊', name: 'K', party: '!bonanzaK' },
 { weight: 12, payouts: [0.8, 2.5, 5.0], icon: '🌸', name: 'ACE', party: '!bonanzaACE' },
 { weight: 9, payouts: [1.5, 4.0, 10.0], icon: '🌟', name: 'SSR', party: '!bonanzaSSR' }
];

const TOTAL_WEIGHT = SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);

const WIN_MESSAGES = [
 [MAX_WIN, '🌟MAX WIN🌟 上限の'],
 [10000, '👑JACKPOT👑'],
 [5000, '💎EPIC WIN💎'],
 [2500, '♕FEVER♕'],
 [1000, '🎯大当り🎯'],
 [500, '✌あたり✌']
] as const;

export class ExecuteScript
 implements ScriptClass<GameSettings, GameParams, GamePlaceholder, UserRankingType, GameStateExtras>
{
 private settings: GameSettings = { isParty: 'ON' };
 private winChan = LogRankScript;

 setup(settings: GameSettings): void {
  this.settings = settings;
  this.winChan.setup({ rankMode: 'point' });
 }

 run(comment: Comment, params: GameParams): ScriptResult<GamePlaceholder, UserRankingType> {
  const userName = comment?.data.displayName ?? 'Unknown';
  const result = this.playGame();
  const message = this.createMessage(userName, result);

  // WinChanでランキング生成
  const winResult = this.winChan.run(comment, {
   enableCount: params.enableCount,
   isWin: false,
   getPoint: result.payout
  });

  return {
   // TODO:内容を実装
   postActions: this.settings.isParty === 'ON' ? [] : [],
   placeholders: {
    message,
    symbol: result.symbol,
    payout: String(result.payout),
    winsRank: winResult.placeholders.winsRank
   },
   rankingList: winResult.rankingList
  };
 }

 private playGame(): GameResult {
  // 複数回試行してベスト結果を探す
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
   const boost = this.calculateBoost();
   const reels = this.generateReels(attempt, boost);
   const result = this.calculateResult(reels, attempt);

   if (result.payout > 0) {
    return { ...result, hasBoost: boost > 0 };
   }
  }

  return this.createEmptyResult();
 }

 private calculateBoost(): number {
  if (Math.random() < BOOST_PROBABILITY) {
   return Math.floor((Math.random() * TOTAL_WEIGHT * 2) / 3);
  }
  return 0;
 }

 private generateReels(attempt: number, boost: number): number[][] {
  const reelCount = 5;

  return Array.from({ length: reelCount }, () => {
   const symbolCounts = new Array(SYMBOLS.length).fill(0);
   const maxSymbolsPerReel = 7 + attempt * attempt;
   const numSymbols = Math.floor(Math.random() * maxSymbolsPerReel) + 1;
   const multiplier = Math.max(Math.floor(Math.random() * attempt * 2.5), 1);

   for (let i = 0; i < numSymbols; i++) {
    const selectedSymbolIdx = this.selectSymbolByWeight(boost);
    symbolCounts[selectedSymbolIdx] += multiplier;
   }

   return symbolCounts;
  });
 }

 private selectSymbolByWeight(boost: number): number {
  let randomValue = Math.floor(Math.random() * (TOTAL_WEIGHT - boost)) + boost;

  for (let symbolIdx = 0; symbolIdx < SYMBOLS.length; symbolIdx++) {
   randomValue -= SYMBOLS[symbolIdx].weight;
   if (randomValue < 0) {
    return symbolIdx;
   }
  }

  return SYMBOLS.length - 1; // フォールバック
 }

 private calculateResult(reels: number[][], attempt: number): Omit<GameResult, 'hasBoost'> {
  let bestResult = this.createEmptyResult();

  for (let symbolIdx = 0; symbolIdx < SYMBOLS.length; symbolIdx++) {
   const ways = this.calculateWays(reels, symbolIdx);

   if (ways.length < MIN_REELS_FOR_WIN) {
    continue;
   }

   const payout = this.calculatePayout(symbolIdx, ways);

   if (payout > bestResult.payout) {
    bestResult = {
     symbolIdx,
     symbol: this.generateSymbolDisplay(symbolIdx, attempt),
     name: SYMBOLS[symbolIdx].name,
     ways,
     payout,
     hasBoost: false
    };
   }
  }

  return bestResult;
 }

 private calculateWays(reels: number[][], symbolIdx: number): number[] {
  const ways: number[] = [];

  // 最初の3リールに必要
  if (!reels[0][symbolIdx] || !reels[1][symbolIdx] || !reels[2][symbolIdx]) {
   return ways;
  }

  // 連続するリール数を計算
  for (let reelIdx = 0; reelIdx < reels.length && reels[reelIdx][symbolIdx]; reelIdx++) {
   ways.push(reels[reelIdx][symbolIdx]);
  }

  return ways;
 }

 private calculatePayout(symbolIdx: number, ways: number[]): number {
  const symbol = SYMBOLS[symbolIdx];
  const payoutIdx = Math.min(ways.length - MIN_REELS_FOR_WIN, symbol.payouts.length - 1);
  const basePayout = symbol.payouts[payoutIdx];
  const totalLines = ways.reduce((total, lineCount) => total * lineCount, 1);

  return Math.min(Math.floor(basePayout * totalLines), MAX_WIN);
 }

 private generateSymbolDisplay(symbolIdx: number, attempt: number): string {
  return SYMBOLS[symbolIdx].icon.repeat(attempt);
 }

 private createEmptyResult(): GameResult {
  return {
   symbolIdx: 0,
   symbol: '',
   name: '',
   ways: [],
   payout: 0,
   hasBoost: false
  };
 }

 private createMessage(user: string, result: GameResult): string {
  if (result.payout === 0) {
   return `${user}のかけざんスピン!残念、配当0でした。`;
  }

  const symbol = SYMBOLS[result.symbolIdx];
  const waysStr = result.ways.join('×');
  const basePayout =
   symbol.payouts[Math.min(result.ways.length - MIN_REELS_FOR_WIN, symbol.payouts.length - 1)];
  const totalLines = result.ways.reduce((total: number, lineCount: number) => total * lineCount, 1);
  const winMessage = this.getWinMessage(result.payout);

  return (
   `${user}の${result.hasBoost ? '⚡️' : ''}${result.symbol}${result.name}スピン!` +
   `${basePayout}配当、${waysStr}=${totalLines}通り。` +
   `${winMessage}${result.payout}枚獲得!`
  );
 }

 private getWinMessage(payout: number): string {
  const winMessageEntry = WIN_MESSAGES.find(([threshold]) => payout >= threshold);
  return winMessageEntry ? winMessageEntry[1] : '';
 }
}

const execute = new ExecuteScript();
export default execute;
