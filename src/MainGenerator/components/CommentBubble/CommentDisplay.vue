<!-- src/MainGenerator/components/OmikujiBot/CommentDisplay.vue -->
<template>
  <div
    v-for="(message, index) in displayedComments"
    :key="message.id"
    class="absolute w-full"
    :style="{
      top: `${index * spacing}px`,
      zIndex: 20 - index,
    }"
  >
    <MotionWrapper
      v-model:visible="message.visible"
      :initialMotion="enterMotion"
      :enter-motion="enterMotion"
      :leave-motion="leaveMotion"
      :auto-hide="false"
      @after-leave="() => removeComment(message.id)"
    >
      <div class="flex justify-center">
        <CommentBubbleItem
          :botName="message.name"
          :message="displayMessage(message)"
          :color="message.color"
          :animated-text="animatedText"
          :brightnessLevel="index"
          :custom-classes="message.color?.customClasses"
          :style="{ zIndex: index }"
        />
      </div>

      <!-- スロットにスコープを渡す -->
      <slot :message="message" :index="index" />
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import CommentBubbleItem from './CommentBubbleItem.vue'
  import { DisplayBotMessage } from './composables/useBotDisplay'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { MotionType } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'

  const props = withDefaults(
    defineProps<{
      displayedComments: DisplayBotMessage[]
      removeComment: (id: string) => void
      enterMotion?: MotionType
      leaveMotion?: MotionType
      animatedText?: boolean
      spacing?: number
      showToastFallback?: boolean // ★ toastをフォールバック表示するか
    }>(),
    {
      removeComment: () => {},
      enterMotion: 'slideUp',
      leaveMotion: 'slideUp',
      animatedText: false,
      spacing: 40,
      showToastFallback: false,
    }
  )

  /**
   * 表示するメッセージを決定
   * 1. bubble が存在すれば bubble を表示
   * 2. bubble が空で showToastFallback=true なら toast を表示
   */
  const displayMessage = (message: DisplayBotMessage): string => {
    const bubble = message.comment?.bubble || ''
    const toast = message.comment?.toast || ''

    // bubble が存在する場合は bubble を優先
    if (bubble) {
      return bubble
    }

    // bubble が空で、フォールバックが有効な場合は toast を表示
    if (props.showToastFallback && toast) {
      return toast
    }

    return ''
  }
</script>
