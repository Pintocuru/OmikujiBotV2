// src\MainGenerator\scripts\OmikujiProcess\ActionSetValidator.ts
import { PostActionType } from '@/types/'

export interface CircularReferenceResult {
  hasCircular: boolean
  path: string[] | null
}

/**
 * アクションセットの循環参照をチェックする
 * @param targetKey チェック対象のアクションセットキー
 * @param actionSets 全アクションセットのデータ
 * @param currentKey 現在編集中のアクションセットキー（オプション）
 * @param visited 訪問済みキーのセット（内部使用）
 * @returns 循環参照の経路（循環参照がない場合はnull）
 */
export function checkCircularReference(
  targetKey: string,
  actionSets: Record<string, { postActions: PostActionType[] }>,
  currentKey?: string,
  visited: Set<string> = new Set()
): string[] | null {
  if (!targetKey || !actionSets) return null

  // 自分自身を参照している場合
  if (currentKey && targetKey === currentKey) {
    return [currentKey, targetKey]
  }

  // 既に訪問済みなら循環参照
  if (visited.has(targetKey)) {
    return [targetKey]
  }

  const actionSet = actionSets[targetKey]
  if (!actionSet?.postActions) return null

  visited.add(targetKey)

  // このアクションセット内のすべてのアクションをチェック
  for (const action of actionSet.postActions) {
    if (action.actionType === 'actionSet' && action.actionSetKey) {
      const circularPath = checkCircularReference(action.actionSetKey, actionSets, currentKey, new Set(visited))
      if (circularPath) return [targetKey, ...circularPath]
    }
  }

  return null
}

/**
 * アクションセットに循環参照があるかチェック（簡易版）
 */
export function hasCircularReference(
  targetKey: string,
  actionSets: Record<string, { postActions: PostActionType[] }>,
  currentKey?: string
): boolean {
  return checkCircularReference(targetKey, actionSets, currentKey) !== null
}
