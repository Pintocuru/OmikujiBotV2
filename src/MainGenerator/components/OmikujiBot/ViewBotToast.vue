<!-- src/MainGenerator/components/ViewBotToast.vue -->
<template>
 <div class="toast-container fixed right-4 z-999" :class="[sizeConfig.bottom]">
  <transition-group name="toast" tag="div" appear>
   <div
    v-for="(message, index) in displayedComments.slice().reverse()"
    :key="message.id"
    class="flex flex-row-reverse items-start w-full p-2 mt-1 rounded-sm shadow-lg backdrop-blur-sm cursor-pointer hover:opacity-80 transition-opacity"
    :style="{
     backgroundColor: message.color?.backgroundColor || '#ffffff',
     maxWidth: sizeConfig.width,
     width: '100%'
    }"
    @click="removeItem(message.id)"
   >
    <!-- メッセージ内容 -->
    <div class="flex-1 min-w-0 px-1 overflow-hidden">
     <div
      class="break-words"
      :class="[sizeConfig.text]"
      :style="{
       color: message.color?.textColor || '#000000',
       wordBreak: 'break-word',
       overflowWrap: 'break-word',
       hyphens: 'auto'
      }"
     >
      {{ message.comment }}
     </div>
    </div>
   </div>
  </transition-group>
 </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, toRef } from 'vue';
import { BotMessage } from '@/types/';
import { useBotCommentDisplay } from '@/MainGenerator/components/OmikujiBot/useBotMessage';
import { DisplaySize } from '@shared/types';

// サイズ設定の定数（OBS用により狭く調整）
const SIZE_CONFIG = {
 xs: { bottom: 'bottom-10', text: 'text-xs leading-tight', avatar: 'w-6 h-6', width: '250px' },
 sm: { bottom: 'bottom-14', text: 'text-sm leading-tight', avatar: 'w-8 h-8', width: '300px' },
 md: { bottom: 'bottom-18', text: 'text-base leading-tight', avatar: 'w-10 h-10', width: '340px' },
 lg: { bottom: 'bottom-22', text: 'text-lg leading-tight', avatar: 'w-12 h-12', width: '380px' },
 xl: { bottom: 'bottom-26', text: 'text-xl leading-tight', avatar: 'w-14 h-14', width: '420px' }
} as const;

const props = defineProps<{
 botMessages: BotMessage[];
 displaySize: DisplaySize;
}>();

const { displayedComments, removeItem, start, stop } = useBotCommentDisplay(
 toRef(props, 'botMessages'),
 'toast'
);

// サイズ設定の取得
const sizeConfig = computed(() => SIZE_CONFIG[props.displaySize]);

onMounted(start);
onUnmounted(stop);
</script>

<style scoped>
/* トーストアニメーション */
.toast-container {
 display: flex;
 flex-direction: column-reverse; /* 新しいトーストを下に表示 */
 max-width: 100vw; /* ビューポート幅を超えないように制限 */
 box-sizing: border-box;
}

.toast-enter-active {
 transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.toast-leave-active {
 transition: all 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.toast-move {
 transition: transform 0.2s ease;
}

/* 右からスライドイン */
.toast-enter-from {
 opacity: 0;
 transform: translateX(100%) scale(0.9);
}

.toast-enter-to {
 opacity: 1;
 transform: translateX(0) scale(1);
}

/* 右へスライドアウト */
.toast-leave-from {
 opacity: 1;
 transform: translateX(0) scale(1);
}

.toast-leave-to {
 opacity: 0;
 transform: translateX(100%) scale(0.9);
}
</style>
