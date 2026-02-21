<!-- src/MainGenerator/ui/CommentBubble/CommentDisplay.vue -->
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
          :color="getCharacterColor(item.message.bubble.characterKey)"
          :animated-text="animatedText"
          :brightnessLevel="index"
          :custom-classes="getCharacterColor(item.message.bubble.characterKey).customClasses"
          :style="{ zIndex: index }"
        />
      </div>

      <slot :message="item.message" :index="index" />
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageBubbleType } from '@/types'
  import CommentBubbleItem from '@main/ui/CommentBubble/parts/CommentBubbleItem.vue'
  import MotionWrapper from '@main/scripts/MotionVariants/MotionWrapper.vue'
  import { EnterMotionType } from '@main/scripts/MotionVariants/MotionVariants'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import { transformIconPlaceholders } from './TransformIconPlaceholders'

  const props = withDefaults(
    defineProps<{
      displayedComments: BotMessageBubbleType[]
      removeComment: (id: string) => void
      enterMotion?: EnterMotionType
      leaveMotion?: EnterMotionType
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
  const { getCharacterColor } = useCharacterManager()

  // トースト機能がOFFなら、こちらで表示する
  const displayMessage = (bot: BotMessageBubbleType): string | null => {
    const bubble = bot.bubble
    if (!bubble) return null

    const { message, isToast } = bubble
    const conditions = appStore.data.components.conditions || []

    if (conditions.some((c) => c.kind === 'toast') && isToast) return null
    return message
  }

  // 表示対象のみを抽出し、メッセージ文字列も保持
  const visibleComments = computed(() =>
    props.displayedComments
      .map((message) => {
        const text = displayMessage(message)
        if (!text) return null

        // ★ 本番 UI のみの変換ポイント（store あり）
        const transformed = transformIconPlaceholders(text)

        return { message, text: transformed }
      })
      .filter((v): v is { message: BotMessageBubbleType; text: string } => v !== null)
  )
</script>
