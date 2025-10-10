// src/configMaker/components/RecordTabs/composables/useRuleState.ts
import { ref, computed } from 'vue'
import { recordCategoryLabel, RecordCategoryType } from '@/types/OmikujiData/CategoryType'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { storeToRefs } from 'pinia'
import { AccessLevelLabels, AccessLevelType } from '@shared/types'

/** フィルター設定の型定義 */
export interface FilterOptions {
  enabledOnly: boolean // 有効なルールのみ表示
  colorFilter: string | null // 特定の色でフィルター
  accessFilter: AccessLevelType // AccessLevelでフィルター(開発用)
}

/**
 * ルールの基本状態管理
 * データの取得、フィルタリング、検索機能を提供
 */
export const useRuleState = () => {
  const omikujiStore = useOmikujiStore()
  const { selectedCategory } = storeToRefs(omikujiStore)

  /**
   * 基本状態
   */
  /** 選択中のカテゴリ（型安全な変換） */
  const validCategory = computed(() => toRecordCategory(selectedCategory.value))

  /** 現在のカテゴリの配列データ */
  const categoryArray = computed(() => {
    const category = validCategory.value
    if (!category) {
      console.warn('Invalid category selected:', selectedCategory.value)
      return undefined
    }
    return omikujiStore.getCategoryArray(category)
  })

  /** 単一選択されているルールのID */
  const selectedItemKey = ref<string | null>(null)

  /** 選択されているルールの詳細データ */
  const selectedItem = computed(() => {
    if (!validCategory.value || !selectedItemKey.value) return null
    return omikujiStore.getItem(validCategory.value, selectedItemKey.value)
  })

  /**
   * マルチセレクトモード
   */
  const isMultiSelectMode = ref(false)

  /**
   * フィルター・検索状態
   */
  const filterOptions = ref<FilterOptions>({
    enabledOnly: false,
    colorFilter: null,
    accessFilter: 'experimental',
  })

  const searchQuery = ref('')

  // フィルタリングをリセットする
  const resetFilterOptions = () => {
    filterOptions.value = {
      enabledOnly: false,
      colorFilter: null,
      accessFilter: 'experimental',
    }
    searchQuery.value = ''
  }

  /**
   * 計算プロパティ
   */
  /** orderでソート済みのルール一覧 */
  const sortedItems = computed(() =>
    Array.isArray(categoryArray.value) ? [...categoryArray.value].sort((a, b) => a.order - b.order) : []
  )

  /** フィルター適用済みのルール一覧 */
  const filteredSortedItems = computed(() => {
    let filtered = sortedItems.value

    // 有効ルールのみフィルター
    if (filterOptions.value.enabledOnly) {
      filtered = filtered.filter((rule) => rule.isEnabled !== false)
    }

    // カラーフィルター
    if (filterOptions.value.colorFilter) {
      filtered = filtered.filter((rule) => rule.editorColor === filterOptions.value.colorFilter)
    }

    // AccessLevelフィルター
    if (filterOptions.value.accessFilter) {
      const selectedIndex = AccessLevelLabels.indexOf(filterOptions.value.accessFilter)

      filtered = filtered.filter((rule) => {
        // undefined は basic として扱う
        const level = rule.accessLevel ?? 'basic'
        const ruleIndex = AccessLevelLabels.indexOf(level)
        return ruleIndex <= selectedIndex
      })
    }

    // 検索クエリでフィルター（名前による部分一致）
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter((rule) => (rule.name || '').toLowerCase().includes(query))
    }

    return filtered
  })

  /** カテゴリで使用中のユニークな色一覧 */
  const getUniqueColors = computed(() => {
    if (!categoryArray.value) return []
    const colors = new Set<string>()
    categoryArray.value.forEach((rule) => {
      if (rule.editorColor) {
        colors.add(rule.editorColor)
      }
    })
    return Array.from(colors).sort()
  })

  return {
    // 基本状態
    validCategory,
    categoryArray,
    selectedItemKey,
    selectedItem,
    resetFilterOptions,

    // マルチセレクトモード
    isMultiSelectMode,

    // フィルター・検索
    filterOptions,
    searchQuery,

    // 計算プロパティ
    sortedItems,
    filteredSortedItems,
    getUniqueColors,
  }
}

/**
 * 型ガード関数: string を RecordCategoryType に安全に変換
 */
function toRecordCategory(value: string): RecordCategoryType | undefined {
  return (recordCategoryLabel as readonly string[]).includes(value as RecordCategoryType)
    ? (value as RecordCategoryType)
    : undefined
}
