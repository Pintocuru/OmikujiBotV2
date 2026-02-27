// src/MainGenerator/scripts/VariablePlaceholder/VariableProcessor.ts
import { VariablePlaceholderResult } from '@/types/MainGenerator/OmikujiResultTypes'
import { ExpressionEvaluator } from './ExpressionEvaluator'
import {
  EXPRESSION_PATTERN,
  RAND_PATTERN,
  RESERVED_KEYS,
  VAR_DECLARATION_PATTERN,
  VAR_REFERENCE_PATTERN,
} from './ReservedKeys'
import { ExtraListsSchema, ExtraListsType, ExtraSlotsSchema, ExtraSlotsType } from '@/types'

/**
 * 変数プレースホルダー処理エンジン
 *
 * v2 対応構文（推奨）:
 *   {{name = 'value'}}          文字列代入
 *   {{score = 100}}             数値代入
 *   {{score += 10}}             複合代入
 *   {{result = score >= 10 ? 1 : 0}}  三項演算子
 *   {{a = 1; b = 2}}            複数式（セミコロン区切り）
 *   {{name}}                    変数参照（出力）
 *
 * v1 互換構文（非推奨・後方互換）:
 *   {{var name = value}}        旧変数宣言
 *   {{rand(1, 10)}}             旧ランダム生成
 *
 * 処理順序:
 *   改行除去 → v1 var → v1 rand → v2 式評価 → 変数参照
 *
 * v1 を先に処理することで後方互換を保証する。
 */
export class VariablePlaceholderProcessor {
  private readonly evaluator: ExpressionEvaluator = new ExpressionEvaluator()
  private keyMap = new Map<string, string>()

  process(text: string): VariablePlaceholderResult {
    let processed = text.replace(/\n/g, '')

    // 英数字でない場合は変換してしまう
    processed = processed.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*\[[^\]]+\])/g, (match) => this.toSafeKey(match))

    // v1 互換処理（非推奨・後方互換）
    processed = this.processLegacyVarDeclarations(processed)
    processed = this.processLegacyRandFunction(processed)

    // v2 処理（推奨）
    processed = this.processExpressions(processed)

    // 変数参照（v1・v2 共通）
    processed = this.processVariableReferences(processed)

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
   * v2: 式評価 {{式}} または {{式; 式; ...}}
   * 代入式はテキストから除去、非代入式（rand など）はその場で出力
   */
  private processExpressions(text: string): string {
    return text.replace(EXPRESSION_PATTERN, (match, expression) => {
      try {
        const { output, hasOutput } = this.evaluator.evaluateExpression(expression.trim())
        return hasOutput ? output : ''
      } catch (error) {
        console.warn(`式の評価に失敗: ${match}`, error)
        return match
      }
    })
  }

  /**
   * 変数参照 {{name}} → 値に置換して出力
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

  // ----------------------------------------------------------------
  // v1 互換処理（非推奨）
  // ----------------------------------------------------------------

  /**
   * @deprecated v2 では {{name = value}} を使用してください
   */
  private processLegacyVarDeclarations(text: string): string {
    return text.replace(VAR_DECLARATION_PATTERN, (match, varName, expression) => {
      try {
        const value = this.evaluator.evaluateVarRhs(expression.trim())
        this.evaluator.set(varName, value)
        return ''
      } catch (error) {
        console.warn(`[非推奨] var宣言の評価に失敗: ${match}`, error)
        return match
      }
    })
  }

  /**
   * @deprecated v2 では {{result = rand(1,10)}} を使用してください
   */
  private processLegacyRandFunction(text: string): string {
    return text.replace(RAND_PATTERN, (match, minStr, maxStr) => {
      const min = parseInt(minStr, 10)
      const max = parseInt(maxStr, 10)
      if (isNaN(min) || isNaN(max)) {
        console.warn(`[非推奨] 無効なrand関数: ${match}`)
        return match
      }
      const lo = Math.min(min, max)
      const hi = Math.max(min, max)
      return String(Math.floor(Math.random() * (hi - lo + 1)) + lo)
    })
  }

  // ----------------------------------------------------------------
  // 予約語処理
  // ----------------------------------------------------------------

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

  private normalizeVariableName(name: string): string {
    // 英数字以外は _
    let normalized = name.replace(/[^a-zA-Z0-9_]/g, '_')

    // 先頭が英字でなければ v_ を付与
    if (!/^[a-zA-Z]/.test(normalized)) {
      normalized = `v_${normalized}`
    }

    return normalized
  }

  private toSafeKey(original: string): string {
    if (this.keyMap.has(original)) {
      return this.keyMap.get(original)!
    }

    // シンプルなハッシュ
    let hash = 0
    for (let i = 0; i < original.length; i++) {
      hash = (hash * 31 + original.charCodeAt(i)) >>> 0
    }

    const safe = `v_${hash.toString(36)}`
    this.keyMap.set(original, safe)
    return safe
  }
}
