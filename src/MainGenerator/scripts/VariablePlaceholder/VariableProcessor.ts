// src/MainGenerator/scripts/VariablePlaceholder/VariableProcessor.ts
import { ExpressionEvaluator } from './ExpressionEvaluator'
import {
  CALC_PATTERN,
  RAND_PATTERN,
  RESERVED_KEYS,
  VAR_DECLARATION_PATTERN,
  VAR_REFERENCE_PATTERN,
} from './ReservedKeys'

/**
 * process メソッドの返り値型
 */
export interface ProcessResult {
  bubble: string
  [key: string]: string | number
}

/**
 * 変数プレースホルダー処理エンジン
 * {{var variableName = value}}, {{variableName}}, {{rand(min,max)}}, {{calc varName op= expr}}を処理
 */
export class VariablePlaceholderProcessor {
  constructor(private evaluator: ExpressionEvaluator) {}

  /**
   * テキスト内のプレースホルダーを処理
   * 処理順序: 改行除去 → var宣言 → calc → 変数参照 → 組み込み関数
   */
  process(text: string): ProcessResult {
    // 改行を除去
    let processed = text.replace(/\n/g, '')

    // 1: 変数宣言を処理
    processed = this.processVariableDeclarations(processed)

    // 2: calc関数を処理
    processed = this.processCalcFunction(processed)

    // 3: 変数参照を処理
    processed = this.processVariableReferences(processed)

    // 4: rand関数を処理
    processed = this.processRandFunction(processed)

    // すべての処理した変数を取得
    const allVars = this.evaluator.getAll()

    // 予約語の削除
    for (const key of RESERVED_KEYS) this.evaluator.remove(key)

    return { ...allVars, bubble: processed }
  }

  /**
   * 変数宣言を処理 {{var name = value}}
   */
  private processVariableDeclarations(text: string): string {
    return text.replace(VAR_DECLARATION_PATTERN, (match, varName, expression) => {
      try {
        const value = this.evaluator.evaluate(expression.trim())
        this.evaluator.set(varName, value)
        return '' // 宣言は削除
      } catch (error) {
        console.warn(`変数宣言の評価に失敗: ${match}`, error)
        return match
      }
    })
  }

  /**
   * calc関数を処理 {{calc varName += expr}}
   */
  private processCalcFunction(text: string): string {
    return text.replace(CALC_PATTERN, (match, varName, operator, expression) => {
      try {
        this.evaluator.calculate(varName, operator, expression.trim())
        return '' // calc宣言は削除
      } catch (error) {
        console.warn(`calc関数の評価に失敗: ${match}`, error)
        return match
      }
    })
  }

  /**
   * 変数参照を処理 {{variableName}}
   */
  private processVariableReferences(text: string): string {
    return text.replace(VAR_REFERENCE_PATTERN, (match, varName) => {
      if (this.evaluator.has(varName)) {
        return String(this.evaluator.get(varName))
      }
      console.warn(`未定義の変数: ${varName}`)
      return match
    })
  }

  /**
   * rand関数を処理 {{rand(min,max)}}
   */
  private processRandFunction(text: string): string {
    return text.replace(RAND_PATTERN, (match, minStr, maxStr) => {
      let min = parseInt(minStr, 10)
      let max = parseInt(maxStr, 10)
      if (isNaN(min) || isNaN(max)) {
        console.warn(`無効なrand関数: ${match}`)
        return match
      }
      if (min > max) [min, max] = [max, min]
      return String(this.evaluator.evaluate(`rand(${min},${max})`))
    })
  }
}
