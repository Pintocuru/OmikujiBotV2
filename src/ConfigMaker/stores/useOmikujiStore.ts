// src/ConfigMaker/script/stores/useOmikujiStore.ts
import { readonly, ref } from 'vue';
import { defineStore } from 'pinia';
import { CategoryType, OmikujiDataSchema, OmikujiDataType } from '@/types/';
import { useDataOperations } from './composables/useDataOperations';
import { useNavigationState } from './composables/useNavigationState';
import { useRecordOperations } from './composables/useRecordOperations';
import { useSettingsOperations } from './composables/useSettingsOperations';

// グローバルデータの初期化
const omikujiData = OmikujiDataSchema.parse(window.omikujiData);

export const useOmikujiStore = defineStore('omikuji', () => {
 // コアデータ 外部にはreadonlyなdataを公開
 const data = ref<OmikujiDataType>(omikujiData);
 const readOnlyData = readonly(data);

 // 変更があったかどうかを追跡するフラグ
 const hasChanged = ref(false);
 useOmikujiStore().$subscribe(() => (hasChanged.value = true));

 // ナビゲーション状態管理
 const {
  selectedCategory,
  selectedRuleId,
  selectCategory: _selectCategory,
  selectRule,
  clearSelection
 } = useNavigationState();

 // データ操作機能
 const { loadData, validateData, exportData, mergeDataSets, updateData } = useDataOperations(data);

 // カテゴリ(rules/placeholder/character)操作機能
 const {
  addItem,
  updateItem,
  removeItem,
  duplicateItem,
  updateRuleNestedProperty,
  updateCategoryData,
  getItem,
  getCategoryMap,
  getCategoryArray,
  reorderItem
 } = useRecordOperations(data);

 // カテゴリ外(scriptSettings/displaySettings/wordPartySettings)操作機能
 const { updateDisplaySettings, updateScriptSettings, updateWordPartySettings } =
  useSettingsOperations(data);

 // カテゴリ選択のラッパー関数（依存関係のため）
 const selectCategory = (category: CategoryType) => {
  _selectCategory(category, getCategoryMap);
 };

 return {
  // データ
  data: readOnlyData,

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
  updateRuleNestedProperty,
  updateCategoryData,
  getItem,
  getCategoryMap,
  getCategoryArray,
  reorderItem,

  // カテゴリ外操作
  updateDisplaySettings,
  updateScriptSettings,
  updateWordPartySettings,

  // ナビゲーション
  selectCategory,
  selectRule,
  clearSelection
 };
});
