// src/ConfigMaker/script/stores/useOmikujiStore.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { CategoryType, OmikujiDataSchema, OmikujiDataType } from '@/types/';
import { useDataOperations } from './composables/useDataOperations';
import { useCategoryOperations } from './composables/useCategoryOperations';
import { useNavigationState } from './composables/useNavigationState';
import { useChangeTracking } from './composables/useChangeTracking';

// グローバルデータの初期化
const omikujiData = OmikujiDataSchema.parse(window.omikujiData);

export const useOmikujiStore = defineStore('omikuji', () => {
 // コアデータ
 const data = ref<OmikujiDataType>(omikujiData);

 // 変更追跡機能
 const { hasUnsavedChanges, isDataChanged, markAsChanged, markAsSaved } = useChangeTracking(
  data,
  omikujiData
 );

 // ナビゲーション状態管理
 const {
  selectedCategory,
  selectedRuleId,
  selectCategory: _selectCategory,
  selectRule,
  clearSelection
 } = useNavigationState();

 // データ操作機能
 const { loadData, validateData, exportData, mergeDataSets, updateData } = useDataOperations(
  data,
  markAsChanged,
  markAsSaved
 );

 // カテゴリ操作機能
 const {
  addItemToCategory,
  updateItemInCategory,
  removeItemFromCategory,
  duplicateItemInCategory,
  updateRuleNestedProperty,
  updateCategoryData,
  getItemFromCategory,
  getCategoryItems
 } = useCategoryOperations(data, markAsChanged);

 // カテゴリ選択のラッパー関数（依存関係のため）
 const selectCategory = (category: CategoryType) => {
  _selectCategory(category, getCategoryItems);
 };

 return {
  // データ
  data,

  // ナビゲーション状態
  selectedCategory,
  selectedRuleId,

  // 変更追跡
  isDataChanged,
  hasUnsavedChanges,
  markAsChanged,
  markAsSaved,

  // データ操作
  loadData,
  validateData,
  exportData,
  mergeDataSets,
  updateData,

  // カテゴリ操作
  addItemToCategory,
  updateItemInCategory,
  removeItemFromCategory,
  duplicateItemInCategory,
  updateRuleNestedProperty,
  updateCategoryData,
  getItemFromCategory,
  getCategoryItems,

  // ナビゲーション
  selectCategory,
  selectRule,
  clearSelection
 };
});
