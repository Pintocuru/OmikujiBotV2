<!-- src/configMaker/components/RuleTabs/RuleTabs.vue -->
<template>
 <div class="space-y-4">
  <!-- フィルターコンポーネント -->
  <RuleFilter
   v-model="searchQuery"
   :total-count="sortedRules.length"
   :filtered-count="filteredSortedRules.length"
   :available-colors="getUniqueColors"
   @filter-change="handleFilterChange"
  />

  <!-- タブ部分 -->
  <div class="flex flex-wrap gap-1 border-b pb-2">
   <!-- vue-draggableを使用 -->
   <draggable
    v-model="draggableRules"
    tag="div"
    class="flex flex-wrap gap-1"
    :disabled="!!searchQuery"
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
      :index="index"
      :selected="selectedRule?.id === rule.id"
      :get-rule-enabled-state="getRuleEnabledState"
      :draggable="!searchQuery"
      @select="handleSelectRule"
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
import { computed } from 'vue';
import { CategoryType } from '@type/';
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
import type { BaseRule } from './RuleTabsTypes';

// Props
const props = defineProps<{
 rules: BaseRule[];
 selectedRule: BaseRule | null;
 ruleType: CategoryType;
}>();

// Composables
const {
 handleSelectRule,
 handleAddNewRule,
 handleUpdateRule,
 handleDuplicateRule,
 handleMoveRuleUp,
 handleMoveRuleDown,
 handleDeleteRule
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

// Draggable用の計算プロパティ
const draggableRules = computed({
 get: () => filteredSortedRules.value,
 set: (newOrder: BaseRule[]) => {
  // 新しい順序でreorderを実行
  newOrder.forEach((rule, newIndex) => {
   const oldIndex = getOriginalIndex(rule.id);
   if (oldIndex !== newIndex) {
    handleUpdateRule(rule.id, { order: newIndex });
   }
  });
 }
});

// ドラッグイベントハンドラー
const onDragStart = () => {
 // ドラッグ開始時の処理
};

const onDragEnd = () => {
 // ドラッグ終了時の処理
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
