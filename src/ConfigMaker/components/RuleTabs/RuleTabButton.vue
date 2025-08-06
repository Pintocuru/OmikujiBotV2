<!-- src/configMaker/components/RuleTabs/RuleTabButton.vue -->
<template>
 <button
  :class="tabClasses"
  @click="$emit('click', $event)"
  @dblclick="$emit('dblclick', $event)"
  :style="{ borderTopColor: rule.editorColor }"
 >
  <!-- 複数選択モード時のチェックボックス -->
  <div
   v-if="multiSelectMode"
   class="flex items-center mr-2"
   @click.stop="$emit('multiSelectClick', $event)"
  >
   <input type="checkbox" :checked="multiSelected" class="checkbox checkbox-sm" readonly />
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
  <!-- ! 型 '(el: HTMLInputElement) => void' を型 'VNodeRef | undefined' に割り当てることはできません。 -->
  <!-- TODO:インライン編集は必ず失敗します -->
  <input
   v-if="isEditing"
   :value="editingName"
   @input="$emit('update:editingName', ($event.target as HTMLInputElement).value)"
   @blur="$emit('finishEdit')"
   @keyup.enter="$emit('finishEdit')"
   @keyup.escape="$emit('cancelEdit')"
   class="bg-transparent border-none outline-none text-current w-20 text-center"
   :ref="setEditInputRef"
   @click.stop
  />
  <span v-else class="truncate max-w-24">
   {{ rule.name || `ルール${index + 1}` }}
  </span>
  <!-- order(Dev) -->
  <span v-if="isDev">({{ rule.order != null ? rule.order : 'order:error!' }})</span>

  <!-- 状態インジケーター -->
  <div class="flex items-center gap-1 text-xs">
   <span v-if="!getRuleEnabledState(rule)" class="opacity-50 text-xs">(無効)</span>
  </div>

  <!-- ホバーエフェクト -->
  <div
   class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
  />
 </button>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { isDev } from '@/types/';
import { BaseTypes } from '@shared/types';
import { GripVertical } from 'lucide-vue-next';

const props = defineProps<{
 rule: BaseTypes;
 index: number;
 selected: boolean;
 multiSelected?: boolean;
 multiSelectMode?: boolean;
 draggable?: boolean;
 getRuleEnabledState: (rule: BaseTypes) => boolean;
 editingRuleId: string | null;
 editingName: string;
}>();

const emit = defineEmits<{
 click: [event: MouseEvent];
 dblclick: [event: MouseEvent];
 multiSelectClick: [event: MouseEvent];
 finishEdit: [];
 cancelEdit: [];
 setEditInput: [el: HTMLInputElement];
 'update:editingName': [value: string];
}>();

const inputRef = ref<HTMLInputElement>();

const isEditing = computed(() => props.editingRuleId === props.rule.id);

const showDragHandle = computed(
 () => props.draggable && !isEditing.value && !props.multiSelectMode
);

const tabClasses = computed(() => [
 'tab tab-bordered px-4 py-2 text-sm font-medium transition-all duration-200',
 'flex items-center gap-2 relative overflow-hidden',
 props.selected
  ? 'tab-active bg-primary text-primary-content shadow-lg'
  : props.multiSelected
    ? 'bg-primary/20 border-primary/40 text-primary'
    : 'hover:bg-base-200 hover:shadow-md',
 !props.getRuleEnabledState(props.rule) && 'opacity-60',
 showDragHandle.value && 'cursor-grab',
 props.multiSelectMode && 'cursor-pointer'
]);

const setEditInputRef = (el: HTMLInputElement) => {
 inputRef.value = el;
 if (el) {
  emit('setEditInput', el);
 }
};

onMounted(() => {
 if (isEditing.value && inputRef.value) {
  inputRef.value.focus();
  inputRef.value.select();
 }
});
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
