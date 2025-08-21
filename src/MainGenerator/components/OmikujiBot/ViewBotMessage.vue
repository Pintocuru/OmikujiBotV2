<!-- src/MainGenerator/components/ViewBotMessage.vue -->
<template>
  <div class="relative w-full h-screen overflow-hidden">
    <div class="comment-container">
      <div
        v-for="(message, index) in displayedComments"
        :key="message.id"
        class="absolute w-full max-w-3xl mx-auto"
        :style="{
          left: '0',
          right: '0',
          top: `${index * sizeConfig.spacing}px`,
          zIndex: displayedComments.length - index,
        }"
        v-motion
        :initial="motionVariants[animationType].initial"
        :enter="motionVariants[animationType].enter"
        :leave="motionVariants[animationType].leave"
      >
        <div class="flex justify-center">
          <CommentBubble
            :name="message.name"
            :comment="message.comment"
            :color="message.color"
            :text-size="displaySize"
            :brightness="getBrightness(index)"
            :custom-classes="message.color?.customClasses"
          />
        </div>

        <div
          v-if="message.profileImage && message.profileImage !== ''"
          class="absolute left-1/2 -translate-x-1/2 transform rounded-full overflow-hidden z-40"
          :class="sizeConfig.avatar"
          :style="{
            opacity: index === 0 ? '100%' : '0%',
            top: sizeConfig.avatarTop,
            backgroundColor: message.color?.backgroundColor || '#ccc',
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { getImagePath } from '@/types/env'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
  import CommentBubble from './CommentBubble.vue'
  import { useBotCommentDisplay } from '@MainComponents/OmikujiBot/useBotMessage'
  import { motionVariants } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
  import { storeToRefs } from 'pinia'

  // サイズ設定の定数
  const SIZE_CONFIG = {
    xs: { text: 'text-md', avatar: 'w-32 h-32', avatarTop: '160px', spacing: 20 },
    sm: { text: 'text-lg', avatar: 'w-48 h-48', avatarTop: '200px', spacing: 40 },
    md: { text: 'text-xl', avatar: 'w-64 h-64', avatarTop: '240px', spacing: 60 },
    lg: { text: 'text-2xl', avatar: 'w-80 h-80', avatarTop: '280px', spacing: 80 },
    xl: { text: 'text-3xl', avatar: 'w-96 h-96', avatarTop: '320px', spacing: 100 },
  } as const

  // Piniaストアの使用
  const appStore = useAppStore()
  const displayStore = useDisplayStore()

  // リアクティブ変数
  const { botMessages } = storeToRefs(appStore)
  const displaySize = computed(() => displayStore.displaySize)

  const animationType = computed(() => appStore.omikujiData.displaySettings.base.bubbleAnimation)

  const { displayedComments, handleImageError, start, stop } = useBotCommentDisplay(botMessages, 'comment')

  // サイズ設定の取得
  const sizeConfig = computed(() => SIZE_CONFIG[displaySize.value])

  // brightness計算
  const getBrightness = (index: number) => Math.max(100 - index * 15, 30)

  onMounted(start)
  onUnmounted(stop)
</script>
