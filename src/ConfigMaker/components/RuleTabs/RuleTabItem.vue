<!-- src/configMaker/components/RuleTabs/RuleTabItem.vue -->
<template>
 <div
  class="relative group"
  @contextmenu.prevent="handleContextMenu"
  @mouseenter="hoveredRule = rule"
  @mouseleave="hoveredRule = null"
 >
  <RuleTabButton :rule="rule" />

  <RuleHoverPreview v-if="shouldShowPreview" :rule="rule" @mouseenter="hoveredRule = rule" />
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { BaseTypes } from '@shared/types';
import RuleTabButton from './RuleTabButton.vue';
import RuleHoverPreview from './RuleHoverPreview.vue';
import { useRuleTabsStore } from './RuleTabsStore';

// Props（最小限に）
const props = defineProps<{
 rule: BaseTypes;
}>();

// Store
const store = useRuleTabsStore();

// リアクティブデータ
const hoveredRule = ref<BaseTypes | null>(null);

// プレビュー表示の判定
const shouldShowPreview = computed(
 () => hoveredRule.value?.id === props.rule.id && !store.isMultiSelectMode && !isEditing.value
);

// 編集中かどうか
const isEditing = computed(() => store.editingRuleId === props.rule.id);

// コンテキストメニューハンドラー
const handleContextMenu = (event: MouseEvent) => {
 const index = store.getDisplayIndex(props.rule.id);
 store.showContextMenu(event, props.rule, index);
};
</script>
