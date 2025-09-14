// src\MainGenerator\scripts\PlaceholderProcess\PlaceholderAnalyzer.ts
import { PlaceholderType, handelNormalizedValues } from '@/types/'

/**
 * プレースホルダーの解析機能を提供するクラス
 * 依存関係の解析、プレースホルダーID抽出などを行う
 */
export class PlaceholderAnalyzer {
  constructor(private readonly placeholderMap: Map<string, PlaceholderType>) {}

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
    if (visited.has(placeholderId)) return [] // 循環参照防止

    visited.add(placeholderId)
    const dependencies: string[] = [placeholderId]

    const placeholder = this.placeholderMap.get(placeholderId)
    if (!placeholder) return dependencies

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
