<!-- src/MainGenerator/components/OmikujiBot/CommentDisplay.vue -->
<template>
  <div
    v-for="(message, index) in displayedComments"
    :key="message.id"
    class="absolute w-full"
    :style="{
      top: `${index * spacing}px`,
      zIndex: 1000 - index,
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
  import { computed } from 'vue'
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
    mode: 'stack' | 'persistent' // 表示モード
    spacing: number
    avatarTop?: string // PersistentCharacter用
  }

  const props = defineProps<Props>()

  // コメントのスタイル計算
  const getCommentStyle = (index: number) => {
    const baseStyle = {
      zIndex: props.mode === 'stack' ? props.displayedComments.length - index : 1000 - index,
    }

    if (props.mode === 'stack') {
      return {
        ...baseStyle,
        top: `${index * props.spacing}px`,
      }
    } else {
      // PersistentCharacter用
      const avatarTopPx = Number(props.avatarTop?.replace('px', '') || '0')
      return {
        ...baseStyle,
        bottom: `${avatarTopPx + index * props.spacing + 20}px`,
      }
    }
  }
</script>
