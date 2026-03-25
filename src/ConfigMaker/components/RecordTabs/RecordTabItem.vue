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
  import { ref } from 'vue'
  import { BaseRecordType } from '@shared/types'
  import RecordTabButton from './RecordTabButton.vue'
  import { useRecordTabsStore } from './RecordTabsStore'

  const props = defineProps<{
    rule: BaseRecordType // ← 変更
  }>()

  const store = useRecordTabsStore()
  const hoveredRule = ref<BaseRecordType | null>(null) // ← 変更

  const handleContextMenu = (event: MouseEvent) => {
    const index = store.getRuleIndex(props.rule.key)
    store.showContextMenu(event, props.rule, index)
  }
</script>
