// src/MainGenerator/scripts/omikujiProcess/placeholders/PlaceholderResolver.ts
import { handelNormalizedValues, PlaceholderType, PlaceholderValueType } from '@/types/'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { VariablePlaceholderProcessor } from '../VariablePlaceholder/VariableProcessor'
import { MapBasedResolver } from './MapBasedResolver'
import { PlaceholderAnalyzer } from './PlaceholderAnalyzer'

/**
 * プレースホルダー解決エンジン
 * 各プレースホルダーの解決ロジックを管理
 */
export class PlaceholderResolver {
  private readonly placeholderMap: Map<string, PlaceholderType>
  private contextValues: Map<string, string | number> = new Map()
  private currentUserId?: string
  private readonly variableProcessor: VariablePlaceholderProcessor
  private readonly mapResolver: MapBasedResolver
  private readonly analyzer: PlaceholderAnalyzer
  private static readonly MAX_RECURSION_DEPTH = 10

  constructor(placeholderSources: Record<string, PlaceholderType>) {
    this.placeholderMap = new Map()
    for (const placeholder of Object.values(placeholderSources)) {
      const lookupKey = placeholder.key
      this.placeholderMap.set(lookupKey, placeholder)
    }
    this.variableProcessor = new VariablePlaceholderProcessor()
    this.mapResolver = new MapBasedResolver()
    this.analyzer = new PlaceholderAnalyzer(this.placeholderMap)
  }

  setContextValues(values: Record<string, string | number>): void {
    this.contextValues.clear()
    for (const [key, value] of Object.entries(values)) {
      this.contextValues.set(key, value)
    }
  }

  setUserId(userId: string): void {
    this.currentUserId = userId
  }

  /**
   * プレースホルダーを解決する
   * 毎回新しい値を生成（キャッシュしない）
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
    if (normalizedValues.length === 0) {
      return ''
    }

    // 値の選択とランク計算
    const { selectedValue, rank } = this.selectValue(placeholder, normalizedValues)

    if (!selectedValue?.content) {
      return normalizedValues[0].content || ''
    }

    // コンテンツの処理
    return this.processContent(selectedValue.content, rank, normalizedValues.length, depth)
  }

  /**
   * 値の選択とランク計算
   */
  private selectValue(
    placeholder: PlaceholderType,
    normalizedValues: PlaceholderValueType[]
  ): { selectedValue: PlaceholderValueType; rank?: number } {
    // mapType が設定されている場合の特殊処理
    if (placeholder.mapType && this.currentUserId) {
      const selectedValue = this.mapResolver.resolveWithMap(placeholder, normalizedValues, this.currentUserId)
      const rank = this.mapResolver.calculateRankForUser(placeholder, normalizedValues, this.currentUserId)
      return { selectedValue, rank }
    } else {
      // 従来通りのランダム抽選
      const drawnValue = drawOmikuji(normalizedValues)
      const selectedValue = drawnValue || normalizedValues[0]
      return { selectedValue }
    }
  }

  /**
   * コンテンツの処理（変数処理 + プレースホルダー置換）
   */
  private processContent(content: string, rank: number | undefined, totalCount: number, depth: number): string {
    // コンテキストを設定
    this.variableProcessor.setContext(rank, totalCount)

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
