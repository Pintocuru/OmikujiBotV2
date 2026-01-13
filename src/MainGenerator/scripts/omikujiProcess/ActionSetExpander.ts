// src/MainGenerator/scripts/OmikujiProcess/ActionSetExpander.ts
import { ActionSetType, handelNormalizedValues, PostActionActionSetType, PostActionType } from '@/types/OmikujiData/'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'
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
      const msg = `アクションセットの展開が最大階層(${this.MAX_DEPTH})に達しました`
      console.warn(msg)
      postSystemMessage(msg, 'warn')
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
      const msg = `循環参照が検出されました: ${targetKey}`
      console.error(msg)
      postSystemMessage(msg)
      return []
    }

    // 展開
    const targetActionSet = actionSets[targetKey]
    if (!targetActionSet) {
      const msg = `アクションセット "${targetKey}" が見つかりません`
      console.error(msg)
      postSystemMessage(msg)
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
