// src/configMaker/components/RuleTabs/composables/useRuleState.ts
import { ref, computed, ComputedRef } from 'vue';
import { RecordCategoryType, RecordCategoryTypeMap } from '@/types/';
import { BaseTypes } from '@shared/types';
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore';

export interface FilterOptions {
 enabledOnly: boolean;
 colorFilter: string | null;
}

export const useRuleState = () => {
 // TODO:基本はuseOmikujiStoreを使うこと
 const omikujiStore = useOmikujiStore();

 // 基本状態
 const selectedCategory = ref<RecordCategoryType>('placeholders');
 const selectedRuleId = ref<string | null>(null);

 const categoryArray: ComputedRef<RecordCategoryTypeMap[RecordCategoryType][]> = computed(() =>
  omikujiStore.getCategoryArray(selectedCategory.value)
 );

 const selectedItem = computed(() =>
  // ! 型 'string | null' の引数を型 'string' のパラメーターに割り当てることはできません。
  omikujiStore.getItem(selectedCategory.value, selectedRuleId.value)
 );

 // フィルター状態
 const filterOptions = ref<FilterOptions>({
  enabledOnly: false,
  colorFilter: null
 });

 // 検索状態
 const searchQuery = ref('');

 // 計算プロパティ
 const sortedRules = computed(() =>
  Array.isArray(categoryArray.value)
   ? categoryArray.value.slice().sort((a, b) => a.order - b.order)
   : []
 );

 const filteredSortedRules = computed(() => {
  let filtered = sortedRules.value;

  if (filterOptions.value.enabledOnly) {
   filtered = filtered.filter((rule) => rule.isEnabled !== false);
  }

  if (filterOptions.value.colorFilter) {
   filtered = filtered.filter((rule) => rule.editorColor === filterOptions.value.colorFilter);
  }

  return filtered;
 });

 const getUniqueColors = computed(() => {
  const colors = new Set<string>();
  categoryArray.value.forEach((rule) => {
   if (rule.editorColor) {
    colors.add(rule.editorColor);
   }
  });
  return Array.from(colors);
 });

 // 初期化とデータ更新
 const initializeStore = (
  type: RecordCategoryType,
  rules: BaseTypes[],
  selected: BaseTypes | null
 ) => {
  selectedCategory.value = type;
  categoryArray.value = rules;
  selectedItem.value = selected;
 };

 const updateRulesData = (rules: BaseTypes[], selected: BaseTypes | null) => {
  categoryArray.value = rules;
  selectedItem.value = selected;
 };

 // フィルター操作
 const handleFilterChange = (filters: FilterOptions) => {
  filterOptions.value = { ...filters };
 };

 return {
  // State
  selectedCategory: selectedCategory,
  categoryArray: categoryArray,
  selectedItem: selectedItem,
  filterOptions,
  searchQuery,

  // Computed
  sortedRules,
  filteredSortedRules,
  getUniqueColors,

  // Actions
  initializeStore,
  updateRulesData,
  handleFilterChange
 };
};
