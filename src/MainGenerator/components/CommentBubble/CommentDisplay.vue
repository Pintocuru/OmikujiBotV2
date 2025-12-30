<!-- src/MainGenerator/components/OmikujiBot/CommentDisplay.vue -->
<template>
  <div
    v-for="(message, index) in displayedComments"
    :key="message.id"
    class="absolute w-full"
    :style="{
      top: `${index * 40}px`,
      zIndex: 20 - index,
    }"
  >
    <template v-if="displayMessage(message) as string">
      <MotionWrapper
        v-model:visible="message.visible"
        :motion="enterMotion"
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

        <slot :message="message" :index="index" />
      </MotionWrapper>
    </template>
  </div>
</template>

<script setup lang="ts">
  import CommentBubbleItem from './CommentBubbleItem.vue'
  import { DisplayBotMessage } from './composables/useBotDisplay'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { MotionType } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  const props = withDefaults(
    defineProps<{
      displayedComments: DisplayBotMessage[]
      removeComment: (id: string) => void
      enterMotion?: MotionType
      leaveMotion?: MotionType
      animatedText?: boolean
    }>(),
    {
      removeComment: () => {},
      enterMotion: 'slideUp',
      leaveMotion: 'slideUp',
      animatedText: false,
    }
  )

  const appStore = useAppStore()

  /**
   * 表示するメッセージを決定
   * 1. bubble が存在すれば bubble を表示
   * 2. bubble が空で showToastFallback=true なら toast を表示
   */
  const displayMessage = (message: DisplayBotMessage): string => {
    const { bubble = '', toast = '' } = message.message || {}
    const conditions = appStore.data.components.conditions || []

    if (bubble) return bubble
    if (!conditions.includes('toast') && toast) return toast
    return ''
  }
</script>
