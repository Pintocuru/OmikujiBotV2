// src/configMaker/components/RuleTabs/composables/useMultiSelect.ts
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { BaseTypes } from '@shared/types';

export const useMultiSelect = (filteredSortedRules: any) => {
 const isMultiSelectMode = ref(false);
 const selectedRuleIds = ref(new Set<string>());

 // 削除用選択機能
 const toggleMultiSelectMode = () => {
  isMultiSelectMode.value = !isMultiSelectMode.value;
  if (!isMultiSelectMode.value) {
   selectedRuleIds.value.clear();
  }
 };

 const handleMultiSelect = (ruleId: string, event: MouseEvent) => {
  if (!isMultiSelectMode.value) return;

  event.preventDefault();
  event.stopPropagation();

  if (event.ctrlKey || event.metaKey) {
   // Ctrl/Cmd クリック: 個別の選択/解除
   if (selectedRuleIds.value.has(ruleId)) {
    selectedRuleIds.value.delete(ruleId);
   } else {
    selectedRuleIds.value.add(ruleId);
   }
  } else if (event.shiftKey && selectedRuleIds.value.size > 0) {
   // Shift クリック: 範囲選択
   handleRangeSelect(ruleId);
  } else {
   // 通常のクリック: 単一選択
   if (selectedRuleIds.value.has(ruleId)) {
    selectedRuleIds.value.delete(ruleId);
   } else {
    selectedRuleIds.value.add(ruleId);
   }
  }
 };

 const handleRangeSelect = (ruleId: string) => {
  const currentRules = filteredSortedRules.value;
  const lastSelectedIndex = Math.max(
   ...Array.from(selectedRuleIds.value).map((id) =>
    currentRules.findIndex((rule: BaseTypes) => rule.id === id)
   )
  );
  const clickedIndex = currentRules.findIndex((rule: BaseTypes) => rule.id === ruleId);

  const start = Math.min(lastSelectedIndex, clickedIndex);
  const end = Math.max(lastSelectedIndex, clickedIndex);

  for (let i = start; i <= end; i++) {
   if (currentRules[i]) {
    selectedRuleIds.value.add(currentRules[i].id);
   }
  }
 };

 const selectAll = () => {
  filteredSortedRules.value.forEach((rule: BaseTypes) => {
   selectedRuleIds.value.add(rule.id);
  });
 };

 const clearSelection = () => {
  selectedRuleIds.value.clear();
  isMultiSelectMode.value = false;
 };

 const handleBulkDelete = () => {
  if (selectedRuleIds.value.size === 0) return;

  const rulesToDelete = Array.from(selectedRuleIds.value)
   .map((id) => filteredSortedRules.value.find((rule: BaseTypes) => rule.id === id))
   .filter(Boolean) as BaseTypes[];

  handleBulkDeleteRules(rulesToDelete);
  selectedRuleIds.value.clear();
  isMultiSelectMode.value = false;
 };

 const handleBulkDeleteRules = (rulesToDelete: BaseTypes[]) => {
  if (rulesToDelete.length === 0) return;

  const ruleNames = rulesToDelete.map((rule) => rule.name || '名前未設定').join('、');
  const count = rulesToDelete.length;

  toast.error(`${count}件のルールを削除しますか？`, {
   description: `削除対象: ${ruleNames.length > 50 ? ruleNames.substring(0, 50) + '...' : ruleNames}`,
   duration: 0,
   action: {
    label: `${count}件削除する`,
    onClick: () => {
     const sortedRules = [...rulesToDelete].sort((a, b) => {
      const indexA =
       filteredSortedRules.value.findIndex((rule: BaseTypes) => rule.id === a.id) ?? -1;
      const indexB =
       filteredSortedRules.value.findIndex((rule: BaseTypes) => rule.id === b.id) ?? -1;
      return indexB - indexA;
     });

     sortedRules.forEach((rule) => {
      externalStore.value?.remove?.(rule.id);
     });

     toast.success(`${count}件のルールを削除しました`, {
      description: '一括削除が完了しました',
      duration: 3000
     });
    }
   },
   cancel: {
    label: 'キャンセル',
    onClick: () => toast.dismiss()
   },
   closeButton: true
  });
 };

 return {
  isMultiSelectMode,
  selectedRuleIds,
  toggleMultiSelectMode,
  handleMultiSelect,
  selectAll,
  clearSelection,
  handleBulkDelete,
  handleBulkDeleteRules
 };
};
