// src/MainGenerator/scripts/VariablePlaceholder/VariableProcessor.ts
import { ExpressionEvaluator } from './ExpressionEvaluator'
import {
  RAND_PATTERN,
  RESERVED_KEYS,
  SELECT_PATTERN,
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
 * {{var variableName = value}}, {{variableName}}, {{rand(min,max)}}, {{select(opt1,opt2,...)}}を処理
 */
export class VariablePlaceholderProcessor {
  constructor(private evaluator: ExpressionEvaluator) {}

  /**
   * テキスト内のプレースホルダーを処理
   * 処理順序: 改行除去 → var宣言 → 変数参照 → 組み込み関数
   */
  process(text: string): ProcessResult {
    // 改行を除去
    let processed = text.replace(/\n/g, '')

    // 1: 変数宣言を処理
    processed = this.processVariableDeclarations(processed)

    // 2: 変数参照を処理
    processed = this.processVariableReferences(processed)

    // 3: rand関数を処理
    processed = this.processRandFunction(processed)

    // 4: select関数を処理
    processed = this.processSelectFunction(processed)

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
    const declarationRegex = /\{\{var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*?)\}\}/g

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
      const min = parseInt(minStr, 10)
      const max = parseInt(maxStr, 10)
      if (isNaN(min) || isNaN(max) || min > max) {
        console.warn(`無効なrand関数: ${match}`)
        return match
      }
      return String(this.evaluator.evaluate(`rand(${min},${max})`))
    })
  }

  /**
   * select関数を処理 {{select(opt1,opt2,...)}}
   */
  private processSelectFunction(text: string): string {
    return text.replace(SELECT_PATTERN, (match, optionsStr) => {
      try {
        const options = optionsStr
          .split(',')
          .map((opt: string) => opt.trim())
          .filter((opt: string) => opt.length > 0)

        if (options.length === 0) {
          console.warn(`select関数に有効な選択肢がありません: ${match}`)
          return match
        }

        const index = Math.floor(Math.random() * options.length)
        return options[index]
      } catch (error) {
        console.warn(`select関数の処理に失敗: ${match}`, error)
        return match
      }
    })
  }
}
