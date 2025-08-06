// src/configMaker/components/RuleTabs/composables/useRuleState.ts
import { ref, computed } from 'vue';
import { SelectCategoryType } from '@/types/';
import { BaseTypes } from '@shared/types';

export interface FilterOptions {
 enabledOnly: boolean;
 colorFilter: string | null;
}

export const useRuleState = () => {
 // 基本状態
 const ruleType = ref<SelectCategoryType>('placeholders');
 const allRules = ref<BaseTypes[]>([]);
 const selectedRule = ref<BaseTypes | null>(null);
 const externalStore = ref<any>(null);

 // フィルター状態
 const filterOptions = ref<FilterOptions>({
  enabledOnly: false,
  colorFilter: null
 });

 // 検索状態
 const searchQuery = ref('');

 // 計算プロパティ
 const sortedRules = computed(() =>
  Array.isArray(allRules.value) ? allRules.value.slice().sort((a, b) => a.order - b.order) : []
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
  allRules.value.forEach((rule) => {
   if (rule.editorColor) {
    colors.add(rule.editorColor);
   }
  });
  return Array.from(colors);
 });

 // 初期化とデータ更新
 const initializeStore = (
  type: SelectCategoryType,
  rules: BaseTypes[],
  selected: BaseTypes | null,
  store: any
 ) => {
  ruleType.value = type;
  allRules.value = rules;
  selectedRule.value = selected;
  externalStore.value = store;
 };

 const updateRulesData = (rules: BaseTypes[], selected: BaseTypes | null) => {
  allRules.value = rules;
  selectedRule.value = selected;
 };

 // フィルター操作
 const handleFilterChange = (filters: FilterOptions) => {
  filterOptions.value = { ...filters };
 };

 return {
  // State
  ruleType,
  allRules,
  selectedRule,
  externalStore,
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
