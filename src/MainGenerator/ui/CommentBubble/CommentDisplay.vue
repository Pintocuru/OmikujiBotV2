<!-- src/MainGenerator/components/OmikujiBot/CommentDisplay.vue -->
<template>
  <div
    v-for="(item, index) in visibleComments"
    :key="item.message.id"
    class="absolute w-full"
    :style="{
      top: `${index * 40}px`,
      zIndex: 20 - index,
    }"
  >
    <MotionWrapper
      v-model:visible="item.message.visible"
      :motion="enterMotion"
      :auto-hide="false"
      @after-leave="() => removeComment(item.message.id)"
    >
      <div class="flex justify-center">
        <CommentBubbleItem
          :botName="item.message.bubble?.name ?? ''"
          :message="item.text"
          :color="item.message.bubble?.color ?? CharacterColorScheme.parse({})"
          :animated-text="animatedText"
          :brightnessLevel="index"
          :custom-classes="item.message.bubble?.color?.customClasses"
          :style="{ zIndex: index }"
        />
      </div>

      <slot :message="item.message" :index="index" />
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import CommentBubbleItem from '@/common/ui/CommentBubble/CommentBubbleItem.vue'
  import { DisplayBotMessage } from './composables/useBotDisplay'
  import MotionWrapper from '@main/scripts/MotionVariants/MotionWrapper.vue'
  import { MotionType } from '@main/scripts/MotionVariants/MotionVariants'
  import { useAppStore } from '@main/stores/useAppStore'
  import { CharacterColorScheme } from '@/types'

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

  const displayMessage = (bot: DisplayBotMessage): string | null => {
    if (!bot.bubble) return null

    const { message, toast, isToast } = bot.bubble
    const conditions = appStore.data.components.conditions || []

    if (!conditions.includes('toast') && isToast && toast) return toast
    if (!isToast) return message
    return null
  }

  /**
   * 表示対象のみを抽出し、メッセージ文字列も保持
   */
  const visibleComments = computed(() =>
    props.displayedComments
      .map((message) => {
        const text = displayMessage(message)
        return text ? { message, text } : null
      })
      .filter((v): v is { message: DisplayBotMessage; text: string } => v !== null)
  )
</script>
