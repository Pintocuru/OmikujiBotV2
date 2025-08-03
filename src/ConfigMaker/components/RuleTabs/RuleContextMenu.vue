<!-- src/configMaker/components/RuleTabs/RuleContextMenu.vue -->
<template>
 <!-- 右クリックコンテキストメニュー -->
 <div
  v-if="show"
  :style="{ top: y + 'px', left: x + 'px' }"
  class="fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-xl py-2 min-w-48"
  @click.stop
 >
  <button
   @click="$emit('moveUp')"
   :disabled="!canMoveUp"
   :class="getContextMenuItemClasses(!canMoveUp)"
  >
   <ChevronUp class="w-4 h-4" />
   上に移動
  </button>

  <button
   @click="$emit('moveDown')"
   :disabled="!canMoveDown"
   :class="getContextMenuItemClasses(!canMoveDown)"
  >
   <ChevronDown class="w-4 h-4" />
   下に移動
  </button>

  <div class="divider my-1"></div>

  <button
   @click="$emit('duplicate')"
   class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2"
  >
   <Copy class="w-4 h-4" />
   複製
  </button>

  <button
   @click="$emit('delete')"
   class="w-full px-4 py-2 text-left hover:bg-error hover:text-error-content flex items-center gap-2 text-error"
  >
   <Trash2 class="w-4 h-4" />
   削除
  </button>
 </div>

 <!-- コンテキストメニューを閉じるためのオーバーレイ -->
 <div v-if="show" @click="$emit('hide')" class="fixed inset-0 z-40"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { ChevronUp, ChevronDown, Copy, Trash2 } from 'lucide-vue-next';

// Props
defineProps<{
 show: boolean;
 x: number;
 y: number;
 canMoveUp: boolean;
 canMoveDown: boolean;
}>();

// Emits
const emit = defineEmits<{
 moveUp: [];
 moveDown: [];
 duplicate: [];
 delete: [];
 hide: [];
}>();

// スタイル計算
const getContextMenuItemClasses = (disabled: boolean) => [
 'w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2',
 disabled && 'opacity-50 cursor-not-allowed'
];

// ESCキーでメニューを閉じる
const handleKeydown = (event: KeyboardEvent) => {
 if (event.key === 'Escape') {
  emit('hide');
 }
};

onMounted(() => {
 document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
 document.removeEventListener('keydown', handleKeydown);
});
</script>
