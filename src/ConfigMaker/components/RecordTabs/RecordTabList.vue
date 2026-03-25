<!-- src/ConfigMaker/components/RecordTabs/RecordTabList.vue -->
<template>
  <div v-if="store.filteredSortedItems.length !== 0">
    <RecordSortActions />

    <VueDraggable
      v-model="draggableRules"
      :disabled="!!store.searchQuery || store.isMultiSelectMode"
      :animation="200"
      ghost-class="opacity-50"
      chosen-class="scale-95"
      class="flex flex-wrap gap-1"
      @start="onDragStart"
      @end="onDragEnd"
    >
      <RecordTabItem v-for="rule in draggableRules" :key="rule.key" :rule="rule" />
    </VueDraggable>
  </div>

  <div v-else>
    <NoParamsCard :message="`一致するイベントが見つかりませんでした。`" :sub="`${store.filterDescription}`" />
    <div class="text-center">
      <button
        class="btn border-primary mt-4 transition-all duration-200 hover:btn-primary"
        @click="store.handleAddItem"
        title="新しいイベントを追加"
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
  import { VueDraggable } from 'vue-draggable-plus'
  import RecordTabItem from './RecordTabItem.vue'
  import RecordSortActions from './RecordSortActions.vue'
  import { useRecordTabsStore } from './RecordTabsStore'
  import { useDragAndDrop } from './composables/useDragAndDrop'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import { Plus } from 'lucide-vue-next'

  const store = useRecordTabsStore()
  const { draggableRules, onDragStart, onDragEnd } = useDragAndDrop()
</script>
