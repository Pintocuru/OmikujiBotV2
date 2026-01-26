// src/MainGenerator/scripts/VariablePlaceholder/CondEvaluator.ts
import { ComparisonParser } from './ComparisonParser'

/**
 * cond関数評価器
 * {{cond(condition, trueValue, falseValue)}} の評価を担当
 */
export class CondEvaluator {
  /**
   * cond関数を評価
   * @param condition - 条件式（例: "score > 100" or "is_member"）
   * @param trueValue - 条件が真の場合の値
   * @param falseValue - 条件が偽の場合の値
   * @param getValue - 変数名から値を取得する関数
   * @returns 評価結果
   */
  static evaluate(
    condition: string,
    trueValue: string,
    falseValue: string,
    getValue: (varName: string) => string | number | undefined
  ): string {
    // ネストチェック: trueValue/falseValue に cond( が含まれていたらエラー
    if (this.containsNestedCond(trueValue) || this.containsNestedCond(falseValue)) {
      throw new Error('cond関数のネストは許可されていません')
    }

    // 条件評価
    const isTrue = this.evaluateCondition(condition, getValue)

    // 結果の値を返す
    return isTrue ? trueValue : falseValue
  }

  /**
   * 条件式を評価
   * 比較演算子が含まれる場合は比較式として評価、含まれない場合は真偽値として評価
   */
  private static evaluateCondition(
    condition: string,
    getValue: (varName: string) => string | number | undefined
  ): boolean {
    const trimmed = condition.trim()

    // 比較演算子が含まれているかチェック
    if (/[><!=]=?/.test(trimmed)) {
      // 比較式として評価
      const result = ComparisonParser.parse(trimmed, getValue)
      if (!result.isValid) {
        throw new Error(result.error || '比較式の評価に失敗しました')
      }
      return result.result!
    }

    // 単一変数の真偽値として評価
    return this.isTruthy(trimmed, getValue)
  }

  /**
   * 変数が真と見なされるかチェック
   * 真: 変数が存在し、値が 0, '', false, '0', 'false' 以外
   * 偽: 変数が存在しない、または値が 0, '', false, '0', 'false'
   */
  private static isTruthy(varName: string, getValue: (varName: string) => string | number | undefined): boolean {
    const value = getValue(varName)

    if (value === undefined) return false

    // 明示的な偽値チェック
    if (value === 0 || value === '') return false
    if (value === '0' || value === 'false') return false

    return true
  }

  /**
   * ネストされたcond関数が含まれているかチェック
   */
  private static containsNestedCond(value: string): boolean {
    return /cond\s*\(/i.test(value)
  }
}
