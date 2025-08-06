<!-- src/configMaker/components/RuleTabs/RuleTabItem.vue -->
<template>
 <div
  class="relative group"
  @contextmenu.prevent="$emit('contextMenu', $event, rule, index)"
  @mouseenter="hoveredRule = rule"
  @mouseleave="hoveredRule = null"
 >
  <RuleTabButton
   :rule="rule"
   :index="index"
   :selected="selected"
   :multi-selected="multiSelected"
   :multi-select-mode="multiSelectMode"
   :draggable="draggable"
   :get-rule-enabled-state="getRuleEnabledState"
   :editing-rule-id="editingRuleId"
   :editing-name="editingName"
   @click="handleClick"
   @dblclick="startInlineEdit(rule)"
   @multi-select-click="handleMultiSelectClick"
   @finish-edit="finishInlineEdit(handleUpdate)"
   @cancel-edit="cancelInlineEdit"
   @set-edit-input="setEditInput"
  />

  <RuleHoverPreview
   v-if="shouldShowPreview"
   :rule="rule"
   :get-rule-enabled-state="getRuleEnabledState"
   @mouseenter="hoveredRule = rule"
  />
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { BaseTypes } from '@shared/types';
import RuleTabButton from './RuleTabButton.vue';
import RuleHoverPreview from './RuleHoverPreview.vue';
import { useInlineEdit } from './useInlineEdit';

// Props
const props = defineProps<{
 rule: BaseTypes;
 index: number;
 selected: boolean;
 multiSelected?: boolean;
 multiSelectMode?: boolean;
 getRuleEnabledState: (rule: BaseTypes) => boolean;
 draggable?: boolean;
}>();

// Emits
const emit = defineEmits<{
 select: [ruleId: string];
 multiSelect: [ruleId: string, event: MouseEvent];
 contextMenu: [event: MouseEvent, rule: BaseTypes, index: number];
 update: [ruleId: string, updates: BaseTypes];
}>();

// Composables
const {
 editingRuleId,
 editingName,
 editInput,
 startInlineEdit,
 finishInlineEdit,
 cancelInlineEdit
} = useInlineEdit();

// リアクティブデータ
const hoveredRule = ref<BaseTypes | null>(null);

// プレビュー表示の判定
const shouldShowPreview = computed(
 () =>
  hoveredRule.value?.id === props.rule.id &&
  editingRuleId.value !== props.rule.id &&
  !props.multiSelectMode
);

// イベントハンドラー
const handleClick = (event: MouseEvent) => {
 if (props.multiSelectMode) {
  emit('multiSelect', props.rule.id, event);
 } else {
  emit('select', props.rule.id);
 }
};

const handleMultiSelectClick = (event: MouseEvent) => {
 emit('multiSelect', props.rule.id, event);
};

const handleUpdate = (ruleId: string, updates: BaseTypes) => {
 emit('update', ruleId, updates);
};

const setEditInput = (el: HTMLInputElement) => {
 editInput.value = el;
};
</script>
