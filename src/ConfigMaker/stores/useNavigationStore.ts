// src/ConfigMaker/stores/useNavigationStore.ts
import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import { CategoryType, RecordCategoryType, recordCategoryLabel } from '@/types/OmikujiData/'
import { useGetRecordData } from './useGetRecordData'

/**
 * ナビゲーションstore
 * アプリ全体のカテゴリ・アイテム選択状態を一元管理
 */
export const useNavigationStore = defineStore('navigation', () => {
  const { getCategoryArray } = useGetRecordData()

  /**
   * 状態
   */
  const selectedCategory = ref<CategoryType>('comments')
  const selectedItemKey = ref<string | null>(null)
  const activeSection = ref<string | null>(null)

  /**
   * 計算プロパティ
   */

  // RecordCategory かどうかの型ガード */
  const isRecordCategory = (category: CategoryType): category is RecordCategoryType =>
    recordCategoryLabel.includes(category as RecordCategoryType)

  // 現在のカテゴリがRecordCategoryかどうか */
  const isCurrentRecordCategory = computed(() => isRecordCategory(selectedCategory.value))

  // 型安全な現在のカテゴリ（RecordCategoryの場合のみ値を返す） */
  const validCategory = computed((): RecordCategoryType | undefined =>
    isRecordCategory(selectedCategory.value) ? selectedCategory.value : undefined
  )

  // 現在のカテゴリの配列データ */
  const categoryArray = computed(() => {
    const category = validCategory.value
    if (!category) return undefined
    return getCategoryArray(category)
  })

  // 選択されているアイテムの詳細データ */
  const selectedItem = computed(() => {
    const category = validCategory.value
    if (!category || !selectedItemKey.value || !categoryArray.value) return null
    return categoryArray.value.find((item) => item.key === selectedItemKey.value) ?? null
  })

  /**
   * 操作
   */

  // カテゴリを選択（自動的に最初のアイテムを選択） */
  const selectCategory = (category?: CategoryType) => {
    const safeCategory = category ?? 'comments'
    selectedCategory.value = safeCategory
    activeSection.value = 'Top'

    if (!isRecordCategory(safeCategory)) {
      selectedItemKey.value = null
    } else {
      const firstItem = getCategoryArray(safeCategory)[0]
      selectedItemKey.value = firstItem?.key ?? null
    }
  }

  // アイテムを選択 */
  const selectItem = (key: string | null, section?: string) => {
    selectedItemKey.value = key
    if (section) activeSection.value = section
  }

  // 選択をクリア */
  const clearSelection = () => {
    selectedItemKey.value = null
  }

  // 次のアイテムを選択（現在のアイテムが削除された時などに使用） */
  const selectNextItem = () => {
    if (!categoryArray.value || categoryArray.value.length === 0) {
      selectedItemKey.value = null
      return
    }

    const currentIndex = categoryArray.value.findIndex((item) => item.key === selectedItemKey.value)

    if (currentIndex === -1) {
      // 現在のアイテムが見つからない場合は最初を選択
      selectedItemKey.value = categoryArray.value[0].key
    } else if (currentIndex < categoryArray.value.length - 1) {
      // 次のアイテムを選択
      selectedItemKey.value = categoryArray.value[currentIndex + 1].key
    } else if (categoryArray.value.length > 1) {
      // 最後のアイテムの場合は前のアイテムを選択
      selectedItemKey.value = categoryArray.value[currentIndex - 1].key
    } else {
      // アイテムが1つしかない場合はクリア
      selectedItemKey.value = null
    }
  }

  /**
   * 初期化: commentsカテゴリの最初のアイテムを選択
   */
  watch(
    () => getCategoryArray('comments'),
    (arr) => {
      if (arr.length > 0 && selectedItemKey.value === null) {
        selectedItemKey.value = arr[0].key
      }
    },
    { immediate: true }
  )

  return {
    // 状態
    selectedCategory,
    selectedItemKey,
    activeSection,

    // 計算プロパティ
    isCurrentRecordCategory,
    validCategory,
    categoryArray,
    selectedItem,

    // 操作
    isRecordCategory,
    selectCategory,
    selectItem,
    clearSelection,
    selectNextItem,
  }
})
