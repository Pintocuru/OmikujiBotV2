// src/MainGenerator/scripts/VariablePlaceholder/ExpressionEvaluator.ts
import { KeyValueMap } from '@main/scripts/KeyValue/KeyValueMap'

/**
 * 式評価エンジン
 * 変数の管理と式の評価を担当
 */
export class ExpressionEvaluator extends KeyValueMap {
  /**
   * 式を評価して値を返す
   */
  evaluate(expression: string): string | number {
    const trimmed = expression.trim()

    // rand(min, max)関数
    const randMatch = trimmed.match(/^rand\((\d+),(\d+)\)$/)
    if (randMatch) {
      const min = parseInt(randMatch[1], 10)
      const max = parseInt(randMatch[2], 10)
      if (isNaN(min) || isNaN(max) || min > max) {
        throw new Error(`無効なrandパラメータ: ${expression}`)
      }
      return this.randomInt(min, max)
    }

    // 数値リテラル
    const numMatch = trimmed.match(/^-?\d+(\.\d+)?$/)
    if (numMatch) {
      return parseFloat(trimmed)
    }

    // 文字列リテラル（クォートあり）
    const stringMatch = trimmed.match(/^["'](.*)["']$/)
    if (stringMatch) {
      return stringMatch[1]
    }

    // 変数参照
    if (this.has(trimmed)) {
      return this.get(trimmed)!
    }

    // その他は文字列として扱う
    return trimmed
  }

  /**
   * 指定範囲の乱数生成
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
