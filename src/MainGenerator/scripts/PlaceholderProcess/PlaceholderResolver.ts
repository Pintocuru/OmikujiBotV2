// src/MainGenerator/scripts/omikujiProcess/placeholders/PlaceholderResolver.ts
import { handelNormalizedValues, PlaceholderType, PlaceholderValueType } from '@/types/'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { VariablePlaceholderProcessor } from '../VariablePlaceholder/VariableProcessor'
import { PlaceholderAnalyzer } from './PlaceholderAnalyzer'

/**
 * プレースホルダー解決エンジン
 */
export class PlaceholderResolver {
  private readonly placeholderMap: Map<string, PlaceholderType> = new Map()
  private contextValues: Map<string, string | number> = new Map()
  private readonly variableProcessor: VariablePlaceholderProcessor = new VariablePlaceholderProcessor()
  private readonly analyzer: PlaceholderAnalyzer
  private static readonly MAX_RECURSION_DEPTH = 10

  constructor(
    placeholderSources: Record<string, PlaceholderType>,
    variableProcessor?: VariablePlaceholderProcessor // 追加
  ) {
    for (const placeholder of Object.values(placeholderSources)) {
      const lookupKey = placeholder.key
      this.placeholderMap.set(lookupKey, placeholder)
    }
    // 渡されたインスタンスを使用、なければ新規作成
    this.variableProcessor = variableProcessor || new VariablePlaceholderProcessor()
    this.analyzer = new PlaceholderAnalyzer(this.placeholderMap)
  }

  setContextValues(values: Record<string, string | number>): void {
    this.contextValues.clear()
    for (const [key, value] of Object.entries(values)) {
      this.contextValues.set(key, value)
    }
  }

  /**
   * プレースホルダーを解決
   */
  resolve(placeholderId: string, depth: number = 0): string {
    if (depth > PlaceholderResolver.MAX_RECURSION_DEPTH) {
      console.warn(`プレースホルダー解決の最大深度に達しました: ${placeholderId}`)
      return `<<${placeholderId}>>`
    }

    // 新しい解決サイクルの開始時（depth=0）で変数をクリア
    if (depth === 0) this.variableProcessor.clearVariables()

    // <<null>> なら値を入れずに返す
    if (placeholderId === 'null') return ''

    // コンテキスト値をチェック
    if (this.contextValues.has(placeholderId)) {
      const value = this.contextValues.get(placeholderId)
      return String(value)
    }

    // プレースホルダーの取得
    const placeholder = this.placeholderMap.get(placeholderId)
    if (!placeholder) {
      console.warn(`プレースホルダーが見つかりません: ${placeholderId}`)
      return `<<${placeholderId}>>`
    }

    const normalizedValues = handelNormalizedValues(placeholder.values)
    if (normalizedValues.length === 0) return ''

    // ランダム抽選で値を選択
    const selectedValue = this.selectValue(normalizedValues)
    if (!selectedValue?.content) return normalizedValues[0].content || ''

    // コンテンツの処理
    return this.processContent(selectedValue.content, depth)
  }

  /**
   *
   */
  setVariableContext(rankingScore?: number, valuesLength?: number): void {
    this.variableProcessor.setContext(rankingScore, valuesLength)
  }

  /**
   * ランダム抽選で値を選択
   */
  private selectValue(normalizedValues: PlaceholderValueType[]): PlaceholderValueType {
    const drawnValue = drawOmikuji(normalizedValues)
    return drawnValue || normalizedValues[0]
  }

  /**
   * コンテンツの処理（変数処理 + プレースホルダー置換）
   */
  private processContent(content: string, depth: number): string {
    // 変数プレースホルダーを処理
    content = this.variableProcessor.process(content)

    // 他のプレースホルダーを再帰的に解決（変数処理後に実行）
    return this.replaceInText(content, depth + 1)
  }

  /**
   * テキスト内のプレースホルダーを置換
   */
  private replaceInText(text: string, depth: number = 0): string {
    const placeholderPattern = /<<([^>]+)>>/g

    return text.replace(placeholderPattern, (match, placeholderId) => {
      const trimmedId = placeholderId.trim()
      return this.resolve(trimmedId, depth)
    })
  }

  // 分析機能のデリゲート
  extractPlaceholderIds(text: string): string[] {
    return this.analyzer.extractPlaceholderIds(text)
  }

  collectDependencies(placeholderId: string, visited: Set<string> = new Set()): string[] {
    return this.analyzer.collectDependencies(placeholderId, visited)
  }

  // 変数プレースホルダー関連のデリゲート
  analyzeVariablePlaceholders(text: string) {
    return this.variableProcessor.extractVariablePlaceholders(text)
  }

  getCurrentVariables() {
    return this.variableProcessor.getVariables()
  }
}
