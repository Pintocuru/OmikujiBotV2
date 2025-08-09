<!-- src/configMaker/components/RuleTabs/RuleTabButton.vue -->
<template>
 <button
  :class="tabClasses"
  @click="handleClick"
  @dblclick="store.startInlineEdit(rule)"
  :style="{ borderTopColor: rule.editorColor }"
 >
  <!-- 複数選択モード時のチェックボックス -->
  <div
   v-if="store.isMultiSelectMode"
   class="flex items-center mr-2"
   @click.stop="handleMultiSelectClick"
  >
   <input
    type="checkbox"
    :checked="store.selectedRuleIds.has(rule.id)"
    class="checkbox checkbox-sm"
    readonly
   />
  </div>

  <!-- ドラッグハンドル -->
  <div
   v-if="showDragHandle"
   class="drag-handle text-gray-400 hover:text-gray-600 transition-colors mr-1"
  >
   <GripVertical class="w-3 h-3" />
  </div>

  <!-- ルール色インジケーター -->
  <div
   class="w-3 h-3 rounded-full border border-white/20 shadow-sm"
   :style="{ backgroundColor: rule.editorColor }"
  />

  <!-- ルール名（インライン編集対応） -->
  <input
   v-if="isEditing"
   :value="store.editingName"
   @input="store.updateEditingName(($event.target as HTMLInputElement).value)"
   @blur="store.finishInlineEdit"
   @keyup.enter="store.finishInlineEdit"
   @keyup.escape="store.cancelInlineEdit"
   class="bg-transparent border-none outline-none text-current w-20 text-center"
   :ref="store.setEditInput"
   @click.stop
  />
  <span v-else class="truncate max-w-24">
   {{ rule.name || `ルール${displayIndex + 1}` }}
  </span>

  <!-- order(Dev) : order がエラー起きたときのために残しておきます
  <span v-if="isDev">({{ rule.order != null ? rule.order : 'order:error!' }})</span>
  -->

  <!-- 状態インジケーター -->
  <div class="flex items-center gap-1 text-xs">
   <span v-if="!getRuleEnabledState" class="opacity-50 text-xs">(無効)</span>
  </div>

  <!-- ホバーエフェクト -->
  <div
   class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
  />
 </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isDev, RecordCategoryUnion } from '@/types/';
import { GripVertical } from 'lucide-vue-next';
import { useRuleTabsStore } from './RuleTabsStore';
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore';

const props = defineProps<{
 rule: RecordCategoryUnion;
}>();

// Store
const omikujiStore = useOmikujiStore();
const store = useRuleTabsStore();

// Computed
const displayIndex = computed(() => store.getDisplayIndex(props.rule.id));
const isEditing = computed(() => store.editingRuleId === props.rule.id);
const isSelected = computed(() => store.selectedItem?.id === props.rule.id);
const isMultiSelected = computed(() => store.selectedRuleIds.has(props.rule.id));
const getRuleEnabledState = computed(() => props.rule.isEnabled !== false);

const showDragHandle = computed(
 () => !store.searchQuery && !isEditing.value && !store.isMultiSelectMode
);

const tabClasses = computed(() => [
 'tab tab-bordered px-4 py-2 text-sm font-medium transition-all duration-200',
 'flex items-center gap-2 relative overflow-hidden',
 isSelected.value
  ? 'tab-active bg-primary text-primary-content shadow-lg'
  : isMultiSelected.value
    ? 'bg-primary/20 border-primary/40 text-primary'
    : 'hover:bg-base-200 hover:shadow-md',
 !getRuleEnabledState.value && 'opacity-60',
 showDragHandle.value && 'cursor-grab',
 store.isMultiSelectMode && 'cursor-pointer'
]);

// Event Handlers
const handleClick = (event: MouseEvent) => {
 if (store.isMultiSelectMode) {
  store.handleMultiSelect(props.rule.id, event);
 } else {
  omikujiStore.selectRule(props.rule.id);
 }
};

const handleMultiSelectClick = (event: MouseEvent) => {
 store.handleMultiSelect(props.rule.id, event);
};
</script>

<style scoped>
.drag-handle {
 opacity: 0;
 transition: opacity 0.2s;
}

.group:hover .drag-handle {
 opacity: 1;
}

.cursor-grab:hover .drag-handle {
 opacity: 1;
}
</style>
