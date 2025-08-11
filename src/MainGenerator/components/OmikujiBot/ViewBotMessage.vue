<!-- src/MainGenerator/components/ViewBotMessage.vue -->
<template>
 <div class="relative w-full h-screen overflow-hidden">
  <transition-group
   class="comment-container"
   name="comment"
   tag="div"
   appear
   move-class="comment-move"
   @before-enter="onBeforeEnter"
   @enter="onEnter"
   @leave="onLeave"
  >
   <div
    v-for="(message, index) in displayedComments"
    :key="message.id"
    class="absolute w-full"
    :style="{
     top: `${index * sizeConfig.spacing}px`,
     zIndex: displayedComments.length - index
    }"
   >
    <!-- コメント吹き出し -->
    <div class="absolute left-1/2 -translate-x-1/2 transform">
     <CommentBubble
      :name="message.name"
      :comment="message.comment"
      :color="message.color"
      :text-size="displaySize"
      :brightness="getBrightness(index)"
      :custom-classes="message.color?.customClasses"
     />
    </div>

    <!-- キャラクターアイコン -->
    <div
     v-if="message.profileImage && message.profileImage !== ''"
     class="absolute left-1/2 -translate-x-1/2 transform rounded-full overflow-hidden z-40"
     :class="sizeConfig.avatar"
     :style="{
      opacity: index === 0 ? '100%' : '0%',
      top: sizeConfig.avatarTop,
      backgroundColor: message.color?.backgroundColor || '#ccc'
     }"
    >
     <img
      :src="getImagePath(message.profileImage)"
      :alt="`${message.name}のアバター`"
      @error="handleImageError(message)"
      class="w-full h-full object-cover"
     />
    </div>
   </div>
  </transition-group>
 </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { getImagePath } from '@/types/';
import { useBotCommentDisplay } from '@/MainGenerator/components/OmikujiBot/useBotMessage';
import { useCommentAnimation } from '@/MainGenerator/components/OmikujiBot/useCommentAnimation';
import type { AnimationType } from '@/types/BotComponents/animation';
import { useAppStore, useDisplayStore } from '@/MainGenerator/stores';
import { storeToRefs } from 'pinia';
import CommentBubble from './CommentBubble.vue';

// サイズ設定の定数
const SIZE_CONFIG = {
 xs: { text: 'text-md', avatar: 'w-32 h-32', avatarTop: '160px', spacing: 20 },
 sm: { text: 'text-lg', avatar: 'w-48 h-48', avatarTop: '200px', spacing: 40 },
 md: { text: 'text-xl', avatar: 'w-64 h-64', avatarTop: '240px', spacing: 60 },
 lg: { text: 'text-2xl', avatar: 'w-80 h-80', avatarTop: '280px', spacing: 80 },
 xl: { text: 'text-3xl', avatar: 'w-96 h-96', avatarTop: '320px', spacing: 100 }
} as const;

// Piniaストアの使用
const appStore = useAppStore();
const displayStore = useDisplayStore();

// リアクティブ変数
const { botMessages } = storeToRefs(appStore);
const displaySize = computed(() => displayStore.displaySize);

// TODO:実装
const animationType = computed(() => 'slideUp');

const { displayedComments, handleImageError, start, stop } = useBotCommentDisplay(
 botMessages,
 'comment'
);

// アニメーション関連
const { animateEnter, animateLeave } = useCommentAnimation(animationType.value as AnimationType);

// サイズ設定の取得
const sizeConfig = computed(() => SIZE_CONFIG[displaySize.value]);

// brightness計算
const getBrightness = (index: number) => Math.max(100 - index * 15, 30);

// アニメーションイベントハンドラー
const onBeforeEnter = (el: Element) => {
 // 初期状態の設定（必要に応じて）
};

const onEnter = (el: Element, done: () => void) => {
 animateEnter(el, done);
};

const onLeave = (el: Element, done: () => void) => {
 animateLeave(el, done);
};

onMounted(start);
onUnmounted(stop);
</script>

<style scoped>
/* CSS Transitionは削除、Anime.jsが代替 */
.comment-move {
 transition: transform 0.3s ease;
}

.avatar {
 will-change: transform, opacity;
 transition: opacity 0.4s ease-in-out;
}
</style>
