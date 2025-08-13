// src/configMaker/components/RecordTabs/composables/useMultiSelect.ts
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore';
import { RecordCategoryType } from '@/types';
import type { useRuleState } from './useRuleState';
import { BaseRecordType } from '@omiken/shared/types';

/**
 * マルチセレクト機能の管理
 * Ctrl/Cmd + クリック、Shift + クリック、範囲選択、一括削除を提供
 */
export const useMultiSelect = (ruleState: ReturnType<typeof useRuleState>) => {
 const omikujiStore = useOmikujiStore();
 const { validCategory, filteredSortedItems } = ruleState;

 const isMultiSelectMode = ref(false);
 const selectedRuleIds = ref(new Set<string>());

 /** マルチセレクトモードの切り替え */
 const toggleMultiSelectMode = () => {
  isMultiSelectMode.value = !isMultiSelectMode.value;
  if (!isMultiSelectMode.value) {
   selectedRuleIds.value.clear();
  }
 };

 /** マルチセレクト処理（Ctrl、Shift、通常クリック対応） */
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

 /** 範囲選択の処理 */
 const handleRangeSelect = (ruleId: string) => {
  const currentRules = filteredSortedItems.value;
  const lastSelectedIndex = Math.max(
   ...Array.from(selectedRuleIds.value).map((id) =>
    currentRules.findIndex((rule: BaseRecordType) => rule.id === id)
   )
  );
  const clickedIndex = currentRules.findIndex((rule: BaseRecordType) => rule.id === ruleId);

  const start = Math.min(lastSelectedIndex, clickedIndex);
  const end = Math.max(lastSelectedIndex, clickedIndex);

  for (let i = start; i <= end; i++) {
   if (currentRules[i]) {
    selectedRuleIds.value.add(currentRules[i].id);
   }
  }
 };

 /** 全選択 */
 const selectAll = () => {
  filteredSortedItems.value.forEach((rule: BaseRecordType) => {
   selectedRuleIds.value.add(rule.id);
  });
 };

 /** 選択解除 */
 const clearSelection = () => {
  selectedRuleIds.value.clear();
  isMultiSelectMode.value = false;
 };

 /** 一括削除の実行 */
 const handleBulkDelete = () => {
  if (selectedRuleIds.value.size === 0) return;

  const rulesToDelete = Array.from(selectedRuleIds.value)
   .map((id) => filteredSortedItems.value.find((rule: BaseRecordType) => rule.id === id))
   .filter(Boolean) as BaseRecordType[];

  handleBulkDeleteRules(rulesToDelete);
  selectedRuleIds.value.clear();
  isMultiSelectMode.value = false;
 };

 /** 一括削除の確認ダイアログ */
 const handleBulkDeleteRules = (rulesToDelete: BaseRecordType[]) => {
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
       filteredSortedItems.value.findIndex((rule: BaseRecordType) => rule.id === a.id) ?? -1;
      const indexB =
       filteredSortedItems.value.findIndex((rule: BaseRecordType) => rule.id === b.id) ?? -1;
      return indexB - indexA;
     });

     sortedRules.forEach((rule) => {
      omikujiStore.removeItem(validCategory.value as RecordCategoryType, rule.id);
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
