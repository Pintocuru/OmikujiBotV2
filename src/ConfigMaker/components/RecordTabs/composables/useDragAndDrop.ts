// src/ConfigMaker/components/RecordTabs/composables/useDragAndDrop.ts
import { ref, computed } from 'vue'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { BaseRecordType } from '@shared/types'
import { useRecordTabsStore } from '../RecordTabsStore'
import { storeToRefs } from 'pinia'

/**
 * ドラッグ&ドロップによる並び替え機能
 * Vuedraggableライブラリとの統合、順序変更の管理を提供
 */
export const useDragAndDrop = () => {
  const omikujiStore = useOmikujiStore()
  const recordTabsStore = useRecordTabsStore()
  const { filteredSortedItems, categoryArray, validCategory, isMultiSelectMode } = storeToRefs(recordTabsStore)

  /** ドラッグ操作中フラグ */
  const isDragging = ref(false)

  /**
   * Vuedraggableで使用する双方向バインド用computed
   * ドラッグ操作時のみ順序変更を実行
   */
  const draggableRules = computed({
    get: () => filteredSortedItems.value,
    set: (newOrder: BaseRecordType[]) => {
      // ドラッグ中かつマルチセレクトモードでない場合のみ並び替え実行
      if (isDragging.value && !isMultiSelectMode.value) {
        handleReorderFromDrag(newOrder)
      }
    },
  })

  /**
   * ドラッグ操作による順序変更を処理
   * 新しい順序に基づいて各イベントの位置を更新
   */
  const handleReorderFromDrag = (newOrder: BaseRecordType[]) => {
    if (!validCategory.value || !categoryArray.value) return

    const originalOrder = [...categoryArray.value]

    // 方法1: 一括でorder値を更新する方式（推奨）
    const orderUpdates: Array<{ key: string; newOrder: number }> = []

    newOrder.forEach((rule, newIndex) => {
      const currentIndex = originalOrder.findIndex((r: BaseRecordType) => r.key === rule.key)

      // 位置が変更された場合、新しいorder値を記録
      if (currentIndex !== -1 && currentIndex !== newIndex) {
        orderUpdates.push({
          key: rule.key,
          newOrder: newIndex + 1, // orderは1から始まる
        })
      }
    })

    // 一括更新を実行
    if (orderUpdates.length > 0) {
      omikujiStore.batchUpdateOrder(validCategory.value, orderUpdates)
    }
  }

  /** ドラッグ開始時の処理 */
  const onDragStart = () => {
    isDragging.value = true
  }

  /** ドラッグ終了時の処理 */
  const onDragEnd = () => {
    // わずかな遅延を入れて他の処理との競合を避ける
    setTimeout(() => {
      isDragging.value = false
    }, 100)
  }

  return {
    draggableRules,
    onDragStart,
    onDragEnd,
  }
}
