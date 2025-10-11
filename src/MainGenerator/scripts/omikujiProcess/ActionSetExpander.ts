// src/MainGenerator/scripts/OmikujiProcess/ActionSetExpander.ts
import { PostActionRecordType, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'

/**
 * アクションセットの展開を担当するクラス
 */
export class ActionSetExpander {
  private static readonly MAX_DEPTH = 10

  /**
   * アクションセットを展開する（再帰的、最大10階層）
   * @param actions 展開対象のアクション配列
   * @param actionSets 全アクションセットのデータ
   * @param depth 現在の展開階層（デフォルト: 0）
   * @param visited 訪問済みのアクションセットキー（循環参照防止用）
   * @returns 展開されたアクション配列
   */
  static expand(
    actions: PostActionType[],
    actionSets: Record<string, PostActionRecordType>,
    depth: number = 0,
    visited: Set<string> = new Set()
  ): PostActionType[] {
    // 最大展開回数チェック
    if (depth >= this.MAX_DEPTH) {
      ConsolePost('warn', `アクションセットの展開が最大階層(${this.MAX_DEPTH})に達しました`)
      return actions
    }

    const expandedActions: PostActionType[] = []

    for (const action of actions) {
      if (action.actionType === 'actionSet' && action.actionSetKey) {
        const expandedAction = this.expandSingleActionSet(action, actionSets, depth, visited)
        expandedActions.push(...expandedAction)
      } else {
        // actionSet以外のアクションはそのまま追加
        expandedActions.push(action)
      }
    }

    return expandedActions
  }

  /**
   * 単一のアクションセットを展開
   */
  private static expandSingleActionSet(
    action: PostActionType,
    actionSets: Record<string, PostActionRecordType>,
    depth: number,
    visited: Set<string>
  ): PostActionType[] {
    const cleanedAction = this.cleanActionSetAction(action)
    const targetKey = cleanedAction.actionSetKey

    // 循環参照チェック
    if (visited.has(targetKey)) {
      ConsolePost('error', `循環参照が検出されました: ${targetKey}`)
      return []
    }

    const targetActionSet = actionSets[targetKey]
    if (!targetActionSet) {
      ConsolePost('warn', `アクションセット "${targetKey}" が見つかりません`)
      return []
    }

    // 新しいvisitedセットを作成（このブランチ専用）
    const newVisited = new Set(visited)
    newVisited.add(targetKey)

    // アクションセットの各アクションにdelaySecondsを加算
    const adjustedActions = this.adjustDelays(targetActionSet.postActions, cleanedAction.delaySeconds)

    // 再帰的に展開（次の階層）
    return this.expand(adjustedActions, actionSets, depth + 1, newVisited)
  }

  /**
   * アクションセットの各アクションにdelaySecondsを加算
   */
  private static adjustDelays(actions: PostActionType[], baseDelay: number): PostActionType[] {
    return actions.map((action) => ({
      ...action,
      delaySeconds: (action.delaySeconds || 0) + baseDelay,
    }))
  }

  /**
   * actionSet用のアクションから必要なプロパティのみを抽出
   */
  private static cleanActionSetAction(action: PostActionType): {
    actionType: 'actionSet'
    actionSetKey: string
    delaySeconds: number
  } {
    return {
      actionType: 'actionSet',
      actionSetKey: action.actionSetKey!,
      delaySeconds: action.delaySeconds || 0,
    }
  }
}
