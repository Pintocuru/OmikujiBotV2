<!-- src/configMaker/components/RuleTabs/RuleTabs.vue -->
<template>
 <div class="space-y-4">
  <!-- フィルターコンポーネント -->
  <RuleFilter
   v-model="searchQuery"
   :total-count="sortedRules.length"
   :filtered-count="filteredSortedRules.length"
   :available-colors="getUniqueColors"
   :selected-count="selectedRuleIds.size"
   @filter-change="handleFilterChange"
   @clear-selection="clearSelection"
  />

  <!-- 複数選択モード時の一括操作バー -->
  <BulkActionBar
   v-if="isMultiSelectMode"
   :selected-count="selectedRuleIds.size"
   :total-count="filteredSortedRules.length"
   @select-all="selectAll"
   @clear-selection="clearSelection"
   @bulk-delete="handleBulkDelete"
  />

  <!-- タブ部分 -->
  <RuleTabList
   v-model:draggable-rules="draggableRules"
   :is-multi-select-mode="isMultiSelectMode"
   :selected-rule="selectedRule"
   :selected-rule-ids="selectedRuleIds"
   :search-query="searchQuery"
   :filtered-sorted-rules="filteredSortedRules"
   :get-rule-enabled-state="getRuleEnabledState"
   :get-display-index="getDisplayIndex"
   @toggle-multi-select="toggleMultiSelectMode"
   @select-rule="handleSelectRule"
   @multi-select="handleMultiSelect"
   @context-menu="showContextMenu"
   @update-rule="handleUpdateRule"
   @add-new-rule="handleAddNewRule"
   @drag-start="onDragStart"
   @drag-end="onDragEnd"
  />

  <!-- フィルター結果が空の場合のメッセージ -->
  <div v-if="searchQuery && filteredSortedRules.length === 0">
   <div class="text-center py-8">
    <div class="text-base-content/60">
     <p class="text-lg mb-2">「{{ searchQuery }}」に一致するルールが見つかりませんでした</p>
     <p class="text-sm">検索条件を変更するか、新しいルールを追加してください</p>
    </div>
   </div>
  </div>

  <!-- 右クリックコンテキストメニュー -->
  <RuleContextMenu
   :show="contextMenu.show"
   :x="contextMenu.x"
   :y="contextMenu.y"
   :can-move-up="canMoveUp"
   :can-move-down="canMoveDown"
   @move-up="handleMoveUp"
   @move-down="handleMoveDown"
   @duplicate="handleDuplicate"
   @delete="handleDelete"
   @hide="hideContextMenu"
  />
 </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { CategoryType } from '@/types/';
import RuleFilter from './RuleFilter.vue';
import RuleContextMenu from './RuleContextMenu.vue';
import BulkActionBar from './BulkActionBar.vue';
import RuleTabList from './RuleTabList.vue';

// Composables
import { useRuleManagement } from './useRuleManagement';
import { useRuleFilter } from './useRuleFilter';
import { useContextMenu } from './useContextMenu';
import { useMultiSelect } from './useMultiSelect';
import { useDragAndDrop } from './useDragAndDrop';

// Types
import type { RuleStore } from './RuleTabsTypes';
import { BaseTypes } from '@shared/types';

// Props
const props = defineProps<{
 rules: BaseTypes[];
 selectedRule: BaseTypes | null;
 ruleType: CategoryType;
}>();

const injectedStore = inject<RuleStore>(`${props.ruleType}RulesStore`);

// Composables
const {
 handleSelectRule,
 handleAddNewRule,
 handleUpdateRule,
 handleDuplicateRule,
 handleMoveRuleUp,
 handleMoveRuleDown,
 handleDeleteRule,
 handleBulkDeleteRules
} = useRuleManagement(props.ruleType);

const {
 searchQuery,
 sortedRules,
 filteredSortedRules,
 getRuleEnabledState,
 handleFilterChange,
 getUniqueColors
} = useRuleFilter(() => props.rules);

const { contextMenu, canMoveUp, canMoveDown, showContextMenu, hideContextMenu, getOriginalIndex } =
 useContextMenu(() => props.rules);

const {
 isMultiSelectMode,
 selectedRuleIds,
 toggleMultiSelectMode,
 handleMultiSelect,
 selectAll,
 clearSelection,
 handleBulkDelete
} = useMultiSelect(() => filteredSortedRules.value, handleBulkDeleteRules);

const { draggableRules, onDragStart, onDragEnd } = useDragAndDrop(
 () => filteredSortedRules.value,
 () => props.rules,
 injectedStore,
 () => searchQuery.value,
 () => isMultiSelectMode.value
);

// 表示用インデックスを取得
const getDisplayIndex = (ruleId: string) => {
 if (searchQuery.value) {
  return filteredSortedRules.value.findIndex((rule) => rule.id === ruleId);
 }
 return props.rules.findIndex((rule) => rule.id === ruleId);
};

// コンテキストメニューのハンドラー
const handleMoveUp = () => {
 if (contextMenu.rule && canMoveUp.value) {
  const originalIndex = getOriginalIndex(contextMenu.rule.id);
  handleMoveRuleUp(contextMenu.rule.id, originalIndex);
 }
 hideContextMenu();
};

const handleMoveDown = () => {
 if (contextMenu.rule && canMoveDown.value) {
  const originalIndex = getOriginalIndex(contextMenu.rule.id);
  handleMoveRuleDown(contextMenu.rule.id, originalIndex, props.rules.length);
 }
 hideContextMenu();
};

const handleDuplicate = () => {
 if (contextMenu.rule) {
  handleDuplicateRule(contextMenu.rule.id);
 }
 hideContextMenu();
};

const handleDelete = () => {
 if (contextMenu.rule) {
  handleDeleteRule(contextMenu.rule.id, contextMenu.rule.name);
 }
 hideContextMenu();
};
</script>
