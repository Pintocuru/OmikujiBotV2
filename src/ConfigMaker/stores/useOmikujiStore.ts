// src/ConfigMaker/script/stores/useOmikujiStore.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { CategoryType, OmikujiDataSchema, OmikujiDataType } from '@/types/';
import { useDataOperations } from './composables/useDataOperations';
import { useCategoryOperations } from './composables/useCategoryOperations';
import { useNavigationState } from './composables/useNavigationState';
// 💡 変更：useChangeTrackingをuseSimpleChangeTrackingに置き換え
import { useSimpleChangeTracking } from './composables/useSimpleChangeTracking';

// グローバルデータの初期化
const omikujiData = OmikujiDataSchema.parse(window.omikujiData);

export const useOmikujiStore = defineStore('omikuji', () => {
 // コアデータ
 const data = ref<OmikujiDataType>(omikujiData);

 // 💡 変更：新しい変更追跡機能を使用
 const { hasUnsavedChanges, isChanges, changeOperations, markAsChanged, markAsSaved } =
  useSimpleChangeTracking();

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
 } = useCategoryOperations(data, markAsChanged); // markAsChangedを渡す

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
  hasUnsavedChanges,
  isChanges,
  changeOperations,
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
