<!-- src/configMaker/components/RecordTabs/RecordTabList.vue -->
<template>
  <div v-if="store.filteredSortedItems.length !== 0">
    <!-- ソートアクション -->
    <RecordSortActions />

    <!-- vue-draggableを使用 -->
    <VueDraggable
      v-model="draggableRules"
      item-key="key"
      @update:model-value="(value: any) => (draggableRules = value)"
      tag="div"
      class="flex flex-wrap gap-1"
      :disabled="!!store.searchQuery || store.isMultiSelectMode"
      :animation="200"
      ghost-class="opacity-50"
      chosen-class="scale-95"
      @start="onDragStart"
      @end="onDragEnd"
    >
      <template #item="{ element: rule }">
        <!-- ! @ts-ignore -->
        <RecordTabItem :rule="rule as any" />
      </template>
    </VueDraggable>
  </div>

  <!-- フィルター結果が空の場合のメッセージ -->
  <div v-else>
    <NoParamsCard :message="`一致するルールが見つかりませんでした。`" :sub="`${store.filterDescription}`" />

    <div class="text-center">
      <!-- 新規追加ボタン（フィルター結果が空の場合） -->
      <button
        class="btn border-primary mt-4 transition-all duration-200 hover:btn-primary"
        @click="store.handleAddItem"
        title="新しいルールを追加"
      >
        <span class="flex items-center gap-2">
          <Plus class="w-4 h-4" />
          追加
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import RecordTabItem from './RecordTabItem.vue'
  import RecordSortActions from './RecordSortActions.vue'
  import { useRecordTabsStore } from './RecordTabsStore'
  import { useDragAndDrop } from './composables/useDragAndDrop'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  //  import { VueDraggable } from 'vue-draggable-plus'
  import VueDraggable from '@/DraggableWrapper.vue'
  import { Plus } from 'lucide-vue-next'

  // Pinia store
  const store = useRecordTabsStore()
  const { draggableRules, onDragStart, onDragEnd } = useDragAndDrop()
</script>
