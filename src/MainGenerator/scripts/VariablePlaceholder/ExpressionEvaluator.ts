// src/MainGenerator/scripts/VariablePlaceholder/ExpressionEvaluator.ts
import { Parser } from 'expr-eval-fork'
import { KeyValueMap } from '@main/scripts/KeyValue/KeyValueMap'

const MAX_VALUE = 999999999
const MIN_VALUE = -999999999

/**
 * expr-eval-fork ベースの式評価エンジン
 *
 * v2 設計方針:
 * - {{ }} の中身はすべて式として評価する
 * - 代入・複合代入・三項演算子・関数呼び出しをサポート
 * - 未定義変数は 0 として扱う
 * - 文字列はシングルクォートで明示する
 *
 * v1 互換（非推奨）:
 * - var タグ・rand タグは後方互換のため動作を維持
 */
export class ExpressionEvaluator extends KeyValueMap {
  private readonly parser: Parser

  constructor() {
    super()
    this.parser = new Parser({
      operators: {
        assignment: true, // v2: 式内代入を許可
        logical: true,
        comparison: true,
        in: false,
      },
    })

    // ホワイトリスト関数: rand
    this.parser.functions.rand = (min: number, max: number): number => {
      const lo = Math.min(min, max)
      const hi = Math.max(min, max)
      return Math.floor(Math.random() * (hi - lo + 1)) + lo
    }

    // str / num / bool
    this.parser.functions.str = (...args: any[]) => args.map((v) => String(v)).join('')

    this.parser.functions.num = (v: any) => {
      const n = Number(v)
      return isNaN(n) ? 0 : n
    }

    this.parser.functions.bool = (v: any) => {
      return Number(v) !== 0 ? 1 : 0
    }
  }

  /**
   * 式を評価してステートを更新し、結果を返す
   *
   * セミコロン区切りで複数式を記述可能。
   * 最後の式の評価結果を返す。
   * 代入式の結果は空文字（テキストに出力しない）。
   *
   * 例:
   *   "score = 0"                          → state更新、出力なし
   *   "score += 10"                        → state更新、出力なし
   *   "result = score >= 50 ? 'A' : 'B'"  → state更新、出力なし
   *   "a = 1; b = 2; c = a + b"           → state更新、出力なし
   *   "rand(1, 10)"                        → 数値を返す（出力あり）
   */
  evaluateExpression(expression: string): { output: string; hasOutput: boolean } {
    const trimmed = expression.trim()

    // セミコロン区切りで複数式を処理
    const statements = trimmed
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)

    let lastResult: string | number | boolean = ''
    let hasAssignment = false

    for (const statement of statements) {
      const isAssignment = /[a-zA-Z_][a-zA-Z0-9_]*\s*[\+\-\*\/]?=/.test(statement)
      if (isAssignment) hasAssignment = true

      const result = this.evaluateSingle(statement)
      lastResult = result
    }

    // 代入式はテキストに出力しない
    if (hasAssignment) {
      return { output: '', hasOutput: false }
    }

    return { output: String(lastResult), hasOutput: true }
  }

  /**
   * 単一の式を評価してステートを更新
   */
  private evaluateSingle(expression: string): string | number | boolean {
    const trimmed = expression.trim()

    try {
      const context = this.buildContext()

      // 式中の未定義変数を事前に 0 で補完
      const expr = this.parser.parse(trimmed)
      for (const varName of expr.variables()) {
        if (!(varName in context)) {
          context[varName] = 0
        }
      }

      const result = expr.evaluate(context)

      // 代入式の場合、ステートを更新
      const assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*[\+\-\*\/]?=/)
      if (assignMatch) {
        const varName = assignMatch[1]
        if (varName in context) {
          const newValue = context[varName]
          const clamped = this.clampIfNumber(newValue)
          this.set(varName, clamped)
        }
      }

      return result
    } catch (error) {
      throw new Error(`式の評価に失敗しました: "${trimmed}" - ${error}`)
    }
  }

  /**
   * 数値なら範囲クランプ・丸めを適用、文字列はそのまま返す
   */
  private clampIfNumber(value: string | number | boolean): string | number {
    if (typeof value === 'boolean') return value ? 1 : 0
    if (typeof value !== 'number') return value
    const rounded = Math.round(value * 100) / 100
    return Math.max(MIN_VALUE, Math.min(MAX_VALUE, rounded))
  }

  /**
   * 全変数を expr-eval-fork のコンテキストとして構築
   */
  private buildContext(): Record<string, string | number> {
    const context: Record<string, string | number> = {}
    for (const [key, value] of Object.entries(this.getAll())) {
      if (typeof value === 'number') {
        context[key] = value
      } else {
        const num = parseFloat(value)
        context[key] = isNaN(num) ? value : num
      }
    }
    return context
  }

  // ----------------------------------------------------------------
  // v1 互換メソッド（非推奨）
  // ----------------------------------------------------------------

  /**
   * @deprecated v2 では evaluateExpression を使用してください
   * var タグの右辺評価（後方互換）
   */
  evaluateVarRhs(expression: string): string | number {
    const trimmed = expression.trim()

    const singleQuoteMatch = trimmed.match(/^'(.*)'$/)
    if (singleQuoteMatch) return singleQuoteMatch[1]

    const numMatch = trimmed.match(/^-?\d+(\.\d+)?$/)
    if (numMatch) return parseFloat(trimmed)

    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed) && this.has(trimmed)) {
      return this.get(trimmed)!
    }

    return trimmed
  }

  toNumber(value: string | number): number {
    if (typeof value === 'number') return value
    const num = parseFloat(value)
    return isNaN(num) ? 0 : num
  }
}
