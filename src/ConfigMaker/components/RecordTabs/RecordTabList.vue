<!-- src/configMaker/components/RecordTabs/RecordTabList.vue -->
<template>
 <div v-if="store.filteredSortedItems.length !== 0" class="flex flex-wrap gap-1 border-b pb-2">
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
    <RecordTabItem :rule="rule" />
   </template>
  </draggable>

  <!-- 新規追加タブ -->
  <button
   class="tab tab-bordered px-4 py-2 text-sm border-dashed border-gray-400 hover:bg-base-200 text-gray-500 transition-all duration-200 hover:border-primary"
   @click="store.handleAddItem"
   title="新しいルールを追加"
  >
   <span class="flex items-center gap-2">
    <Plus class="w-4 h-4" />
    追加
   </span>
  </button>
 </div>

 <!-- フィルター結果が空の場合のメッセージ -->
 <div v-else>
  <div class="text-center py-8 text-base-content/60">
   <p class="text-lg">一致するルールが見つかりませんでした。</p>
  </div>
 </div>
</template>

<script setup lang="ts">
import RecordTabItem from './RecordTabItem.vue';
import draggable from 'vuedraggable';
import { Plus } from 'lucide-vue-next';
import { useRecordTabsStore } from './RecordTabsStore';

// ストアを使用（propsは不要）
const store = useRecordTabsStore();
</script>
