<!-- src/configMaker/components/RecordTabs/RecordTabItem.vue -->
<template>
  <div
    class="relative group"
    @contextmenu.prevent="handleContextMenu"
    @mouseenter="hoveredRule = rule"
    @mouseleave="hoveredRule = null"
  >
    <RecordTabButton :rule="rule" />
    <!--
    <RecordHoverPreview v-if="shouldShowPreview" :rule="rule" @mouseenter="hoveredRule = rule" />
    -->
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { RecordCategoryUnion } from '@/types/OmikujiData/CategoryType'
  import RecordTabButton from './RecordTabButton.vue'
  import RecordHoverPreview from './RecordHoverPreview.vue'
  import { useRecordTabsStore } from './RecordTabsStore'

  // Props（最小限に）
  const props = defineProps<{
    rule: RecordCategoryUnion
  }>()

  // Store
  const store = useRecordTabsStore()

  // リアクティブデータ
  const hoveredRule = ref<RecordCategoryUnion | null>(null)

  // プレビュー表示の判定
  const shouldShowPreview = computed(
    () => hoveredRule.value?.id === props.rule.id && !store.isMultiSelectMode && !isEditing.value
  )

  // 編集中かどうか
  const isEditing = computed(() => store.editingRuleId === props.rule.id)

  // コンテキストメニューハンドラー
  const handleContextMenu = (event: MouseEvent) => {
    const index = store.getRuleIndex(props.rule.id)
    store.showContextMenu(event, props.rule, index)
  }
</script>
