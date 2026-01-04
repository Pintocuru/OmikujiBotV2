// src/MainGenerator/scripts/OmikujiProcess/ActionSetExpander.ts
import { ActionSetType, handelNormalizedValues, PostActionActionSetType, PostActionType } from '@/types/OmikujiData/'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'

export class ActionSetExpander {
  private static readonly MAX_DEPTH = 10

  static expand(
    actions: PostActionType[],
    actionSets: Record<string, ActionSetType>,
    depth: number = 0,
    visited: Set<string> = new Set()
  ): PostActionType[] {
    if (depth >= this.MAX_DEPTH) {
      ConsolePost('warn', `アクションセットの展開が最大階層(${this.MAX_DEPTH})に達しました`)
      return actions
    }

    const expandedActions: PostActionType[] = []

    for (const action of actions) {
      if (action.actionType === 'actionSet') {
        const expandedAction = this.expandSingleActionSet(action, actionSets, depth, visited)
        expandedActions.push(...expandedAction)
      } else {
        expandedActions.push(action)
      }
    }

    return expandedActions
  }

  /**
   *
   */
  private static expandSingleActionSet(
    action: PostActionActionSetType,
    actionSets: Record<string, ActionSetType>,
    depth: number,
    visited: Set<string>
  ): PostActionType[] {
    // 抽選を行う
    const normalized = handelNormalizedValues(action.actionSetKeys)
    const targetKeyObject = drawOmikuji(normalized)
    if (!targetKeyObject) return []
    const targetKey = targetKeyObject.content

    // 循環参照チェック
    if (visited.has(targetKey)) {
      ConsolePost('error', `循環参照が検出されました: ${targetKey}`)
      return []
    }

    // 展開
    const targetActionSet = actionSets[targetKey]
    if (!targetActionSet) {
      ConsolePost('warn', `アクションセット "${targetKey}" が見つかりません`)
      return []
    }

    const newVisited = new Set(visited)
    newVisited.add(targetKey)

    const adjustedActions = this.adjustDelays(targetActionSet.postActions, action.delaySeconds)

    return this.expand(adjustedActions, actionSets, depth + 1, newVisited)
  }

  private static adjustDelays(actions: PostActionType[], baseDelay: number): PostActionType[] {
    return actions.map((action) => ({
      ...action,
      delaySeconds: (action.delaySeconds || 0) + baseDelay,
    }))
  }
}
