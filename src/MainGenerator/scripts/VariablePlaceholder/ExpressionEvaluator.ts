// src/MainGenerator/scripts/VariablePlaceholder/ExpressionEvaluator.ts

/**
 * 式評価エンジン
 * 変数の管理と式の評価を担当
 */
export class ExpressionEvaluator {
  private variables: Map<string, string | number> = new Map()

  /**
   * 変数をクリア
   */
  clear(): void {
    this.variables.clear()
  }

  /**
   * 変数を設定
   */
  setVariable(name: string, value: string | number): void {
    this.variables.set(name, value)
  }

  /**
   * 変数を取得
   */
  getVariable(name: string): string | number | undefined {
    return this.variables.get(name)
  }

  /**
   * 変数の存在確認
   */
  hasVariable(name: string): boolean {
    return this.variables.has(name)
  }

  /**
   * すべての変数を取得
   */
  getAllVariables(): Record<string, string | number> {
    return Object.fromEntries(this.variables)
  }

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
    if (this.variables.has(trimmed)) {
      return this.variables.get(trimmed)!
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
