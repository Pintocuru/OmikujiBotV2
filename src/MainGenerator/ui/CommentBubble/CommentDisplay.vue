<!-- src/MainGenerator/ui/CommentBubble/CommentDisplay.vue -->
<template>
  <div
    v-for="(item, index) in displayedComments"
    :key="item.id"
    class="absolute left-0 right-0"
    :style="{
      top: `${index * 40}px`,
      zIndex: 20 - index,
    }"
  >
    <!-- ! を使用… -->
    <MotionWrapper
      v-model:visible="item.display!.visible"
      :motion="enterMotion"
      :auto-hide="false"
      @after-leave="() => removeComment(item.id)"
    >
      <div class="flex justify-center">
        <CommentBubbleItem
          :botName="item.bubble.name ?? ''"
          :message="item.bubble.message"
          :color="getCharacterColor(item.bubble.characterKey)"
          :animated-text="animatedText"
          :brightnessLevel="index"
          :custom-classes="getCharacterColor(item.bubble.characterKey).customClasses"
          :style="{ zIndex: index }"
        />
      </div>

      <slot :message="item" :index="index" />
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { BotMessageBubbleType, EnterMotionType } from '@/types'
  import CommentBubbleItem from '@main/ui/CommentBubble/parts/CommentBubbleItem.vue'
  import MotionWrapper from '@main/ui/CommentBubble/MotionVariants/MotionWrapper.vue'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'

  withDefaults(
    defineProps<{
      displayedComments: BotMessageBubbleType[]
      removeComment: (id: string) => void
      enterMotion?: EnterMotionType
      leaveMotion?: EnterMotionType
      animatedText?: boolean
    }>(),
    {
      removeComment: () => undefined,
      enterMotion: 'slideUp',
      leaveMotion: 'slideUp',
      animatedText: false,
    }
  )

  const { getCharacterColor } = useCharacterManager()
</script>
