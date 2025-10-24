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
      :enter-motion="enterMotion"
      :leave-motion="leaveMotion"
      :auto-hide="false"
      @after-leave="() => removeComment(message.id)"
    >
      <div class="flex justify-center">
        <CommentBubbleItem
          :name="message.name"
          :comment="message.comment"
          :color="message.color"
          :animated-text="animatedText"
          :text-size="textSize"
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
  import CommentBubbleItem from './CommentBubbleItem.vue'
  import { DisplayBotMessage } from './composables/useBotDisplay'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { MotionType } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
  import { DisplaySize } from '@shared/types'

  const props = withDefaults(
    defineProps<{
      displayedComments: DisplayBotMessage[]
      removeComment: (id: string) => void
      enterMotion?: MotionType
      leaveMotion?: MotionType
      animatedText?: boolean
      textSize: DisplaySize
      spacing: number
    }>(),
    {
      removeComment: () => {},
      enterMotion: 'slideUp',
      leaveMotion: 'slideUp',
      animatedText: false,
      textSize: 'md',
      spacing: 0,
    }
  )
</script>
