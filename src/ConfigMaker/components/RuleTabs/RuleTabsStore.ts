// src/configMaker/components/RuleTabs/RuleTabsStore.ts
import { defineStore } from 'pinia';
import { ref, computed, ComponentPublicInstance } from 'vue';
import { CategoryType } from '@/types/';
import { BaseTypes } from '@shared/types';
import { toast } from 'vue-sonner';

export interface FilterOptions {
 enabledOnly: boolean; // 有効のみ
 colorFilter: string | null; // 色
}

export interface ContextMenuState {
 show: boolean;
 x: number;
 y: number;
 rule: BaseTypes | null;
 index: number;
}

export const useRuleTabsStore = defineStore('ruleTabs', () => {
 // State
 const ruleType = ref<CategoryType>('placeholders');
 const searchQuery = ref('');
 const isMultiSelectMode = ref(false);
 const selectedRuleIds = ref(new Set<string>());
 const isDragging = ref(false);

 // インライン編集の状態
 const editingRuleId = ref<string | null>(null);
 const editingName = ref('');
 const editInput = ref<HTMLInputElement | null>(null);

 const filterOptions = ref<FilterOptions>({
  enabledOnly: false, // 有効のみ
  colorFilter: null // 色
 });

 const contextMenu = ref<ContextMenuState>({
  show: false,
  x: 0,
  y: 0,
  rule: null,
  index: -1
 });

 // 外部ストアの参照（動的に設定される）
 const externalStore = ref<any>(null);
 const allRules = ref<BaseTypes[]>([]);
 const selectedRule = ref<BaseTypes | null>(null);

 // Getters
 const sortedRules = computed(() => {
  return Array.isArray(allRules.value)
   ? allRules.value.slice().sort((a, b) => a.order - b.order)
   : [];
 });

 const filteredSortedRules = computed(() => {
  let filtered = sortedRules.value;

  // 有効性フィルター
  if (filterOptions.value.enabledOnly) {
   filtered = filtered.filter((rule) => rule.isEnabled !== false);
  }

  // カラーフィルター
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

 const canMoveUp = computed(() => {
  if (!contextMenu.value.rule) return false;
  return getOriginalIndex(contextMenu.value.rule.id) > 0;
 });

 const canMoveDown = computed(() => {
  if (!contextMenu.value.rule) return false;
  return getOriginalIndex(contextMenu.value.rule.id) < allRules.value.length - 1;
 });

 const draggableRules = computed({
  get: () => filteredSortedRules.value,
  set: (newOrder: BaseTypes[]) => {
   if (isDragging.value && !isMultiSelectMode.value) {
    handleReorderFromDrag(newOrder);
   }
  }
 });

 // Actions
 const initializeStore = (
  type: CategoryType,
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

 // Filter Actions
 const handleFilterChange = (filters: FilterOptions) => {
  filterOptions.value = { ...filters };
 };

 // Rule Management Actions
 const handleSelectRule = (ruleId: string) => {
  externalStore.value?.selectRule?.(ruleId);
 };

 const handleAddNewRule = () => {
  externalStore.value?.add?.();
  toast.success('新しいルールを追加しました', {
   description: 'ルールの設定を行ってください',
   duration: 3000
  });
 };

 const handleUpdateRule = (ruleId: string, updates: BaseTypes) => {
  externalStore.value?.update?.(ruleId, updates);
  if (updates.name) {
   toast.success('ルールを更新しました', {
    description: `「${updates.name}」の設定を保存しました`,
    duration: 2000
   });
  }
 };

 const handleDuplicateRule = (ruleId: string) => {
  externalStore.value?.duplicate?.(ruleId);
  toast.success('ルールを複製しました', {
   description: `コピーを作成しました`,
   duration: 3000
  });
 };

 const handleDeleteRule = (ruleId: string, ruleName?: string) => {
  const name = ruleName || '名前未設定';
  toast.error(`「${name}」を削除しますか？`, {
   description: 'この操作は取り消せません',
   duration: 0,
   action: {
    label: '削除する',
    onClick: () => {
     externalStore.value?.remove?.(ruleId);
     toast.success('ルールを削除しました', {
      description: `「${name}」を削除しました`,
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

 const handleMoveRuleUp = (ruleId: string, currentIndex: number) => {
  if (currentIndex > 0) {
   externalStore.value?.reorder?.(currentIndex, currentIndex - 1);
  }
 };

 const handleMoveRuleDown = (ruleId: string, currentIndex: number, totalLength: number) => {
  if (currentIndex < totalLength - 1) {
   externalStore.value?.reorder?.(currentIndex, currentIndex + 1);
  }
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
      const indexA = allRules.value.findIndex((rule) => rule.id === a.id) ?? -1;
      const indexB = allRules.value.findIndex((rule) => rule.id === b.id) ?? -1;
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

 // Multi Select Actions
 const toggleMultiSelectMode = () => {
  isMultiSelectMode.value = !isMultiSelectMode.value;
  if (!isMultiSelectMode.value) {
   selectedRuleIds.value.clear();
  }
 };

 // Multi Select Actions の handleMultiSelect メソッドを以下に置き換え
 const handleMultiSelect = (ruleId: string, event: MouseEvent) => {
  if (!isMultiSelectMode.value) return;

  event.preventDefault(); // デフォルトの動作を防ぐ
  event.stopPropagation(); // イベントの伝播を止める

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
   // 通常のクリック: 単一選択（既存の選択を維持したい場合）
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
  filteredSortedRules.value.forEach((rule) => {
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
   .map((id) => filteredSortedRules.value.find((rule) => rule.id === id))
   .filter(Boolean) as BaseTypes[];

  handleBulkDeleteRules(rulesToDelete);
  selectedRuleIds.value.clear();
  isMultiSelectMode.value = false;
 };

 // Context Menu Actions
 const showContextMenu = (event: MouseEvent, rule: BaseTypes, index: number) => {
  contextMenu.value = {
   x: event.clientX,
   y: event.clientY,
   rule,
   index,
   show: true
  };
 };

 const hideContextMenu = () => {
  contextMenu.value = {
   show: false,
   x: 0,
   y: 0,
   rule: null,
   index: -1
  };
 };

 const getOriginalIndex = (ruleId: string): number => {
  return allRules.value.findIndex((rule) => rule.id === ruleId);
 };

 const getDisplayIndex = (ruleId: string) => {
  return allRules.value.findIndex((rule) => rule.id === ruleId);
 };

 // Drag and Drop Actions
 const handleReorderFromDrag = (newOrder: BaseTypes[]) => {
  const originalOrder = [...allRules.value];

  for (let newIndex = 0; newIndex < newOrder.length; newIndex++) {
   const rule = newOrder[newIndex];
   const currentIndex = originalOrder.findIndex((r) => r.id === rule.id);

   if (currentIndex !== -1 && currentIndex !== newIndex) {
    externalStore.value?.reorder?.(currentIndex, newIndex);
    const [movedRule] = originalOrder.splice(currentIndex, 1);
    originalOrder.splice(newIndex, 0, movedRule);
   }
  }
 };

 const onDragStart = () => {
  isDragging.value = true;
 };

 const onDragEnd = () => {
  setTimeout(() => {
   isDragging.value = false;
  }, 100);
 };

 // Context Menu Handler Actions
 const handleContextMoveUp = () => {
  if (contextMenu.value.rule && canMoveUp.value) {
   const originalIndex = getOriginalIndex(contextMenu.value.rule.id);
   handleMoveRuleUp(contextMenu.value.rule.id, originalIndex);
  }
  hideContextMenu();
 };

 const handleContextMoveDown = () => {
  if (contextMenu.value.rule && canMoveDown.value) {
   const originalIndex = getOriginalIndex(contextMenu.value.rule.id);
   handleMoveRuleDown(contextMenu.value.rule.id, originalIndex, allRules.value.length);
  }
  hideContextMenu();
 };

 const handleContextDuplicate = () => {
  if (contextMenu.value.rule) {
   handleDuplicateRule(contextMenu.value.rule.id);
  }
  hideContextMenu();
 };

 const handleContextDelete = () => {
  if (contextMenu.value.rule) {
   handleDeleteRule(contextMenu.value.rule.id, contextMenu.value.rule.name);
  }
  hideContextMenu();
 };

 // Inline Edit Actions
 const startInlineEdit = (rule: BaseTypes) => {
  editingRuleId.value = rule.id;
  editingName.value = rule.name || '';
 };

 const finishInlineEdit = () => {
  if (editingRuleId.value && editingName.value.trim()) {
   handleUpdateRule(editingRuleId.value, {
    name: editingName.value.trim()
   } as BaseTypes);
  }
  cancelInlineEdit();
 };

 const cancelInlineEdit = () => {
  editingRuleId.value = null;
  editingName.value = '';
  editInput.value = null;
 };

 const setEditInput = (
  el: Element | ComponentPublicInstance | null,
  _refs?: Record<string, any>
 ) => {
  if (el instanceof HTMLInputElement) {
   editInput.value = el;
   el.focus();
   el.select();
  }
 };

 const updateEditingName = (value: string) => {
  editingName.value = value;
 };

 return {
  // State
  ruleType,
  searchQuery,
  isMultiSelectMode,
  selectedRuleIds,
  isDragging,
  filterOptions,
  contextMenu,
  allRules,
  selectedRule,
  editingRuleId,
  editingName,
  editInput,

  // Computed
  sortedRules,
  filteredSortedRules,
  getUniqueColors,
  canMoveUp,
  canMoveDown,
  draggableRules,

  // Actions
  initializeStore,
  updateRulesData,
  handleFilterChange,
  handleSelectRule,
  handleAddNewRule,
  handleUpdateRule,
  handleDuplicateRule,
  handleDeleteRule,
  handleMoveRuleUp,
  handleMoveRuleDown,
  handleBulkDeleteRules,
  toggleMultiSelectMode,
  handleMultiSelect,
  selectAll,
  clearSelection,
  handleBulkDelete,
  showContextMenu,
  hideContextMenu,
  getOriginalIndex,
  getDisplayIndex,
  onDragStart,
  onDragEnd,
  handleContextMoveUp,
  handleContextMoveDown,
  handleContextDuplicate,
  handleContextDelete,
  startInlineEdit,
  finishInlineEdit,
  cancelInlineEdit,
  setEditInput,
  updateEditingName
 };
});
