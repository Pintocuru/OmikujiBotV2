<!-- src/configMaker/components/RecordTabs/RecordTabList.vue -->
<template>
  <div v-if="store.filteredSortedItems.length !== 0">
    <!-- ソートアクション -->
    <RecordSortActions />

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
  </div>

  <!-- フィルター結果が空の場合のメッセージ -->
  <div v-else>
    <NoParamsCard message="一致するルールが見つかりませんでした。" />

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
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import draggable from 'vuedraggable'
  import { Plus } from 'lucide-vue-next'

  // Pinia store
  const store = useRecordTabsStore()
</script>
