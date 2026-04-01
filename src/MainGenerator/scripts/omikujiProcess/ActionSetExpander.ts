// src/MainGenerator/scripts/OmikujiProcess/ActionSetExpander.ts
import { ActionSetType, handelNormalizedValues, PostFlowCallType, PostFlowType } from '@/types/OmikujiData/'
import { postSystemMessage } from '@shared/sdk/post/PostOneComme'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'

export class ActionSetExpander {
  private static readonly MAX_DEPTH = 10

  static expand(
    actions: PostFlowType[],
    actionSets: Record<string, ActionSetType>,
    depth: number = 0,
    visited: Set<string> = new Set()
  ): PostFlowType[] {
    if (depth >= this.MAX_DEPTH) {
      const msg = `アクションセットの展開が最大階層(${this.MAX_DEPTH})に達しました`
      console.warn(msg)
      postSystemMessage(msg, { username: 'warn' })
      return actions
    }

    const expandedActions: PostFlowType[] = []

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
    action: PostFlowCallType,
    actionSets: Record<string, ActionSetType>,
    depth: number,
    visited: Set<string>
  ): PostFlowType[] {
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

  private static adjustDelays(actions: PostFlowType[], baseDelay: number): PostFlowType[] {
    return actions.map((action) => ({
      ...action,
      delaySeconds: (action.delaySeconds || 0) + baseDelay,
    }))
  }
}
