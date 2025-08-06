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
  <div v-if="isMultiSelectMode" class="bg-primary/10 p-3 rounded-lg border border-primary/20">
   <div class="flex items-center justify-between">
    <span class="text-sm font-medium">{{ selectedRuleIds.size }}件選択中</span>
    <div class="flex gap-2">
     <button
      class="btn btn-sm btn-ghost"
      @click="selectAll"
      :disabled="selectedRuleIds.size === filteredSortedRules.length"
     >
      すべて選択
     </button>
     <button class="btn btn-sm btn-ghost" @click="clearSelection">選択解除</button>
     <button
      class="btn btn-sm btn-error"
      @click="handleBulkDelete"
      :disabled="selectedRuleIds.size === 0"
     >
      選択したルールを削除
     </button>
    </div>
   </div>
  </div>

  <!-- タブ部分 -->
  <div class="flex flex-wrap gap-1 border-b pb-2">
   <!-- 複数選択モード切り替えボタン -->
   <button
    class="tab tab-bordered px-3 py-2 text-sm hover:bg-base-200 transition-all duration-200"
    :class="{ 'tab-active bg-primary/20': isMultiSelectMode }"
    @click="toggleMultiSelectMode"
    title="複数選択モード"
   >
    <span class="flex items-center gap-2">
     <input type="checkbox" class="checkbox checkbox-xs" :checked="isMultiSelectMode" readonly />
     選択(機能未実装)
    </span>
   </button>

   <!-- vue-draggableを使用 -->
   <draggable
    v-model="draggableRules"
    tag="div"
    class="flex flex-wrap gap-1"
    :disabled="!!searchQuery || isMultiSelectMode"
    item-key="id"
    :animation="200"
    ghost-class="opacity-50"
    chosen-class="scale-95"
    @start="onDragStart"
    @end="onDragEnd"
   >
    <template #item="{ element: rule, index }">
     <RuleTabItem
      :rule="rule"
      :index="getDisplayIndex(rule.id)"
      :selected="selectedRule?.id === rule.id"
      :multi-selected="selectedRuleIds.has(rule.id)"
      :multi-select-mode="isMultiSelectMode"
      :get-rule-enabled-state="getRuleEnabledState"
      :draggable="!searchQuery && !isMultiSelectMode"
      @select="handleSelectRule"
      @multi-select="handleMultiSelect"
      @context-menu="showContextMenu"
      @update="handleUpdateRule"
     />
    </template>
   </draggable>

   <!-- 新規追加タブ -->
   <button
    class="tab tab-bordered px-4 py-2 text-sm border-dashed border-gray-400 hover:bg-base-200 text-gray-500 transition-all duration-200 hover:border-primary"
    @click="handleAddNewRule"
    title="新しいルールを追加"
   >
    <span class="flex items-center gap-2">
     <Plus class="w-4 h-4" />
     追加
    </span>
   </button>
  </div>

  <!-- フィルター結果が空の場合のメッセージ -->
  <div v-if="searchQuery && filteredSortedRules.length === 0" class="text-center py-8">
   <div class="text-base-content/60">
    <p class="text-lg mb-2">「{{ searchQuery }}」に一致するルールが見つかりませんでした</p>
    <p class="text-sm">検索条件を変更するか、新しいルールを追加してください</p>
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
import { computed, inject, ref } from 'vue';
import { CategoryType } from '@/types/';
import draggable from 'vuedraggable';
import RuleTabItem from './RuleTabItem.vue';
import RuleContextMenu from './RuleContextMenu.vue';
import RuleFilter from './RuleFilter.vue';
import { Plus } from 'lucide-vue-next';

// Composables
import { useRuleManagement } from './useRuleManagement';
import { useRuleFilter } from './useRuleFilter';
import { useContextMenu } from './useContextMenu';

// Types
import type { BaseRule, RuleStore } from './RuleTabsTypes';

// Props
const props = defineProps<{
 rules: BaseRule[];
 selectedRule: BaseRule | null;
 ruleType: CategoryType;
}>();

const injectedStore = inject<RuleStore>(`${props.ruleType}RulesStore`);

// 複数選択の状態
const isMultiSelectMode = ref(false);
const selectedRuleIds = ref(new Set<string>());
const isDragging = ref(false);

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

// 完全修正版：Draggable用の計算プロパティ
const draggableRules = computed({
 get: () => filteredSortedRules.value,
 set: (newOrder: BaseRule[]) => {
  if (isDragging.value && !searchQuery.value && !isMultiSelectMode.value) {
   // ドラッグ&ドロップの場合のみ処理
   handleReorderFromDrag(newOrder);
  }
 }
});
// ドラッグ&ドロップ用のヘルパー関数
const handleReorderFromDrag = (newOrder: BaseRule[]) => {
 // 元の配列での正確なインデックスを取得
 const originalOrder = [...props.rules];

 // 新しい順序に基づいてreorder操作を実行
 for (let newIndex = 0; newIndex < newOrder.length; newIndex++) {
  const rule = newOrder[newIndex];
  const currentIndex = originalOrder.findIndex((r) => r.id === rule.id);

  if (currentIndex !== -1 && currentIndex !== newIndex) {
   // reorder操作を実行
   injectedStore?.reorder?.(currentIndex, newIndex);

   // 配列を更新（次のループで正確なインデックスを取得するため）
   const [movedRule] = originalOrder.splice(currentIndex, 1);
   originalOrder.splice(newIndex, 0, movedRule);
  }
 }
};

// 表示用インデックスを取得（フィルターを考慮）
const getDisplayIndex = (ruleId: string) => {
 if (searchQuery.value) {
  return filteredSortedRules.value.findIndex((rule) => rule.id === ruleId);
 }
 return props.rules.findIndex((rule) => rule.id === ruleId);
};

// 複数選択機能
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
 } else {
  // 通常のクリック：単一選択
  selectedRuleIds.value.clear();
  selectedRuleIds.value.add(ruleId);
 }
};

const selectAll = () => {
 filteredSortedRules.value.forEach((rule) => {
  selectedRuleIds.value.add(rule.id);
 });
};

const clearSelection = () => {
 selectedRuleIds.value.clear();
};

const handleBulkDelete = () => {
 if (selectedRuleIds.value.size === 0) return;

 const rulesToDelete = Array.from(selectedRuleIds.value)
  .map((id) => props.rules.find((rule) => rule.id === id))
  .filter(Boolean) as BaseRule[];

 handleBulkDeleteRules(rulesToDelete);
 selectedRuleIds.value.clear();
 isMultiSelectMode.value = false;
};

// ドラッグイベントハンドラー
const onDragStart = () => {
 isDragging.value = true;
};

const onDragEnd = () => {
 // 少し遅らせてフラグをリセット
 setTimeout(() => {
  isDragging.value = false;
 }, 100);
};

// コンテキストメニューのハンドラー（修正版）
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
