// src/game.ts
import { GameResult } from './params';
import { GAME_CONFIG, SYMBOLS, TOTAL_WEIGHT, WIN_MESSAGES } from './gameConfig';

export class GameEngine {
 /**
  * ゲームを実行してベストな結果を返す
  * 最大試行回数分試行し、配当が出た時点で結果を返す
  */
 playGame(): GameResult {
  // 複数回試行してベスト結果を探す
  for (let attempt = 1; attempt <= GAME_CONFIG.MAX_ATTEMPTS; attempt++) {
   const boost = this.calculateBoost();
   const reels = this.generateReels(attempt, boost);
   const result = this.calculateResult(reels, attempt);

   if (result.payout > 0) {
    return { ...result, hasBoost: boost > 0 };
   }
  }

  return this.createEmptyResult();
 }

 /**
  * ゲーム結果からメッセージを生成する
  */
 createMessage(user: string, result: GameResult): string {
  if (result.payout === 0) {
   return `${user}のかけざんスピン!残念、配当0でした。`;
  }

  const symbol = SYMBOLS[result.symbolIdx];
  const waysStr = result.ways.join('×');
  const basePayout =
   symbol.payouts[
    Math.min(result.ways.length - GAME_CONFIG.MIN_REELS_FOR_WIN, symbol.payouts.length - 1)
   ];
  const totalLines = result.ways.reduce((total: number, lineCount: number) => total * lineCount, 1);
  const winMessage = this.getWinMessage(result.payout);

  return (
   `${user}の${result.hasBoost ? '⚡️' : ''}${result.symbol}${result.name}スピン!` +
   `${basePayout}配当、${waysStr}=${totalLines}通り。` +
   `${winMessage}${result.payout}枚獲得!`
  );
 }

 /**
  * ブースト値を計算する（確率でボーナスを付与）
  */
 private calculateBoost(): number {
  if (Math.random() < GAME_CONFIG.BOOST_PROBABILITY) {
   return Math.floor((Math.random() * TOTAL_WEIGHT * 2) / 3);
  }
  return 0;
 }

 /**
  * 全リールを生成する
  * 試行回数に応じてシンボル数と倍率が増加
  */
 private generateReels(attempt: number, boost: number): number[][] {
  return Array.from({ length: GAME_CONFIG.REEL_COUNT }, () => {
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

 /**
  * 重み付けでシンボルを選択する
  * ブースト値分だけ高レアリティが出やすくなる
  */
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

 /**
  * リールから最適な結果を計算する
  * 全シンボルについて配当を計算し、最高配当を返す
  */
 private calculateResult(reels: number[][], attempt: number): Omit<GameResult, 'hasBoost'> {
  let bestResult = this.createEmptyResult();

  for (let symbolIdx = 0; symbolIdx < SYMBOLS.length; symbolIdx++) {
   const ways = this.calculateWays(reels, symbolIdx);

   if (ways.length < GAME_CONFIG.MIN_REELS_FOR_WIN) {
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

 /**
  * 指定シンボルのウェイ数を計算する
  * 最初の3リールに必須、連続するリール数をカウント
  */
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

 /**
  * 配当を計算する（基本配当 × ライン数）
  * 上限額で制限される
  */
 private calculatePayout(symbolIdx: number, ways: number[]): number {
  const symbol = SYMBOLS[symbolIdx];
  const payoutIdx = Math.min(
   ways.length - GAME_CONFIG.MIN_REELS_FOR_WIN,
   symbol.payouts.length - 1
  );
  const basePayout = symbol.payouts[payoutIdx];
  const totalLines = ways.reduce((total, lineCount) => total * lineCount, 1);

  return Math.min(Math.floor(basePayout * totalLines), GAME_CONFIG.MAX_WIN);
 }

 /**
  * シンボル表示を生成する（試行回数分繰り返し）
  */
 private generateSymbolDisplay(symbolIdx: number, attempt: number): string {
  return SYMBOLS[symbolIdx].icon.repeat(attempt);
 }

 /**
  * 空の結果を作成する（配当なしの場合）
  */
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

 /**
  * 配当額に応じた勝利メッセージを取得する
  */
 private getWinMessage(payout: number): string {
  const winMessageEntry = WIN_MESSAGES.find(([threshold]) => payout >= threshold);
  return winMessageEntry ? winMessageEntry[1] : '';
 }
}
