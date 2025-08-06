// src/configMaker/components/RuleTabs/useRuleFilter.ts
import { ref, computed } from 'vue';
import { BaseTypes } from '@shared/types';
import type { FilterOptions } from './RuleTabsTypes';

export function useRuleFilter(rules: () => BaseTypes[]) {
 const searchQuery = ref('');
 const filterOptions = ref<FilterOptions>({
  query: '',
  enabledOnly: false,
  searchInName: true,
  searchInDescription: true,
  colorFilter: null
 });

 const getRuleEnabledState = (rule: BaseTypes): boolean => {
  return rule.isEnabled !== false;
 };

 const sortedRules = computed(() => {
  return Array.isArray(rules())
   ? rules()
      .slice()
      .sort((a, b) => a.order - b.order)
   : [];
 });

 const filteredSortedRules = computed(() => {
  let filtered = sortedRules.value;

  // 有効性フィルター
  if (filterOptions.value.enabledOnly) {
   filtered = filtered.filter((rule) => getRuleEnabledState(rule));
  }

  // カラーフィルター
  if (filterOptions.value.colorFilter) {
   filtered = filtered.filter((rule) => rule.editorColor === filterOptions.value.colorFilter);
  }

  // テキスト検索フィルター
  if (filterOptions.value.query) {
   const query = filterOptions.value.query.toLowerCase();
   filtered = filtered.filter((rule) => {
    let matches = false;

    if (filterOptions.value.searchInName && rule.name?.toLowerCase().includes(query)) {
     matches = true;
    }

    if (
     filterOptions.value.searchInDescription &&
     rule.description?.toLowerCase().includes(query)
    ) {
     matches = true;
    }

    return matches;
   });
  }

  return filtered;
 });

 const handleFilterChange = (filters: FilterOptions) => {
  filterOptions.value = { ...filters };
 };

 const getUniqueColors = computed(() => {
  const colors = new Set<string>();
  rules().forEach((rule) => {
   if (rule.editorColor) {
    colors.add(rule.editorColor);
   }
  });
  return Array.from(colors);
 });

 return {
  searchQuery,
  filterOptions,
  sortedRules,
  filteredSortedRules,
  getRuleEnabledState,
  handleFilterChange,
  getUniqueColors
 };
}
