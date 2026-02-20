<!-- src/ConfigMaker/components/RecordTabs/RecordTabItem.vue -->
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
  import { RecordCategoryUnion } from '@/types/OmikujiData/'
  import RecordTabButton from './RecordTabButton.vue'
  import RecordHoverPreview from './RecordHoverPreview.vue'
  import { useRecordTabsStore } from './RecordTabsStore'

  // Props
  const props = defineProps<{
    rule: RecordCategoryUnion
  }>()

  // Store
  const store = useRecordTabsStore()

  // リアクティブデータ
  const hoveredRule = ref<RecordCategoryUnion | null>(null)

  // プレビュー表示の判定
  const shouldShowPreview = computed(
    () => hoveredRule.value?.key === props.rule.key && !store.isMultiSelectMode && !isEditing.value
  )

  // 編集中かどうか
  const isEditing = computed(() => store.editingRuleId === props.rule.key)

  // コンテキストメニューハンドラー
  const handleContextMenu = (event: MouseEvent) => {
    const index = store.getRuleIndex(props.rule.key)
    store.showContextMenu(event, props.rule, index)
  }
</script>
