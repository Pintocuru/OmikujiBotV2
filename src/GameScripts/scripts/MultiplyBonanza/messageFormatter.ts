// src/GameScripts/scripts/MultiplyBonanza/messageFormatter.ts
import { GAME_CONFIG, SYMBOLS, WIN_MESSAGES, GameResult } from './gameConfig'

/**
 * メッセージ生成を管理するクラス
 */
export class MessageFormatter {
  /**
   * ゲーム結果からメッセージを生成する
   */
  createMessage(user: string, result: GameResult): string {
    if (result.payout === 0) {
      return `${user}の桜吹雪スピン!残念、配当0でした。`
    }

    const symbol = SYMBOLS[result.symbolIdx]
    const waysStr = result.ways.join('×')
    const basePayout = this.getBasePayout(symbol, result.ways.length)
    const totalLines = this.calculateTotalLines(result.ways)
    const winMessage = this.getWinMessage(result.payout)

    return (
      `${user}の${result.hasBoost ? '⚡️' : ''}${result.symbol}${result.name}スピン!` +
      `${basePayout}配当、${waysStr}=${totalLines}通り。` +
      `${winMessage}${result.payout}枚獲得!`
    )
  }

  /**
   * 基本配当を取得する
   */
  private getBasePayout(symbol: (typeof SYMBOLS)[number], waysLength: number): number {
    const payoutIdx = Math.min(waysLength - GAME_CONFIG.MIN_REELS_FOR_WIN, symbol.payouts.length - 1)
    return symbol.payouts[payoutIdx]
  }

  /**
   * 総ライン数を計算する
   */
  private calculateTotalLines(ways: number[]): number {
    return ways.reduce((total, lineCount) => total * lineCount, 1)
  }

  /**
   * 配当額に応じた勝利メッセージを取得する
   */
  private getWinMessage(payout: number): string {
    const winMessageEntry = WIN_MESSAGES.find(([threshold]) => payout >= threshold)
    return winMessageEntry ? winMessageEntry[1] : ''
  }
}
