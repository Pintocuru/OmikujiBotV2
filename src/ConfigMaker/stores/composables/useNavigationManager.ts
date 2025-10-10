// src/ConfigMaker/script/stores/composables/useNavigationManager.ts
import { ref, computed } from 'vue'
import { CategoryType, RecordCategoryType, recordCategoryLabel } from '@/types/OmikujiData/CategoryType'
import { useRecordDataAccess } from './useRecordDataAccess'

/**
 * ナビゲーション状態とカテゴリ/アイテム選択を管理
 * keyベースでの選択に統一
 */
export function useNavigationManager(recordDataAccess: ReturnType<typeof useRecordDataAccess>) {
  // ========================================
  // 状態
  // ========================================
  const selectedCategory = ref<CategoryType>('comments')
  const selectedItemKey = ref<string | null>(null)

  // ========================================
  // 計算プロパティ
  // ========================================
  const isRecordCategory = computed(() => recordCategoryLabel.includes(selectedCategory.value as RecordCategoryType))

  const currentCategoryItems = computed(() => {
    if (!isRecordCategory.value) return {}
    return recordDataAccess.getCategoryMap(selectedCategory.value as RecordCategoryType)
  })

  const currentSelectedItem = computed(() => {
    if (!selectedItemKey.value || !isRecordCategory.value) return null
    return currentCategoryItems.value[selectedItemKey.value] || null
  })

  const orderedCategoryItems = computed(() => {
    return Object.values(currentCategoryItems.value).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  })

  const hasItems = computed(() => orderedCategoryItems.value.length > 0)

  // ========================================
  // カテゴリ選択
  // ========================================
  const selectCategory = (category: CategoryType) => {
    selectedCategory.value = category

    if (!recordCategoryLabel.includes(category as RecordCategoryType)) {
      selectedItemKey.value = null
      return
    }

    // 最初のアイテムを自動選択
    const firstItem = orderedCategoryItems.value[0]
    selectedItemKey.value = firstItem?.key || null
  }

  // ========================================
  // アイテム選択
  // ========================================
  const selectItem = (key: string) => {
    selectedItemKey.value = key
  }

  const clearSelection = () => {
    selectedItemKey.value = null
  }

  // ========================================
  // アイテム削除後の選択更新
  // ========================================
  /**
   * アイテム削除後に適切なアイテムを選択する
   * 削除されたアイテムより前のアイテムを優先的に選択
   */
  const selectItemAfterDeletion = (deletedKey: string, category: RecordCategoryType) => {
    if (selectedItemKey.value !== deletedKey || category !== selectedCategory.value) {
      return // 削除対象が選択中でない、または別カテゴリの場合は何もしない
    }

    const items = recordDataAccess.getCategoryMap(category)
    const deletedItem = items[deletedKey]
    const currentOrder = deletedItem?.order ?? 0

    // 利用可能なアイテムを取得（削除対象を除外）
    const availableItems = Object.entries(items)
      .filter(([key]) => key !== deletedKey)
      .map(([key, item]) => ({ key, order: item.order ?? 0 }))
      .sort((a, b) => a.order - b.order)

    if (availableItems.length === 0) {
      selectedItemKey.value = null
      return
    }

    // 削除アイテムより小さいorder値のアイテムを探す
    const previousItem = availableItems
      .slice()
      .reverse()
      .find((item) => item.order < currentOrder)

    selectedItemKey.value = previousItem?.key || availableItems[0]?.key || null
  }

  return {
    // 状態
    selectedCategory,
    selectedItemKey,

    // 計算プロパティ
    isRecordCategory,
    currentCategoryItems,
    currentSelectedItem,
    orderedCategoryItems,
    hasItems,

    // 操作
    selectCategory,
    selectItem,
    clearSelection,
    selectItemAfterDeletion,
  }
}
