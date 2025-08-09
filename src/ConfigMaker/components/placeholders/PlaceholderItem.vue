<!-- src/configMaker/components/placeholders/PlaceholderItem.vue -->
<template>
 <div :class="cardClasses">
  <div class="flex items-center justify-between p-2 gap-3">
   <!-- プレースホルダー情報 -->
   <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2">
     <span class="font-medium text-sm truncate">
      {{ placeholder.name || placeholder.id }}
     </span>
     <code class="bg-base-200 px-1 py-0.5 rounded text-xs"> ID: {{ placeholder.id }} </code>
     <div class="badge badge-outline badge-xs">
      {{ placeholder.values.length }}
     </div>
     <div v-if="isUsed" class="badge badge-primary badge-xs">使用中</div>
    </div>
    <div class="text-xs text-base-content/60 truncate mt-0.5">
     {{ randomValue }}
    </div>
   </div>

   <!-- アクションボタン -->
   <div class="flex items-center gap-1">
    <CopyButton :value="`<<${placeholder.id}>>`" data-tip="IDをコピー" class="btn-xs" />
    <PlaceholderModal v-if="shouldShowModal" :placeholder-id="placeholder.id" />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PlaceholderType } from '@/types/';
import PlaceholderModal from './PlaceholderModal.vue';
import CopyButton from '@ConfigComponents/parts/CopyButton.vue';

// Props
const props = defineProps<{
 placeholder: PlaceholderType;
 isUsed: boolean;
 isDefault: boolean;
 randomValue: string;
}>();

// Computed
const cardClasses = computed(() => [
 'card card-compact transition-colors',
 props.isUsed
  ? 'bg-primary/20 border border-primary/40 hover:bg-primary/30'
  : 'bg-base-100 hover:bg-base-200'
]);

// 使用されているプレースホルダーの場合のみモーダルを表示（TODO実装完了）
const shouldShowModal = computed(() => {
 return !props.isDefault && props.isUsed;
});
</script>
