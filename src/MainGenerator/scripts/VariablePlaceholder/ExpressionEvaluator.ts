// src/MainGenerator/scripts/VariablePlaceholder/ExpressionEvaluator.ts
import { Parser } from 'expr-eval-fork'
import { KeyValueMap } from '@main/scripts/KeyValue/KeyValueMap'

const MAX_VALUE = 999999999
const MIN_VALUE = -999999999

/**
 * expr-eval-fork を使った式評価エンジン
 *
 * 設計方針:
 * - var の右辺評価・calc の式評価を担当
 * - 副作用（式内代入）は禁止
 * - 未定義変数は 0 として扱う
 */
export class ExpressionEvaluator extends KeyValueMap {
  private readonly parser: Parser

  constructor() {
    super()
    this.parser = new Parser({
      operators: {
        assignment: false, // 式内代入禁止
        logical: true,
        comparison: true,
        in: false,
      },
    })

    // ホワイトリスト: rand 関数
    this.parser.functions.rand = (min: number, max: number): number => {
      const lo = Math.min(min, max)
      const hi = Math.max(min, max)
      return Math.floor(Math.random() * (hi - lo + 1)) + lo
    }
  }

  /**
   * var の右辺を評価する
   *
   * 評価ルール（優先順位順）:
   * 1. 'シングルクォート' → 文字列として保存
   * 2. 数値のみ           → 数値として保存
   * 3. ? を含む           → 三項演算子として式評価
   * 4. 既存の変数名       → その変数の値をコピー
   * 5. その他             → 文字列としてそのまま保存
   *
   * 例:
   *   {{var msg = 'hello'}}                         → "hello"（文字列）
   *   {{var level = 50}}                            → 50（数値）
   *   {{var result = score >= 10 ? 'A' : 'B'}}     → 式評価
   *   {{var copy = source}}                         → source の値をコピー
   *   {{var key = foo_userhoge01}}                  → "foo_userhoge01"（未定義なら文字列）
   */
  evaluateVarRhs(expression: string): string | number {
    const trimmed = expression.trim()

    // 1. シングルクォートで囲まれた文字列
    const singleQuoteMatch = trimmed.match(/^'(.*)'$/)
    if (singleQuoteMatch) return singleQuoteMatch[1]

    // 2. 数値リテラル
    const numMatch = trimmed.match(/^-?\d+(\.\d+)?$/)
    if (numMatch) return parseFloat(trimmed)

    // 3. 三項演算子（? を含む場合は式評価）
    if (trimmed.includes('?')) {
      return this.evaluatePureExpression(trimmed)
    }

    // 4. 既存の変数名
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed) && this.has(trimmed)) {
      return this.get(trimmed)!
    }

    // 5. その他は文字列としてそのまま保存
    return trimmed
  }

  /**
   * calc の右辺を評価する
   * var と異なり、常に式として評価を試みる。未定義変数は 0。
   *
   * 例:
   *   {{calc oldScore = foo_userhoge01}}  → 変数 foo_userhoge01 の値（数値）
   *   {{calc result = a >= 5 ? 1 : 0}}   → 三項演算子も評価可
   */
  evaluateCalcRhs(expression: string): string | number {
    const trimmed = expression.trim()

    // シングルクォートで囲まれた文字列はそのまま返す
    const singleQuoteMatch = trimmed.match(/^'(.*)'$/)
    if (singleQuoteMatch) return singleQuoteMatch[1]

    // 数値リテラル
    const numMatch = trimmed.match(/^-?\d+(\.\d+)?$/)
    if (numMatch) return parseFloat(trimmed)

    // 式評価（変数参照・四則演算・三項演算子など）
    return this.evaluatePureExpression(trimmed)
  }

  /**
   * 純粋式評価（expr-eval-fork に委譲）
   * state をコンテキストとして渡す。未定義変数は 0。
   *
   * expr-eval-fork は未定義変数があると例外を投げるため、
   * .variables() で式中の変数を事前に取得し、
   * コンテキストに存在しないものは 0 で補完してから評価する。
   */
  evaluatePureExpression(expression: string): string | number {
    const trimmed = expression.trim()
    try {
      const context = this.buildContext()

      // 式中の変数を事前取得し、未定義のものを 0 で補完
      const expr = this.parser.parse(trimmed)
      for (const varName of expr.variables()) {
        if (!(varName in context)) {
          context[varName] = 0
        }
      }

      const result = expr.evaluate(context)
      if (typeof result === 'boolean') return result ? 1 : 0
      if (typeof result === 'number' || typeof result === 'string') return result
      return trimmed
    } catch (error) {
      throw new Error(`式の評価に失敗しました: "${trimmed}" - ${error}`)
    }
  }

  /**
   * 複合代入演算を実行（+=, -=, *=, /=）
   * 変数が存在しない・数値でない場合は 0 として扱う
   */
  calculate(varName: string, operator: string, expression: string): number {
    const currentValue = this.getNumericValue(varName)
    const operand = this.toNumber(this.evaluateCalcRhs(expression))

    let result: number
    switch (operator) {
      case '+=':
        result = currentValue + operand
        break
      case '-=':
        result = currentValue - operand
        break
      case '*=':
        result = currentValue * operand
        break
      case '/=':
        result = operand !== 0 ? currentValue / operand : currentValue
        break
      default:
        throw new Error(`無効な演算子: ${operator}`)
    }

    // 小数点以下 0.01 まで丸め、範囲内にクランプ
    result = Math.round(result * 100) / 100
    result = Math.max(MIN_VALUE, Math.min(MAX_VALUE, result))
    this.set(varName, result)
    return result
  }

  /**
   * 全変数を expr-eval-fork のコンテキストとして構築
   * 数値変換できない値は文字列のまま渡す
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

  private getNumericValue(varName: string): number {
    if (!this.has(varName)) return 0
    return this.toNumber(this.get(varName) ?? 0)
  }

  toNumber(value: string | number): number {
    if (typeof value === 'number') return value
    const num = parseFloat(value)
    return isNaN(num) ? 0 : num
  }
}
