// src/MainGenerator/scripts/ContentPlaceholder/processor.ts
import {
  PostFlowType,
  PlaceholderType,
  handelNormalizedValues,
  WeightValuesArrayType,
  WeightValueType,
  hasPostFlowMessage,
} from '@/types'
import { findMatchingClosingBracket, isInlineRandomSyntax, parseInlineValues, selectRandomValue } from './parser'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'

/**
 * プレースホルダー処理のメインクラス
 * プレースホルダー置換処理を行う
 *
 * 対応する構文:
 * - <<placeholderId>> : 定義済みプレースホルダーからランダム選択
 * - <<'value1','value2','value3'>> : インラインでランダム選択
 */
export class ContentPlaceholder {
  private readonly placeholderMap: Map<string, PlaceholderType> = new Map()
  private contextValues: Map<string, string | number> = new Map()
  private static readonly PLACEHOLDER_PATTERN = /<<([\s\S]+?)>>/g
  private static readonly MAX_RECURSION_DEPTH = 10

  constructor(placeholderSources: Record<string, PlaceholderType>) {
    for (const placeholder of Object.values(placeholderSources)) {
      this.placeholderMap.set(placeholder.key, placeholder)
    }
  }

  /**
   * コンテキスト値を更新(ユーザー名、日付など)
   */
  updateResolvedValues(data: Record<string, string | number>): void {
    this.contextValues.clear()
    Object.entries(data).forEach(([key, value]) => {
      this.contextValues.set(key, value)
    })
  }

  /**
   * コンテキスト値をクリア
   */
  clearResolvedValues(): void {
    this.contextValues.clear()
  }

  /**
   * PostAction配列のプレースホルダーを置換して返す
   */
  processPostActions(postActions: PostFlowType[]): PostFlowType[] {
    return postActions.map((action) => {
      if (hasPostFlowMessage(action)) {
        return {
          ...action,
          message: {
            ...action.message,
            bubble: this.processText(action.message.bubble),
          },
        }
      }
      if (action.actionType === 'wordParty') {
        return { ...action, wordParty: this.processText(action.wordParty) }
      }
      return action
    })
  }

  /**
   * 単一のテキストのプレースホルダーを処理
   */
  processText(text?: string): string {
    if (!text) return ''

    let result = text

    // 無限ループ防止のため最大試行回数を設定
    let safetyCounter = 0

    while (result.includes('<<') && safetyCounter < 100) {
      // 1. 最初に出現する "<<" を探す
      const startIndex = result.indexOf('<<')

      // 2. それに対応する "一番外側の >>" を探す
      const endIndex = findMatchingClosingBracket(result, startIndex)

      if (endIndex === -1) break

      // 3. 全体を取り出す (例: <<'<<user>>さん','初見さん'>>)
      const fullMatch = result.substring(startIndex, endIndex + 2)
      // 4. 中身だけ取り出す (例: '<<user>>さん','初見さん')
      const content = result.substring(startIndex + 2, endIndex)

      // 5. 解決して置換
      const resolved = this.resolvePlaceholder(fullMatch, content.trim())
      result = result.substring(0, startIndex) + resolved + result.substring(endIndex + 2)

      safetyCounter++
    }

    return result
  }

  /**
   * プレースホルダーを解決
   */
  private resolvePlaceholder(originalMatch: string, placeholderId: string, depth: number = 0): string {
    if (depth > ContentPlaceholder.MAX_RECURSION_DEPTH) {
      console.warn(`プレースホルダー解決の最大深度に達しました: ${placeholderId}`)
      return originalMatch
    }

    // <<null>> なら空文字を返す
    if (placeholderId === 'null') return ''

    // インラインランダム選択構文: <<'value1','value2','value3'>>
    if (isInlineRandomSyntax(placeholderId)) {
      return this.resolveInlineRandom(placeholderId, depth)
    }

    // コンテキスト値を優先
    if (this.contextValues.has(placeholderId)) {
      const value = this.contextValues.get(placeholderId)
      return String(value)
    }

    // プレースホルダーの取得
    const placeholder = this.placeholderMap.get(placeholderId)
    if (!placeholder) {
      console.warn(`プレースホルダーが見つかりません: ${placeholderId}`)
      return originalMatch
    }

    // ランダム抽選で値を選択
    const selectedValue = selectValue(placeholder.values)

    // コンテンツの処理（再帰的にプレースホルダーを解決）
    return this.replaceInText(selectedValue, depth + 1)
  }

  /**
   * インラインランダム選択を解決
   * <<'value1','value2','value3'>> から1つをランダムに選択
   */
  private resolveInlineRandom(input: string, depth: number): string {
    // シンプルなパース: 'で囲まれた部分を抽出
    const values = parseInlineValues(input)

    if (values.length === 0) {
      console.warn(`インラインランダム選択の値が空です: ${input}`)
      return ''
    }

    // ランダムに1つ選択
    const selected = selectRandomValue(values)

    // 選択された値内のプレースホルダーを再帰的に解決
    // これにより <<'<<greeting>>','bar'>> のような入れ子も対応
    return this.replaceInText(selected, depth + 1)
  }

  /**
   * テキスト内のプレースホルダーを置換
   */
  private replaceInText(text: string, depth: number = 0): string {
    return text.replace(ContentPlaceholder.PLACEHOLDER_PATTERN, (match, placeholderId) => {
      return this.resolvePlaceholder(match, placeholderId.trim(), depth)
    })
  }
}

// PlaceholderValueType から ランダム抽選で値を選択
function selectValue(values: WeightValuesArrayType): string {
  const normalizedValues = handelNormalizedValues(values)
  if (normalizedValues.length === 0) return ''

  const drawnValue = drawOmikuji(normalizedValues) as WeightValueType
  return drawnValue.content || normalizedValues[0].content || ''
}
