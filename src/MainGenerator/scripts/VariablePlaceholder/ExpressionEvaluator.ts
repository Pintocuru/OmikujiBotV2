// src/MainGenerator/scripts/VariablePlaceholder/ExpressionEvaluator.ts
import { KeyValueMap } from '@main/scripts/KeyValue/KeyValueMap'

const MAX_VALUE = 999999999
const MIN_VALUE = -999999999

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
    if (numMatch) return parseFloat(trimmed)

    // 文字列リテラル（クォートあり）
    const stringMatch = trimmed.match(/^["'](.*)["']$/)
    if (stringMatch) return stringMatch[1]

    // 変数参照
    if (this.has(trimmed)) return this.get(trimmed)!

    // その他は文字列として扱う
    return trimmed
  }

  /**
   * calc演算を実行
   * 変数が存在しない場合や数値でない場合は0として扱う
   */
  calculate(varName: string, operator: string, expression: string): number {
    // 現在の変数値を取得（存在しない or 数値でない場合は0）
    const currentValue = this.getNumericValue(varName)

    // 式を評価して数値を取得
    const evaluatedValue = this.evaluate(expression)
    const operand = this.toNumber(evaluatedValue)

    // 演算実行
    let result: number
    switch (operator) {
      case '+':
        result = currentValue + operand
        break
      case '-':
        result = currentValue - operand
        break
      case '*':
        result = currentValue * operand
        break
      case '/':
        result = operand !== 0 ? currentValue / operand : currentValue
        break
      default:
        throw new Error(`無効な演算子: ${operator}`)
    }

    // 小数点以下を0.01まで丸める
    result = Math.round(result * 100) / 100

    // 上限・下限でクランプ
    result = Math.max(MIN_VALUE, Math.min(MAX_VALUE, result))

    // 変数に値を設定
    this.set(varName, result)

    return result
  }

  /**
   * 変数から数値を取得（存在しない or 数値でない場合は0）
   */
  private getNumericValue(varName: string): number {
    if (!this.has(varName)) return 0
    const value = this.get(varName) ?? 0
    return this.toNumber(value)
  }

  /**
   * 値を数値に変換（変換できない場合は0）
   */
  private toNumber(value: string | number): number {
    if (typeof value === 'number') return value
    const num = parseFloat(value)
    return isNaN(num) ? 0 : num
  }

  /**
   * 指定範囲の乱数生成
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
