// src/ConfigMaker/script/stores/useOmikujiStore.ts
import { readonly, ref } from 'vue';
import { defineStore } from 'pinia';
import { CategoryType, OmikujiDataSchema, OmikujiDataType } from '@/types/';
import { useDataOperations } from './composables/useDataOperations';
import { useNavigationState } from './composables/useNavigationState';
import { useRecordOperations } from './composables/useRecordOperations';
import { useSettingsOperations } from './composables/useSettingsOperations';
import { useSimpleChangeTracking } from './composables/useSimpleChangeTracking';

// グローバルデータの初期化
const omikujiData = OmikujiDataSchema.parse(window.omikujiData);

export const useOmikujiStore = defineStore('omikuji', () => {
 // コアデータ
 const data = ref<OmikujiDataType>(omikujiData);
 const readOnlyData = readonly(data); // 外部にはreadonlyなdataを公開

 // 新しい変更追跡機能
 const { checkCount, changeOperations, markAsChanged, markAsSaved } = useSimpleChangeTracking();

 // ナビゲーション状態管理
 const {
  selectedCategory,
  selectedRuleId,
  selectRecordCategory: _selectRecordCategory,
  selectRule,
  clearSelection
 } = useNavigationState();

 // データ操作機能
 const { loadData, validateData, exportData, mergeDataSets, updateData } = useDataOperations(
  data,
  markAsChanged,
  markAsSaved
 );

 // カテゴリ(rules/placeholder/character)操作機能
 const {
  addItem,
  updateItem,
  removeItem,
  duplicateItem,
  updateRuleNestedProperty,
  updateCategoryData,
  getItemFromCategory,
  getCategoryItems
 } = useRecordOperations(data, markAsChanged); // markAsChangedを渡す

 // カテゴリ外(scriptSettings/displaySettings/wordPartySettings)操作機能
 const { updateDisplaySettings, updateScriptSettings, updateWordPartySettings } =
  useSettingsOperations(data, markAsChanged);

 // カテゴリ選択のラッパー関数（依存関係のため）
 const selectRecordCategory = (category: CategoryType) => {
  _selectRecordCategory(category, getCategoryItems);
 };

 return {
  // データ
  data: readOnlyData,

  // ナビゲーション状態
  selectedCategory,
  selectedRuleId,

  // 変更追跡
  checkCount,
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
  addItem,
  updateItem,
  removeItem,
  duplicateItem,
  updateRuleNestedProperty,
  updateCategoryData,
  getItemFromCategory,
  getCategoryItems,

  // カテゴリ外操作
  updateDisplaySettings,
  updateScriptSettings,
  updateWordPartySettings,

  // ナビゲーション
  selectRecordCategory,
  selectRule,
  clearSelection
 };
});
