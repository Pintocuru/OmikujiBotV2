// src/ConfigMaker/script/stores/useOmikujiStore.ts
import { nextTick, readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { CategoryType, isDev, OmikujiDataSchema, OmikujiDataType } from '@/types/'
import { useDataOperations } from './composables/useDataOperations'
import { useNavigationState } from './composables/useNavigationState'
import { useRecordOperations } from './composables/useRecordOperations'
import { useSettingsOperations } from './composables/useSettingsOperations'

// グローバルデータの初期化
const omikujiData = OmikujiDataSchema.parse(window.omikujiData)

export const useOmikujiStore = defineStore('omikuji', () => {
  // コアデータ
  // isDev の時は、開発者用プリセット管理 を使うために初期値にする(omikujiData.jsを編集させない)
  const data = ref<OmikujiDataType>(!isDev ? omikujiData : OmikujiDataSchema.parse({}))

  // 変更があったかどうかを追跡するフラグ
  const hasChanged = ref(false)
  let isInitializing = true
  useOmikujiStore().$subscribe(() => {
    if (!isInitializing) hasChanged.value = true
  })
  nextTick(() => (isInitializing = false)) // 初期化完了後

  // ナビゲーション状態管理
  const {
    selectedCategory,
    selectedRuleId,
    selectCategory: _selectCategory,
    selectRule,
    clearSelection,
  } = useNavigationState()

  // データ操作機能
  const { loadData, validateData, exportData, mergeDataSets, updateData } = useDataOperations(data)

  // カテゴリ(rules/placeholder/character)操作機能
  const {
    addItem,
    updateItem,
    removeItem,
    duplicateItem,
    updateRecordProperty,
    updateOmikujiPostActions,
    updatePlaceholderValues,
    updateCategoryData,
    getItem,
    getCategoryMap,
    getCategoryArray,
    reorderItem,
  } = useRecordOperations(data)

  // カテゴリ外(scriptSettings/displaySettings/wordPartySettings)操作機能
  const { updateDisplaySettings, updateScriptSettings, updateWordPartySettings, updateMeta } =
    useSettingsOperations(data)

  // カテゴリ選択のラッパー関数（依存関係のため）
  const selectCategory = (category: CategoryType) => {
    _selectCategory(category, (cat: any) => getCategoryMap(cat))
  }

  return {
    data,

    // 変更追跡
    hasChanged,

    // ナビゲーション状態
    selectedCategory,
    selectedRuleId,

    // データ操作
    loadData,
    validateData,
    exportData,
    mergeDataSets,
    updateData,

    // カテゴリ操作
    addItem,
    updateItem,
    removeItem,
    duplicateItem,
    updateRecordProperty,
    updateOmikujiPostActions,
    updatePlaceholderValues,
    updateCategoryData,
    getItem,
    getCategoryMap,
    getCategoryArray,
    reorderItem,

    // カテゴリ外操作
    updateDisplaySettings,
    updateScriptSettings,
    updateWordPartySettings,
    updateMeta,

    // ナビゲーション
    selectCategory,
    selectRule,
    clearSelection,
  }
})
