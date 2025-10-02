// src\MainGenerator\scripts\VariablePlaceholder\BuiltinFunctionProcessor.ts

/**
 * 組み込み関数を処理するクラス
 */
export class BuiltinFunctionProcessor {
  private currentRank?: number
  private valuesLength?: number

  /**
   * コンテキストを設定
   */
  setContext(rankingScore?: number, valuesLength?: number): void {
    this.currentRank = rankingScore
    this.valuesLength = valuesLength
  }

  /**
   * 組み込み関数を処理
   * {{rank}}, {{rand(min,max)}}, {{select(選択肢1,選択肢2,...)}}
   */
  process(text: string): string {
    let processedText = text

    // rank処理
    if (this.currentRank !== undefined) {
      processedText = processedText.replace(/\{\{rank\}\}/g, String(this.currentRank))
    } else {
      processedText = processedText.replace(/\{\{rank\}\}/g, '-')
    }

    // rand関数処理
    processedText = processedText.replace(/\{\{rand\((\d+),(\d+)\)\}\}/g, (match, minStr, maxStr) => {
      const min = parseInt(minStr, 10)
      const max = parseInt(maxStr, 10)

      if (isNaN(min) || isNaN(max) || min > max) {
        console.warn(`無効なrand関数パラメータ: ${match}`)
        return match
      }

      return String(this.randomInt(min, max))
    })

    // select関数処理（カンマ区切りの選択肢からランダムに1つ選ぶ）
    processedText = processedText.replace(/\{\{select\(([^)]+)\)\}\}/g, (match, optionsStr) => {
      try {
        // カンマで分割して選択肢を取得
        const options = optionsStr
          .split(',')
          .map((opt: string) => opt.trim())
          .filter((opt: string) => opt.length > 0)

        if (options.length === 0) {
          console.warn(`select関数に有効な選択肢がありません: ${match}`)
          return match
        }

        // ランダムに1つ選択
        const selectedIndex = Math.floor(Math.random() * options.length)
        return options[selectedIndex]
      } catch (error) {
        console.warn(`select関数の処理に失敗しました: ${match}`, error)
        return match
      }
    })

    return processedText
  }

  /**
   * 指定範囲の乱数生成
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
