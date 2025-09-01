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
        <CommentBubble
          :name="message.name"
          :comment="message.comment"
          :color="message.color"
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
  import CommentBubble from './CommentBubble.vue'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import type { DisplaySize } from '@shared/types'
  import { DisplayBotMessage } from './composables/useBotDisplay'
  import { MotionType } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'

  interface Props {
    displayedComments: DisplayBotMessage[]
    removeComment: (id: string) => void
    enterMotion?: MotionType
    leaveMotion?: MotionType
    textSize: DisplaySize
    spacing: number
  }

  const props = defineProps<Props>()
</script>
