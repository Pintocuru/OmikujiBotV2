<!-- src/configMaker/components/RuleTabs/RuleTabList.vue -->
<template>
 <div class="flex flex-wrap gap-1 border-b pb-2">
  <!-- 複数選択モード切り替えボタン -->
  <button
   class="tab tab-bordered px-3 py-2 text-sm hover:bg-base-200 transition-all duration-200"
   :class="{ 'tab-active bg-primary/20': store.isMultiSelectMode }"
   @click="store.toggleMultiSelectMode"
   title="複数選択モード"
  >
   <span class="flex items-center gap-2">
    <input
     type="checkbox"
     class="checkbox checkbox-xs"
     :checked="store.isMultiSelectMode"
     readonly
    />
    選択
   </span>
  </button>

  <!-- vue-draggableを使用 -->
  <draggable
   :model-value="store.draggableRules"
   @update:model-value="(value: any) => (store.draggableRules = value)"
   tag="div"
   class="flex flex-wrap gap-1"
   :disabled="!!store.searchQuery || store.isMultiSelectMode"
   item-key="id"
   :animation="200"
   ghost-class="opacity-50"
   chosen-class="scale-95"
   @start="store.onDragStart"
   @end="store.onDragEnd"
  >
   <template #item="{ element: rule }">
    <RuleTabItem :rule="rule" />
   </template>
  </draggable>

  <!-- 新規追加タブ -->
  <button
   class="tab tab-bordered px-4 py-2 text-sm border-dashed border-gray-400 hover:bg-base-200 text-gray-500 transition-all duration-200 hover:border-primary"
   @click="store.handleAddNewRule"
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
import RuleTabItem from './RuleTabItem.vue';
import draggable from 'vuedraggable';
import { Plus } from 'lucide-vue-next';
import { useRuleTabsStore } from './RuleTabsStore';

// ストアを使用（propsは不要）
const store = useRuleTabsStore();
</script>
