// src/MainGenerator/scripts/VariablePlaceholder/VariableProcessor.ts
import { VariablePlaceholderResult } from '@/types/MainGenerator/OmikujiResultTypes'
import { ExpressionEvaluator } from './ExpressionEvaluator'
import {
  CALC_PATTERN,
  COND_PATTERN,
  RAND_PATTERN,
  RESERVED_KEYS,
  VAR_DECLARATION_PATTERN,
  VAR_REFERENCE_PATTERN,
} from './ReservedKeys'
import { RankingMessageSchema, RankingMessageType } from '@/types'

/**
 * 変数プレースホルダー処理エンジン
 * {{var variableName = value}}, {{variableName}}, {{rand(min,max)}}, {{calc varName op= expr}}, {{cond(var, true, false)}}を処理
 */
export class VariablePlaceholderProcessor {
  private readonly evaluator: ExpressionEvaluator = new ExpressionEvaluator()

  /**
   * テキスト内のプレースホルダーを処理
   * 処理順序: 改行除去 → var宣言 → calc → cond → 変数参照 → rand
   */
  process(text: string): VariablePlaceholderResult {
    // 改行を除去
    let processed = text.replace(/\n/g, '')

    // 1: 変数宣言を処理
    processed = this.processVariableDeclarations(processed)

    // 2: calc関数を処理
    processed = this.processCalcFunction(processed)

    // 3: cond関数を処理（変数参照の前に実行）
    processed = this.processCondFunction(processed)

    // 4: 変数参照を処理
    processed = this.processVariableReferences(processed)

    // 5: rand関数を処理
    processed = this.processRandFunction(processed)

    // すべての処理した変数を取得
    const allVars = Object.fromEntries(
      Object.entries(this.evaluator.getAll()).map(([k, v]) => [k, String(v)])
    ) as Record<string, string>

    // 予約語からランキングデータを構築
    const ranking = this.buildRankingData(allVars)

    // 予約語の削除
    for (const key of RESERVED_KEYS) this.evaluator.remove(key)

    return { bubble: processed, ranking }
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
   * cond関数を処理 {{cond(condition, trueValue, falseValue)}}
   */
  private processCondFunction(text: string): string {
    return text.replace(COND_PATTERN, (match, condition, trueValue, falseValue) => {
      try {
        const result = this.evaluator.evaluate(`cond(${condition}, ${trueValue}, ${falseValue})`)
        return String(result)
      } catch (error) {
        console.warn(`cond関数の評価に失敗: ${match}`, error)
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

  /**
   * 取得した変数の中から予約語を抽出し、RankingMessageSchema に適合する形に変換
   */
  private buildRankingData(vars: Record<string, string>): RankingMessageType | undefined {
    // slot0 - slot9 を収集
    const slots: string[] = []
    for (let i = 0; i <= 9; i++) {
      const key = `slot${i}`
      if (vars[key] !== undefined) {
        slots.push(vars[key])
      }
    }

    // text (scoreText) が無い、あるいはslotsが空の場合はランキングを生成しない
    if (!vars['text'] && slots.length === 0) return

    try {
      // Zod スキーマを使用して安全にパース
      return RankingMessageSchema.parse({
        scriptKey: 'basicList',
        listName: vars['name'],
        symbol: vars['symbol'],
        scoreText: vars['text'],
        variant: vars['variant'],
        isUniqueUser: vars['unique'] !== 'false',
        isRank: true,
        slots: slots.length > 0 ? slots : undefined,
      })
    } catch (error) {
      console.warn('Ranking data construction failed:', error)
      return undefined
    }
  }
}
