// src/GameScripts/GoogolClover/game.ts
import { GOAL_EXPONENT } from './constants'
import type { UserState, SlotResult } from './types'
import { formatShort, spinSlot } from './utils'

export class SlotGame {
  /**
   * メイン関数：スロットゲームを実行
   * @param userStates ユーザー状態を管理するMap（ExecuteScriptから渡される）
   * @param userId ユーザーID（comment.data.userIdから取得）
   * @returns SlotResult 型の結果
   */
  playSlot(userStates: Map<string, UserState>, userId: string): SlotResult {
    // 状態の取得または初期化
    let state = userStates.get(userId)

    if (!state) {
      // 初回プレイ
      state = { funds: 1.0, exp: 0 }
    }

    // ランダムに3～7回の抽選を一括実行
    // TODO:ここは定数化
    const spins = Math.floor(Math.random() * 6) + 10 // 3～7回
    let totalMultiplier = 1.0
    let failedAt = -1
    let symbolsUsed: string[] = []

    for (let i = 0; i < spins; i++) {
      const result = spinSlot()

      if (!result.isSuccess) {
        // 失敗：ゲームオーバー
        failedAt = i + 1
        symbolsUsed.push(result.symbol)
        break
      }

      // 成功：倍率を累積
      totalMultiplier *= 1 + result.multiplier
      symbolsUsed.push(result.symbol)
    }

    // 失敗した場合
    if (failedAt > 0) {
      const finalDisplay = formatShort(state.funds, state.exp)
      userStates.delete(userId) // 状態削除
      const symbolDisplay = symbolsUsed.join('')

      return {
        message: `💣終了 ${finalDisplay} (${failedAt}回目失敗)`,
        symbol: symbolDisplay,
        payout: 0,
        party: '!bombFail',
      }
    }

    // 全て成功：資金を更新
    state.funds *= totalMultiplier

    // 正規化（funds を 1.0～10.0 の範囲に）
    while (state.funds >= 10) {
      state.funds /= 10
      state.exp++
    }

    // 目標達成チェック
    if (state.exp >= GOAL_EXPONENT) {
      const finalDisplay = formatShort(state.funds, state.exp)
      userStates.delete(userId) // クリア後は状態削除
      const symbolDisplay = symbolsUsed.join('')

      return {
        message: `🌟達成! ${finalDisplay} ${spins}連勝でクリア!`,
        symbol: symbolDisplay,
        payout: Math.floor(state.funds * Math.pow(10, state.exp % 10)), // 適当なポイント値
        party: '!bombWin',
      }
    }

    // 状態を保存
    userStates.set(userId, state)

    // 結果表示（150文字以内）
    const wonPercent = ((totalMultiplier - 1) * 100).toFixed(0)
    const currentDisplay = formatShort(state.funds, state.exp)
    const symbolDisplay = symbolsUsed.join('')

    return {
      message: `🎊${spins}連勝 +${wonPercent}% 計${currentDisplay}`,
      symbol: symbolDisplay,
      payout: Math.floor((totalMultiplier - 1) * 1000), // 増加分をポイント化
      party: '!bombSuccess',
    }
  }
}
