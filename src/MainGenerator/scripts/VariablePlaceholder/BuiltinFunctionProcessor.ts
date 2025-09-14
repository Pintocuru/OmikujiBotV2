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
  setContext(rank?: number, valuesLength?: number): void {
    this.currentRank = rank
    this.valuesLength = valuesLength
  }

  /**
   * 組み込み関数を処理
   * {{rank}}, {{rand(min,max)}}など
   */
  process(text: string): string {
    let processedText = text

    // rank処理
    if (this.currentRank !== undefined) {
      processedText = processedText.replace(/\{\{rank\}\}/g, String(this.currentRank))
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

    return processedText
  }

  /**
   * 指定範囲の乱数生成
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
