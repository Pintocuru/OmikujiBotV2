<!-- src/configMaker/components/RuleTabs/RuleTabList.vue -->
<template>
 <div class="flex flex-wrap gap-1 border-b pb-2">
  <!-- 複数選択モード切り替えボタン -->
  <button
   class="tab tab-bordered px-3 py-2 text-sm hover:bg-base-200 transition-all duration-200"
   :class="{ 'tab-active bg-primary/20': isMultiSelectMode }"
   @click="$emit('toggleMultiSelect')"
   title="複数選択モード"
  >
   <span class="flex items-center gap-2">
    <input type="checkbox" class="checkbox checkbox-xs" :checked="isMultiSelectMode" readonly />
    選択(機能未実装)
   </span>
  </button>

  <!-- vue-draggableを使用 -->
  <draggable
   :model-value="draggableRules"
   @update:model-value="$emit('update:draggableRules', $event)"
   tag="div"
   class="flex flex-wrap gap-1"
   :disabled="!!searchQuery || isMultiSelectMode"
   item-key="id"
   :animation="200"
   ghost-class="opacity-50"
   chosen-class="scale-95"
   @start="$emit('dragStart')"
   @end="$emit('dragEnd')"
  >
   <template #item="{ element: rule }">
    <RuleTabItem
     :rule="rule"
     :index="getDisplayIndex(rule.id)"
     :selected="selectedRule?.id === rule.id"
     :multi-selected="selectedRuleIds.has(rule.id)"
     :multi-select-mode="isMultiSelectMode"
     :get-rule-enabled-state="getRuleEnabledState"
     :draggable="!searchQuery && !isMultiSelectMode"
     @select="$emit('selectRule', $event)"
     @multi-select="(ruleId, event) => $emit('multiSelect', ruleId, event)"
     @context-menu="(event, rule, index) => $emit('contextMenu', event, rule, index)"
     @update="(ruleId, updates) => $emit('updateRule', ruleId, updates)"
    />
   </template>
  </draggable>

  <!-- 新規追加タブ -->
  <button
   class="tab tab-bordered px-4 py-2 text-sm border-dashed border-gray-400 hover:bg-base-200 text-gray-500 transition-all duration-200 hover:border-primary"
   @click="$emit('addNewRule')"
   title="新しいルールを追加"
  >
   <span class="flex items-center gap-2">
    <Plus class="w-4 h-4" />
    追加
   </span>
  </button>
 </div>
</template>

<script setup lang="ts">
import { BaseTypes } from '@shared/types';
import RuleTabItem from './RuleTabItem.vue';
import draggable from 'vuedraggable';
import { Plus } from 'lucide-vue-next';

defineProps<{
 draggableRules: BaseTypes[];
 isMultiSelectMode: boolean;
 selectedRule: BaseTypes | null;
 selectedRuleIds: Set<string>;
 searchQuery: string;
 filteredSortedRules: BaseTypes[];
 getRuleEnabledState: (rule: BaseTypes) => boolean;
 getDisplayIndex: (ruleId: string) => number;
}>();

defineEmits<{
 'update:draggableRules': [rules: BaseTypes[]];
 toggleMultiSelect: [];
 selectRule: [ruleId: string];
 multiSelect: [ruleId: string, event: MouseEvent];
 contextMenu: [event: MouseEvent, rule: BaseTypes, index: number];
 updateRule: [ruleId: string, updates: BaseTypes];
 addNewRule: [];
 dragStart: [];
 dragEnd: [];
}>();
</script>
