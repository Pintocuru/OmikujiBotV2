// src/MainGenerator/scripts/VariablePlaceholder/ComparisonParser.ts

/**
 * 比較結果の型
 */
export interface ComparisonResult {
  isValid: boolean
  result?: boolean
  error?: string
}

/**
 * 比較演算子の型
 */
type ComparisonOperator = '>' | '<' | '>=' | '<=' | '==' | '!='

/**
 * 比較式パーサー
 * cond関数の条件部分（例: "score > 100"）を解析・評価
 */
export class ComparisonParser {
  private static readonly OPERATORS: ComparisonOperator[] = ['>=', '<=', '==', '!=', '>', '<']

  /**
   * 比較式を解析して評価
   * @param expression - 比較式（例: "score > 100"）
   * @param getValue - 変数名から値を取得する関数
   * @returns 比較結果
   */
  static parse(expression: string, getValue: (varName: string) => string | number | undefined): ComparisonResult {
    const trimmed = expression.trim()

    // 比較演算子を検出
    const operator = this.findOperator(trimmed)
    if (!operator) {
      return {
        isValid: false,
        error: `比較演算子が見つかりません: ${expression}`,
      }
    }

    // 左辺と右辺に分割
    const parts = trimmed.split(operator)
    if (parts.length !== 2) {
      return {
        isValid: false,
        error: `不正な比較式: ${expression}`,
      }
    }

    const leftSide = parts[0].trim()
    const rightSide = parts[1].trim()

    // 左辺と右辺を評価
    const leftValue = this.evaluateSide(leftSide, getValue)
    const rightValue = this.evaluateSide(rightSide, getValue)

    // 比較実行
    const result = this.compare(leftValue, operator, rightValue)

    return {
      isValid: true,
      result,
    }
  }

  /**
   * 比較演算子を検出（長い演算子から優先的にチェック）
   */
  private static findOperator(expression: string): ComparisonOperator | null {
    for (const op of this.OPERATORS) {
      if (expression.includes(op)) {
        return op
      }
    }
    return null
  }

  /**
   * 左辺または右辺を評価
   * 変数名、数値リテラル、文字列リテラルをサポート
   */
  private static evaluateSide(
    side: string,
    getValue: (varName: string) => string | number | undefined
  ): string | number {
    // 数値リテラル
    const numMatch = side.match(/^-?\d+(\.\d+)?$/)
    if (numMatch) {
      return parseFloat(side)
    }

    // 文字列リテラル（クォートあり）
    const stringMatch = side.match(/^["'](.*)["']$/)
    if (stringMatch) {
      return stringMatch[1]
    }

    // 変数参照
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(side)) {
      const value = getValue(side)
      if (value === undefined) {
        return 0 // 未定義変数は0として扱う
      }
      return value
    }

    // その他は文字列として扱う
    return side
  }

  /**
   * 比較演算を実行
   */
  private static compare(left: string | number, operator: ComparisonOperator, right: string | number): boolean {
    // 数値比較を試みる
    const leftNum = this.toNumber(left)
    const rightNum = this.toNumber(right)

    // 両方が数値として解釈できる場合は数値比較
    if (leftNum !== null && rightNum !== null) {
      return this.compareNumbers(leftNum, operator, rightNum)
    }

    // それ以外は文字列比較
    const leftStr = String(left)
    const rightStr = String(right)
    return this.compareStrings(leftStr, operator, rightStr)
  }

  /**
   * 数値比較
   */
  private static compareNumbers(left: number, operator: ComparisonOperator, right: number): boolean {
    switch (operator) {
      case '>':
        return left > right
      case '<':
        return left < right
      case '>=':
        return left >= right
      case '<=':
        return left <= right
      case '==':
        return left === right
      case '!=':
        return left !== right
      default:
        return false
    }
  }

  /**
   * 文字列比較
   */
  private static compareStrings(left: string, operator: ComparisonOperator, right: string): boolean {
    switch (operator) {
      case '>':
        return left > right
      case '<':
        return left < right
      case '>=':
        return left >= right
      case '<=':
        return left <= right
      case '==':
        return left === right
      case '!=':
        return left !== right
      default:
        return false
    }
  }

  /**
   * 値を数値に変換（変換できない場合はnull）
   */
  private static toNumber(value: string | number): number | null {
    if (typeof value === 'number') return value
    const num = parseFloat(value)
    return isNaN(num) ? null : num
  }
}
