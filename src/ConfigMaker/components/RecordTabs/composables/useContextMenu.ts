// src/configMaker/components/RecordTabs/composables/useContextMenu.ts
import { ref, computed } from 'vue'
import type { useRuleState } from './useRuleState'
import { BaseRecordType } from '@shared/types'

/** コンテキストメニューの状態 */
export interface ContextMenuState {
  show: boolean
  x: number
  y: number
  rule: BaseRecordType | null
  index: number
}

/**
 * 右クリックコンテキストメニューの管理
 * 表示/非表示、位置、対象ルール、移動可否判定を提供
 */
export const useContextMenu = (ruleState: ReturnType<typeof useRuleState>) => {
  const { categoryArray } = ruleState

  /** コンテキストメニューの状態 */
  const contextMenu = ref<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    rule: null,
    index: -1,
  })

  /** ルールのインデックスを取得 */
  const getOriginalIndex = (ruleId: string): number => {
    if (!categoryArray.value) return 0
    return categoryArray.value.findIndex((rule: BaseRecordType) => rule.id === ruleId)
  }

  /** 上に移動可能かどうか */
  const canMoveUp = computed(() => {
    if (!contextMenu.value.rule) return false
    return getOriginalIndex(contextMenu.value.rule.id) > 0
  })

  /** 下に移動可能かどうか */
  const canMoveDown = computed(() => {
    if (!contextMenu.value.rule || !categoryArray.value) return false
    return getOriginalIndex(contextMenu.value.rule.id) < categoryArray.value.length - 1
  })

  /** メニュー位置を画面内に調整 */
  const adjustMenuPosition = (x: number, y: number) => {
    const menuWidth = 200 // 推定メニュー幅
    const menuHeight = 300 // 推定メニュー高さ

    let adjustedX = x
    let adjustedY = y

    // 画面右端を超える場合は左側に表示
    if (x + menuWidth > window.innerWidth) {
      adjustedX = Math.max(0, x - menuWidth)
    }

    // 画面下端を超える場合は上側に表示
    if (y + menuHeight > window.innerHeight) {
      adjustedY = Math.max(0, y - menuHeight)
    }

    // 最小値制限（画面外に出ないように）
    adjustedX = Math.max(0, Math.min(adjustedX, window.innerWidth - menuWidth))
    adjustedY = Math.max(0, Math.min(adjustedY, window.innerHeight - menuHeight))

    return { x: adjustedX, y: adjustedY }
  }

  /** コンテキストメニューを表示 */
  const showContextMenu = (event: MouseEvent, rule: BaseRecordType, index: number) => {
    event.preventDefault()

    // 位置を画面内に調整
    const { x, y } = adjustMenuPosition(event.clientX, event.clientY)

    contextMenu.value = {
      x,
      y,
      rule,
      index,
      show: true,
    }
  }

  /** コンテキストメニューを非表示 */
  const hideContextMenu = () => {
    contextMenu.value = {
      show: false,
      x: 0,
      y: 0,
      rule: null,
      index: -1,
    }
  }

  return {
    contextMenu,
    canMoveUp,
    canMoveDown,
    showContextMenu,
    hideContextMenu,
  }
}
