// src\MainGenerator\scripts\VariablePlaceholder\ExpressionEvaluator.ts
import { VariableStore } from './VariableStore'

/**
 * 式を評価するクラス
 */
export class ExpressionEvaluator {
  constructor(private variableStore: VariableStore) {}

  /**
   * 式を評価（現在はrand関数のみサポート）
   */
  evaluate(expression: string): string | number {
    // rand(min, max)関数の処理
    const randMatch = expression.match(/^rand\((\d+),(\d+)\)$/)
    if (randMatch) {
      const min = parseInt(randMatch[1], 10)
      const max = parseInt(randMatch[2], 10)

      if (isNaN(min) || isNaN(max) || min > max) {
        throw new Error(`無効なrandパラメータ: ${expression}`)
      }

      return this.randomInt(min, max)
    }

    // 数値リテラル
    const numMatch = expression.match(/^-?\d+(\.\d+)?$/)
    if (numMatch) {
      return parseFloat(expression)
    }

    // 文字列リテラル（クォートありの場合）
    const stringMatch = expression.match(/^["'](.*)["']$/)
    if (stringMatch) {
      return stringMatch[1]
    }

    // 変数参照
    if (this.variableStore.has(expression)) {
      return this.variableStore.get(expression)!
    }

    // その他は文字列として扱う
    return expression
  }

  /**
   * 指定範囲の乱数生成
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
