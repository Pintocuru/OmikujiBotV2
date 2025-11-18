// src/markovBot.ts

/**
 * マルコフ連鎖を実装するクラス
 */
export class MarkovBot {
  private chain: Map<string, string[]> = new Map()
  private readonly ORDER = 3 // N-gram のサイズ（2-gram）

  /**
   * コーパスからマルコフ連鎖のチェーンを構築
   */
  private buildChain(corpus: string[]): void {
    this.chain.clear()

    for (const text of corpus) {
      // テキストを文字の配列に分割
      const chars = Array.from(text)

      // N-gramを生成してチェーンに追加
      for (let i = 0; i < chars.length - this.ORDER; i++) {
        const state = chars.slice(i, i + this.ORDER).join('')
        const nextChar = chars[i + this.ORDER]

        if (!this.chain.has(state)) {
          this.chain.set(state, [])
        }
        this.chain.get(state)!.push(nextChar)
      }
    }
  }

  /**
   * チェーンから次の文字をランダムに選択
   */
  private getNextChar(state: string): string | null {
    const nextChars = this.chain.get(state)
    if (!nextChars || nextChars.length === 0) return null

    const randomIndex = Math.floor(Math.random() * nextChars.length)
    return nextChars[randomIndex]
  }

  /**
   * 開始状態をランダムに選択
   */
  private getRandomStartState(): string {
    const states = Array.from(this.chain.keys())
    const randomIndex = Math.floor(Math.random() * states.length)
    return states[randomIndex]
  }

  /**
   * マルコフ連鎖でテキストを生成
   * @param corpus 学習用テキストの配列
   * @param targetLength 目標文字数
   * @param maxRetries 最大リトライ回数
   */
  generate(corpus: string[], targetLength: number = 50, maxRetries: number = 3): string {
    this.buildChain(corpus)

    let bestResult = ''

    // 複数回試行して最も良い結果を採用
    for (let retry = 0; retry < maxRetries; retry++) {
      let currentState = this.getRandomStartState()
      let result = currentState

      // 目標文字数+20文字まで生成を試みる
      while (result.length < targetLength) {
        const nextChar = this.getNextChar(currentState)

        if (!nextChar) {
          // 次の文字が見つからない場合は新しい開始点から再開
          currentState = this.getRandomStartState()
          continue
        }

        result += nextChar
        currentState = result.slice(-this.ORDER)

        // 目標文字数に達し、句読点で終わっている場合は終了
        if (result.length >= targetLength) {
          const lastChar = result.slice(-1)
          if (lastChar === '。' || lastChar === '!' || lastChar === '?') {
            break
          }
        }
      }

      // より良い結果を保存
      if (result.length >= targetLength && result.length > bestResult.length) {
        bestResult = result
      }

      // 目標文字数付近で良い結果が得られたら終了
      if (bestResult.length >= targetLength && bestResult.length <= targetLength + 30) {
        break
      }
    }

    // 結果を整形して返す
    if (bestResult.length > targetLength) {
      // 長すぎる場合は適切な位置でカット
      const truncated = bestResult.slice(0, targetLength + 30)
      const lastPunctuation = Math.max(
        truncated.lastIndexOf('。'),
        truncated.lastIndexOf('!'),
        truncated.lastIndexOf('?')
      )

      if (lastPunctuation > targetLength - 30) {
        return truncated.slice(0, lastPunctuation + 1)
      }
    }

    return bestResult || 'こんにちは!今日も素敵な一日をお過ごしください!'
  }
}
