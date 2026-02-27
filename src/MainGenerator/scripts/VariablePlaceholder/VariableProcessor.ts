// src/MainGenerator/scripts/VariablePlaceholder/VariableProcessor.ts
import { VariablePlaceholderResult } from '@/types/MainGenerator/OmikujiResultTypes'
import { ExpressionEvaluator } from './ExpressionEvaluator'
import {
  CALC_PATTERN,
  RAND_PATTERN,
  RESERVED_KEYS,
  VAR_DECLARATION_PATTERN,
  VAR_REFERENCE_PATTERN,
} from './ReservedKeys'
import { ExtraListsSchema, ExtraListsType, ExtraSlotsSchema, ExtraSlotsType } from '@/types'

/**
 * 変数プレースホルダー処理エンジン
 *
 * 対応構文:
 *   {{var name = 値}}          変数宣言（文字列・数値・変数参照・三項演算子）
 *   {{calc name = 式}}         式評価して代入
 *   {{calc name += 式}}        複合代入（+=, -=, *=, /=）
 *   {{name}}                   変数参照
 *   {{rand(min, max)}}         乱数生成
 *
 * var の右辺評価ルール（優先順位順）:
 *   1. 'シングルクォート' → 文字列
 *   2. 数値のみ           → 数値
 *   3. ? を含む           → 三項演算子として式評価
 *   4. 既存の変数名       → その変数の値をコピー
 *   5. その他             → 文字列としてそのまま保存
 *
 * calc の右辺は常に式評価（未定義変数は 0）
 * cond タグは廃止。三項演算子は var で代替。
 */
export class VariablePlaceholderProcessor {
  private readonly evaluator: ExpressionEvaluator = new ExpressionEvaluator()

  /**
   * テキスト内のプレースホルダーを処理
   * 処理順序: 改行除去 → var宣言 → calc → 変数参照 → rand
   */
  process(text: string): VariablePlaceholderResult {
    let processed = text.replace(/\n/g, '')

    // 1: var 宣言を処理
    processed = this.processVariableDeclarations(processed)

    // 2: calc を処理
    processed = this.processCalcFunction(processed)

    // 3: 変数参照を処理
    processed = this.processVariableReferences(processed)

    // 4: rand を処理
    processed = this.processRandFunction(processed)

    const allVars = Object.fromEntries(
      Object.entries(this.evaluator.getAll()).map(([k, v]) => [k, String(v)])
    ) as Record<string, string>

    const extra = this.buildExtraData(allVars)

    for (const key of RESERVED_KEYS) this.evaluator.remove(key)

    return {
      bubble: processed,
      extra: {
        scriptKey: 'basicList',
        lists: extra.lists,
        slots: extra.slots,
      },
    }
  }

  /**
   * var 宣言を処理 {{var name = value}}
   *
   * 右辺の評価ルールは ExpressionEvaluator.evaluateVarRhs() に委譲。
   * ? を含む場合（三項演算子）は式評価され、それ以外はルールに従い保存される。
   */
  private processVariableDeclarations(text: string): string {
    return text.replace(VAR_DECLARATION_PATTERN, (match, varName, expression) => {
      try {
        const value = this.evaluator.evaluateVarRhs(expression.trim())
        this.evaluator.set(varName, value)
        return ''
      } catch (error) {
        console.warn(`var宣言の評価に失敗: ${match}`, error)
        return match
      }
    })
  }

  /**
   * calc を処理
   *
   * {{calc score = foo_user01}}  → 式評価して代入（単純代入）
   * {{calc score += 5}}              → 複合代入
   *
   * CALC_PATTERN の演算子グループ: [\+\-\*\/]?=
   *   複合代入: +=, -=, *=, /=
   *   単純代入: =
   */
  private processCalcFunction(text: string): string {
    return text.replace(CALC_PATTERN, (match, varName, operator, expression) => {
      try {
        if (operator === '=') {
          // 単純代入: 右辺を式評価して保存
          const value = this.evaluator.evaluateCalcRhs(expression.trim())
          this.evaluator.set(varName, value)
        } else {
          // 複合代入: +=, -=, *=, /=
          this.evaluator.calculate(varName, operator, expression.trim())
        }
        return ''
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
   * rand 関数を処理 {{rand(min,max)}}
   */
  private processRandFunction(text: string): string {
    return text.replace(RAND_PATTERN, (match, minStr, maxStr) => {
      const min = parseInt(minStr, 10)
      const max = parseInt(maxStr, 10)
      if (isNaN(min) || isNaN(max)) {
        console.warn(`無効なrand関数: ${match}`)
        return match
      }
      return String(this.evaluator.evaluatePureExpression(`rand(${Math.min(min, max)},${Math.max(min, max)})`))
    })
  }

  /**
   * 予約語を抽出して ExtraData を構築
   */
  private buildExtraData(vars: Record<string, string>): {
    lists?: ExtraListsType
    slots?: ExtraSlotsType
  } {
    const slotEntries: Record<string, string> = {}
    for (let i = 0; i <= 9; i++) {
      const key = `slot${i}`
      if (vars[key] !== undefined) slotEntries[key] = vars[key]
    }

    const hasSlots = Object.keys(slotEntries).length > 0
    const hasListData = vars['text'] !== undefined || vars['flag'] === 'true'

    if (!hasSlots && !hasListData) return {}

    let lists: ExtraListsType | undefined
    let slots: ExtraSlotsType | undefined

    try {
      if (hasListData) {
        lists = ExtraListsSchema.parse({
          listName: vars['name'],
          symbol: vars['symbol'],
          text: vars['text'],
          order: vars['order'] ? Number(vars['order']) : undefined,
          variant: vars['variant'],
          isUnique: vars['unique'] === 'true',
          isVisible: vars['visible'] !== 'false',
          flag: vars['flag'] === 'true',
        })
      }
      if (hasSlots) {
        slots = ExtraSlotsSchema.parse(slotEntries)
      }
      return { lists, slots }
    } catch (error) {
      console.warn('Extra data construction failed:', error)
      return {}
    }
  }
}
