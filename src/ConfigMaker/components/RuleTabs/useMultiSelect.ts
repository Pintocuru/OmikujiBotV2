// src/configMaker/components/RuleTabs/useMultiSelect.ts
// ! 削除予定
import { ref } from 'vue';
import { BaseTypes } from '@shared/types';

export function useMultiSelect(
 filteredRules: () => BaseTypes[],
 bulkDeleteHandler: (rules: BaseTypes[]) => void
) {
 const isMultiSelectMode = ref(false);
 const selectedRuleIds = ref(new Set<string>());

 const toggleMultiSelectMode = () => {
  isMultiSelectMode.value = !isMultiSelectMode.value;
  if (!isMultiSelectMode.value) {
   selectedRuleIds.value.clear();
  }
 };

 const handleMultiSelect = (ruleId: string, event: MouseEvent) => {
  if (!isMultiSelectMode.value) return;

  if (event.ctrlKey || event.metaKey) {
   // Ctrl/Cmd + クリック：個別に選択/解除
   if (selectedRuleIds.value.has(ruleId)) {
    selectedRuleIds.value.delete(ruleId);
   } else {
    selectedRuleIds.value.add(ruleId);
   }
  } else if (event.shiftKey && selectedRuleIds.value.size > 0) {
   // Shift + クリック：範囲選択
   handleRangeSelect(ruleId);
  } else {
   // 通常のクリック：単一選択
   selectedRuleIds.value.clear();
   selectedRuleIds.value.add(ruleId);
  }
 };

 const handleRangeSelect = (ruleId: string) => {
  const currentRules = filteredRules();
  const lastSelectedIndex = Math.max(
   ...Array.from(selectedRuleIds.value).map((id) =>
    currentRules.findIndex((rule) => rule.id === id)
   )
  );
  const clickedIndex = currentRules.findIndex((rule) => rule.id === ruleId);

  const start = Math.min(lastSelectedIndex, clickedIndex);
  const end = Math.max(lastSelectedIndex, clickedIndex);

  for (let i = start; i <= end; i++) {
   if (currentRules[i]) {
    selectedRuleIds.value.add(currentRules[i].id);
   }
  }
 };

 const selectAll = () => {
  filteredRules().forEach((rule) => {
   selectedRuleIds.value.add(rule.id);
  });
 };

 const clearSelection = () => {
  selectedRuleIds.value.clear();
 };

 const handleBulkDelete = () => {
  if (selectedRuleIds.value.size === 0) return;

  const rulesToDelete = Array.from(selectedRuleIds.value)
   .map((id) => filteredRules().find((rule) => rule.id === id))
   .filter(Boolean) as BaseTypes[];

  bulkDeleteHandler(rulesToDelete);
  selectedRuleIds.value.clear();
  isMultiSelectMode.value = false;
 };

 return {
  isMultiSelectMode,
  selectedRuleIds,
  toggleMultiSelectMode,
  handleMultiSelect,
  selectAll,
  clearSelection,
  handleBulkDelete
 };
}
