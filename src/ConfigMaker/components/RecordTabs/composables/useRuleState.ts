// src/ConfigMaker/components/RecordTabs/composables/useRuleState.ts
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '@config/stores/useNavigationStore'

/** フィルター設定の型定義 */
export interface FilterOptions {
  colorFilter: string | null // 特定の色でフィルター
  tagFilter: string | null // 特定のタグでフィルター
}

/**
 * イベントのフィルタリング・検索機能を提供
 * ナビゲーション状態は useNavigationStore から取得
 */
export function useRuleState() {
  const navigationStore = useNavigationStore()

  // navigationStoreから必要な状態を取得
  const { validCategory, categoryArray, selectedItemKey, selectedItem } = storeToRefs(navigationStore)

  /**
   * マルチセレクトモード
   */
  const isMultiSelectMode = ref(false)

  /**
   * フィルター・検索状態
   */
  const filterOptions = ref<FilterOptions>({
    colorFilter: null,
    tagFilter: null,
  })

  const searchQuery = ref('')

  /** フィルタリングをリセット */
  const resetFilterOptions = () => {
    filterOptions.value = {
      colorFilter: null,
      tagFilter: null,
    }
    searchQuery.value = ''
  }

  /**
   * 計算プロパティ
   */

  /** orderでソート済みのイベント一覧 */
  const sortedItems = computed(() =>
    Array.isArray(categoryArray.value) ? [...categoryArray.value].sort((a, b) => a.order - b.order) : []
  )

  /** フィルター適用済みのイベント一覧 */
  const filteredSortedItems = computed(() => {
    let filtered = sortedItems.value

    // カラーフィルター
    if (filterOptions.value.colorFilter) {
      filtered = filtered.filter((rule) => rule.editorColor === filterOptions.value.colorFilter)
    }

    // タグフィルター
    if (filterOptions.value.tagFilter) {
      filtered = filtered.filter((rule) => rule.tags?.includes(filterOptions.value.tagFilter!))
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

  /** カテゴリで使用中のユニークなタグ一覧 */
  const getUniqueTags = computed(() => {
    if (!categoryArray.value) return []
    const tags = new Set<string>()
    categoryArray.value.forEach((rule) => {
      if (rule.tags && Array.isArray(rule.tags)) {
        rule.tags.forEach((tag) => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  })

  /** フィルタリング条件の説明文 */
  const filterDescription = computed(() => {
    const conditions: string[] = []

    if (filterOptions.value.colorFilter) {
      conditions.push(`カラー: ${filterOptions.value.colorFilter}`)
    }

    if (filterOptions.value.tagFilter) {
      conditions.push(`タグ: ${filterOptions.value.tagFilter}`)
    }

    if (searchQuery.value.trim()) {
      conditions.push(`検索: "${searchQuery.value.trim()}"`)
    }

    if (conditions.length === 0) {
      return ''
    }

    return `フィルター条件: ${conditions.join(' / ')}`
  })

  /** フィルターが適用されているか */
  const isFilterActive = computed(
    () =>
      filterOptions.value.colorFilter !== null ||
      filterOptions.value.tagFilter !== null ||
      searchQuery.value.trim() !== ''
  )

  /**
   * フィルター変更時の処理
   */

  /** カラーフィルターを設定（選択アイテムの自動調整付き） */
  const setColorFilter = (color: string | null) => {
    filterOptions.value.colorFilter = color
    adjustSelectedItem()
  }

  /** タグフィルターを設定（選択アイテムの自動調整付き） */
  const setTagFilter = (tag: string | null) => {
    filterOptions.value.tagFilter = tag
    adjustSelectedItem()
  }

  /** 検索クエリを設定（選択アイテムの自動調整付き） */
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    adjustSelectedItem()
  }

  /**
   * 現在選択中のアイテムがフィルター結果に含まれない場合、
   * フィルター結果の最初のアイテムを選択する
   */
  const adjustSelectedItem = () => {
    const currentKey = selectedItemKey.value

    // 選択がない、またはフィルター結果が空の場合
    if (!currentKey || filteredSortedItems.value.length === 0) {
      navigationStore.selectItem(null)
      return
    }

    // 現在の選択がフィルター結果に含まれているかチェック
    const isCurrentInFiltered = filteredSortedItems.value.some((item) => item.key === currentKey)

    // 含まれていない場合は、最初のアイテムを選択
    if (!isCurrentInFiltered) {
      navigationStore.selectItem(filteredSortedItems.value[0]?.key ?? null)
    }
  }

  return {
    // navigationStoreから取得した状態（読み取り専用）
    validCategory,
    categoryArray,
    selectedItemKey,
    selectedItem,

    // このcomposableで管理する状態
    isMultiSelectMode,
    filterOptions,
    searchQuery,
    resetFilterOptions,

    // フィルター変更メソッド
    setColorFilter,
    setTagFilter,
    setSearchQuery,
    adjustSelectedItem,

    // 計算プロパティ
    sortedItems,
    filteredSortedItems,
    getUniqueColors,
    getUniqueTags,
    filterDescription,
    isFilterActive,
  }
}
