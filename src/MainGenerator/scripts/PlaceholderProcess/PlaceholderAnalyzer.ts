// src/MainGenerator/scripts/PlaceholderProcess/placeholderAnalyzer.ts
import { PlaceholderType, handelNormalizedValues } from '@/types'

/**
 * テキスト内で使用されているプレースホルダーIDを抽出
 */
export function extractPlaceholderIds(text: string): string[] {
  const pattern = /<<([^>]+)>>/g
  const ids: string[] = []
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    const id = match[1].trim()
    if (id && !ids.includes(id)) {
      ids.push(id)
    }
  }

  return ids
}

/**
 * プレースホルダーの依存関係を再帰的に収集
 */
export function collectPlaceholderDependencies(
  placeholderId: string,
  placeholderMap: Map<string, PlaceholderType>,
  visited: Set<string> = new Set()
): string[] {
  if (visited.has(placeholderId)) return []

  visited.add(placeholderId)
  const dependencies: string[] = [placeholderId]

  const placeholder = placeholderMap.get(placeholderId)
  if (!placeholder) return dependencies

  const normalizedValues = handelNormalizedValues(placeholder.values)

  for (const value of normalizedValues) {
    const childIds = extractPlaceholderIds(value.content)
    for (const childId of childIds) {
      const childDeps = collectPlaceholderDependencies(childId, placeholderMap, new Set(visited))
      for (const id of childDeps) {
        if (!dependencies.includes(id)) {
          dependencies.push(id)
        }
      }
    }
  }

  return dependencies
}
