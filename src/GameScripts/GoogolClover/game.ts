// src\GameScripts\GoogolClover\game.ts

// 状態管理用の型定義
interface UserState {
  funds: number
  exp: number
}

// ゲーム結果の型定義
interface SlotResult {
  message: string
  symbol: string
  payout: number
  party: string
}

export class SlotGame {
  // 目標桁数
  private readonly GOAL_EXPONENT = 99

  // 成功役テーブル
  private readonly REWARD_TABLE = [
    { name: 'チェリー', rate: 0.25, min: 10, max: 11, symbol: '🍒' },
    { name: 'オレンジ', rate: 0.2, min: 14, max: 16, symbol: '🍊' },
    { name: 'プラム', rate: 0.15, min: 20, max: 30, symbol: '🍑' },
    { name: 'スイカ', rate: 0.1, min: 30, max: 50, symbol: '🍉' },
    { name: 'ベル', rate: 0.09, min: 50, max: 100, symbol: '🔔' },
    { name: 'バー', rate: 0.08, min: 100, max: 200, symbol: '💎' },
    { name: 'ダイヤ', rate: 0.06, min: 200, max: 500, symbol: '💠' },
    { name: 'セブン', rate: 0.05, min: 500, max: 1000, symbol: '7️⃣' },
  ]

  private readonly FAILURE_RATE = 0.02

  /**
   * ランダムな報酬を抽選
   */
  private getRandomReward(): { name: string; symbol: string; multiplier: number } | null {
    const rand = Math.random()

    // ハズレ判定
    if (rand < this.FAILURE_RATE) {
      return null
    }

    // 成功役の抽選
    let cumulative = this.FAILURE_RATE
    for (const reward of this.REWARD_TABLE) {
      cumulative += reward.rate
      if (rand < cumulative) {
        const multiplier = reward.min + Math.random() * (reward.max - reward.min)
        return { name: reward.name, symbol: reward.symbol, multiplier }
      }
    }

    // フォールバック
    const lastReward = this.REWARD_TABLE[this.REWARD_TABLE.length - 1]
    return {
      name: lastReward.name,
      symbol: lastReward.symbol,
      multiplier: lastReward.min + Math.random() * (lastReward.max - lastReward.min),
    }
  }

  /**
   * スロット1回分の抽選
   */
  private spinSlot(): { isSuccess: boolean; name: string; symbol: string; multiplier: number } {
    const result = this.getRandomReward()

    if (result === null) {
      return { isSuccess: false, name: 'ハズレ', symbol: '💣', multiplier: 0 }
    }

    return { isSuccess: true, name: result.name, symbol: result.symbol, multiplier: result.multiplier }
  }

  /**
   * 短縮形式のe表記
   */
  private formatShort(funds: number, exp: number): string {
    return `${funds.toFixed(1)}e${exp}`
  }

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
    const spins = Math.floor(Math.random() * 5) + 3 // 3～7回
    let totalMultiplier = 1.0
    let failedAt = -1
    let symbolsUsed: string[] = []

    for (let i = 0; i < spins; i++) {
      const result = this.spinSlot()

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
      const finalDisplay = this.formatShort(state.funds, state.exp)
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
    if (state.exp >= this.GOAL_EXPONENT) {
      const finalDisplay = this.formatShort(state.funds, state.exp)
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
    const currentDisplay = this.formatShort(state.funds, state.exp)
    const symbolDisplay = symbolsUsed.join('')

    return {
      message: `🎊${spins}連勝 +${wonPercent}% 計${currentDisplay}`,
      symbol: symbolDisplay,
      payout: Math.floor((totalMultiplier - 1) * 1000), // 増加分をポイント化
      party: '!bombSuccess',
    }
  }
}
