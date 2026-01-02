// src/MainGenerator/scripts/omikujiProcess/placeholders/PlaceholderResolver.ts
import { PlaceholderType, selectValue } from '@/types/'
import { collectPlaceholderDependencies, extractPlaceholderIds } from './PlaceholderAnalyzer'

/**
 * プレースホルダー解決エンジン
 */
export class PlaceholderResolver {
  private readonly placeholderMap: Map<string, PlaceholderType> = new Map()
  private contextValues: Map<string, string | number> = new Map()
  private static readonly MAX_RECURSION_DEPTH = 10

  constructor(placeholderSources: Record<string, PlaceholderType>) {
    for (const placeholder of Object.values(placeholderSources)) {
      const lookupKey = placeholder.key
      this.placeholderMap.set(lookupKey, placeholder)
    }
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

    // ランダム抽選で値を選択
    const selectedValue = selectValue(placeholder.values)

    // コンテンツの処理
    return this.processContent(selectedValue, depth)
  }

  /**
   * コンテンツの処理（変数処理 + プレースホルダー置換）
   */
  private processContent(content: string, depth: number): string {
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
    return extractPlaceholderIds(text)
  }

  collectDependencies(placeholderId: string, visited: Set<string> = new Set()): string[] {
    return collectPlaceholderDependencies(placeholderId, this.placeholderMap, visited)
  }
}
