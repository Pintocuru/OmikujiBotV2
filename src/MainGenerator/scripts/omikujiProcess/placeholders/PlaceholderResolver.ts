// src/MainGenerator/script/omikujiProcess/placeholders/PlaceholderResolver.ts
import { handelNormalizedValues, PlaceholderType } from '@/types/'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'

/**
 * プレースホルダー解決エンジン
 * 各プレースホルダーの解決ロジックを管理
 */
export class PlaceholderResolver {
  private readonly placeholderMap: Map<string, PlaceholderType>
  private contextValues: Map<string, string | number> = new Map()
  private static readonly MAX_RECURSION_DEPTH = 10 // 無限再帰防止

  constructor(placeholderSources: Record<string, PlaceholderType>) {
    this.placeholderMap = new Map()
    for (const placeholder of Object.values(placeholderSources)) {
      // keyが空の場合はidをフォールバックとして使用
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
   * プレースホルダーを解決する
   * 毎回新しい値を生成（キャッシュしない）
   */
  resolve(placeholderId: string, depth: number = 0): string {
    // 無限再帰防止
    if (depth > PlaceholderResolver.MAX_RECURSION_DEPTH) {
      console.warn(`プレースホルダー解決の最大深度に達しました: ${placeholderId}`)
      return `<<${placeholderId}>>`
    }

    // 特殊プレースホルダー処理
    if (placeholderId === 'null') {
      return ''
    }

    // コンテキスト値チェックを追加
    if (this.contextValues.has(placeholderId)) {
      const value = this.contextValues.get(placeholderId)
      return String(value)
    }

    // 通常のプレースホルダー解決
    const placeholder = this.placeholderMap.get(placeholderId)
    if (!placeholder) {
      console.warn(`プレースホルダーが見つかりません: ${placeholderId}`)
      return `<<${placeholderId}>>`
    }

    const normalizedValues = handelNormalizedValues(placeholder.values)
    if (normalizedValues.length === 0) {
      return ''
    }

    // 値を抽選
    const selectedValue = drawOmikuji(normalizedValues)
    if (!selectedValue?.content) {
      return normalizedValues[0].content || ''
    }

    // 選択された値内のプレースホルダーを再帰的に解決
    return this.replaceInText(selectedValue.content, depth + 1)
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

  /**
   * テキスト内で使用されているプレースホルダーIDを収集
   */
  extractPlaceholderIds(text: string): string[] {
    const placeholderPattern = /<<([^>]+)>>/g
    const ids: string[] = []
    let match

    while ((match = placeholderPattern.exec(text)) !== null) {
      const placeholderId = match[1].trim()
      if (placeholderId && !ids.includes(placeholderId)) {
        ids.push(placeholderId)
      }
    }

    return ids
  }

  /**
   * プレースホルダーの依存関係を再帰的に収集
   */
  collectDependencies(placeholderId: string, visited: Set<string> = new Set()): string[] {
    if (visited.has(placeholderId)) {
      return [] // 循環参照防止
    }

    visited.add(placeholderId)
    const dependencies: string[] = [placeholderId]

    const placeholder = this.placeholderMap.get(placeholderId)
    if (!placeholder) {
      return dependencies
    }

    const normalizedValues = handelNormalizedValues(placeholder.values)
    for (const value of normalizedValues) {
      const childIds = this.extractPlaceholderIds(value.content)
      for (const childId of childIds) {
        const childDependencies = this.collectDependencies(childId, new Set(visited))
        dependencies.push(...childDependencies.filter((id) => !dependencies.includes(id)))
      }
    }

    return dependencies
  }
}
