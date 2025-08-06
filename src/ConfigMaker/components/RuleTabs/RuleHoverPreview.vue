<!-- src/configMaker/components/RuleTabs/RuleHoverPreview.vue -->
<template>
 <div
  class="absolute top-full left-0 mt-2 z-30 bg-base-100 border border-base-300 rounded-lg shadow-xl p-4 w-72"
  @mouseenter="$emit('mouseenter')"
 >
  <div class="space-y-2">
   <!-- ルール名 -->
   <div class="font-medium text-base">{{ rule.name || '名前未設定' }}</div>

   <!-- 説明 -->
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

   <!-- ステータス情報 -->
   <div class="text-xs space-y-1">
    <div class="flex items-center gap-2">
     <span
      class="badge badge-sm"
      :class="getRuleEnabledState(rule) ? 'badge-success' : 'badge-error'"
     >
      {{ getRuleEnabledState(rule) ? '有効' : '無効' }}
     </span>
    </div>

    <div v-if="hasOmikuji" class="font-medium">おみくじ : {{ omikujiCount }}種</div>

    <div v-if="hasValues" class="font-medium">プレースホルダー : {{ valuesCount }}種</div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BaseTypes } from '@shared/types';

const props = defineProps<{
 rule: BaseTypes;
 getRuleEnabledState: (rule: BaseTypes) => boolean;
}>();

defineEmits<{
 mouseenter: [];
}>();

const hasOmikuji = computed(
 () =>
  'omikuji' in props.rule &&
  Array.isArray(props.rule.omikuji as any) &&
  (props.rule.omikuji as any).length > 0
);

const omikujiCount = computed(() => (hasOmikuji.value ? (props.rule.omikuji as any).length : 0));

const hasValues = computed(
 () =>
  'values' in props.rule &&
  typeof props.rule.values === 'object' &&
  props.rule.values !== null &&
  Object.keys(props.rule.values as object).length > 0
);

const valuesCount = computed(() =>
 hasValues.value ? Object.keys(props.rule.values as object).length : 0
);
</script>
