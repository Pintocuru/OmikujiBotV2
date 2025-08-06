<!-- src/configMaker/components/RuleTabs/RuleTabItem.vue -->
<template>
 <div
  class="relative group"
  @contextmenu.prevent="$emit('contextMenu', $event, rule, index)"
  @mouseenter="hoveredRule = rule"
  @mouseleave="hoveredRule = null"
 >
  <button
   :class="getTabClasses()"
   @click="handleClick"
   @dblclick="startInlineEdit(rule)"
   :style="{ borderTopColor: rule.editorColor }"
  >
   <!-- 複数選択モード時のチェックボックス -->
   <div v-if="multiSelectMode" class="flex items-center mr-2" @click.stop="handleMultiSelectClick">
    <input type="checkbox" :checked="multiSelected" class="checkbox checkbox-sm" readonly />
   </div>

   <!-- ドラッグハンドル（編集中以外で表示） -->
   <div
    v-if="draggable && editingRuleId !== rule.id && !multiSelectMode"
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
    v-if="editingRuleId === rule.id"
    v-model="editingName"
    @blur="finishInlineEdit(handleUpdate)"
    @keyup.enter="finishInlineEdit(handleUpdate)"
    @keyup.escape="cancelInlineEdit"
    class="bg-transparent border-none outline-none text-current w-20 text-center"
    :ref="(el) => (editInput = el as HTMLInputElement)"
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

  <!-- ホバープレビュー -->
  <div
   v-if="hoveredRule?.id === rule.id && editingRuleId !== rule.id && !multiSelectMode"
   class="absolute top-full left-0 mt-2 z-30 bg-base-100 border border-base-300 rounded-lg shadow-xl p-4 w-72"
   @mouseenter="hoveredRule = rule"
  >
   <div class="space-y-2">
    <div class="font-medium text-base">{{ rule.name || '名前未設定' }}</div>
    <div v-if="rule.description" class="text-sm text-base-content/70">
     {{ rule.description }}
    </div>

    <!-- カラー表示 -->
    <div v-if="rule.editorColor" class="flex items-center gap-2 text-xs">
     <span>カラー:</span>
     <div
      class="w-4 h-4 rounded-full border border-white/20"
      :style="{ backgroundColor: rule.editorColor }"
     />
     <span class="font-mono">{{ rule.editorColor }}</span>
    </div>

    <div class="text-xs space-y-1">
     <div class="flex items-center gap-2">
      <span
       class="badge badge-sm"
       :class="getRuleEnabledState(rule) ? 'badge-success' : 'badge-error'"
      >
       {{ getRuleEnabledState(rule) ? '有効' : '無効' }}
      </span>
     </div>
     <div v-if="'omikuji' in rule && (rule.omikuji as any)?.length">
      <div class="font-medium">おみくじ : {{ (rule.omikuji as any).length }}種</div>
     </div>
     <div v-if="'values' in rule && Object.keys(rule.values as object).length">
      <div class="font-medium">
       プレースホルダー : {{ Object.keys(rule.values as object).length }}種
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { BaseRule } from './RuleTabsTypes';
import { isDev } from '@/types/';
import { GripVertical } from 'lucide-vue-next';
import { useInlineEdit } from './useInlineEdit';

// Props
const props = defineProps<{
 rule: BaseRule;
 index: number;
 selected: boolean;
 multiSelected?: boolean;
 multiSelectMode?: boolean;
 getRuleEnabledState: (rule: BaseRule) => boolean;
 draggable?: boolean;
}>();

// Emits
const emit = defineEmits<{
 select: [ruleId: string];
 multiSelect: [ruleId: string, event: MouseEvent];
 contextMenu: [event: MouseEvent, rule: BaseRule, index: number];
 update: [ruleId: string, updates: Partial<BaseRule>];
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
const hoveredRule = ref<BaseRule | null>(null);

// メソッド
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

const handleUpdate = (ruleId: string, updates: Partial<BaseRule>) => {
 emit('update', ruleId, updates);
};

// スタイル計算
const getTabClasses = () => [
 'tab tab-bordered px-4 py-2 text-sm font-medium transition-all duration-200',
 'flex items-center gap-2 relative overflow-hidden',
 props.selected
  ? 'tab-active bg-primary text-primary-content shadow-lg'
  : props.multiSelected
    ? 'bg-primary/20 border-primary/40 text-primary'
    : 'hover:bg-base-200 hover:shadow-md',
 !props.getRuleEnabledState(props.rule) && 'opacity-60',
 props.draggable &&
  editingRuleId.value !== props.rule.id &&
  !props.multiSelectMode &&
  'cursor-grab',
 props.multiSelectMode && 'cursor-pointer'
];
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
