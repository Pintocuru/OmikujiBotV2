<!-- src/MainGenerator/components/OmikujiBot/CommentDisplay.vue -->
<template>
  <div
    v-for="(item, index) in visibleComments"
    :key="item.message.id"
    class="absolute left-0 right-0"
    :style="{
      top: `${index * 40}px`,
      zIndex: 20 - index,
    }"
  >
    <!-- ! を使用… -->
    <MotionWrapper
      v-model:visible="item.message.display!.visible"
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
  import MotionWrapper from '@main/scripts/MotionVariants/MotionWrapper.vue'
  import { MotionType } from '@main/scripts/MotionVariants/MotionVariants'
  import { useAppStore } from '@main/stores/useAppStore'
  import { BotMessageCommentType, CharacterColorScheme } from '@/types'

  const props = withDefaults(
    defineProps<{
      displayedComments: BotMessageCommentType[]
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

  // トースト機能がOFFなら、こちらで表示する
  const displayMessage = (bot: BotMessageCommentType): string | null => {
    const bubble = bot.bubble
    if (!bubble) return null

    const { message, isToast } = bubble
    const conditions = appStore.data.components.conditions || []

    if (conditions.includes('toast') && isToast) return null
    return message
  }

  // 表示対象のみを抽出し、メッセージ文字列も保持
  const visibleComments = computed(() =>
    props.displayedComments
      .map((message) => {
        const text = displayMessage(message)
        return text ? { message, text } : null
      })
      .filter((v): v is { message: BotMessageCommentType; text: string } => v !== null)
  )
</script>
