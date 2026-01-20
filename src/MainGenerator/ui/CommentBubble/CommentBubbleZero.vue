<!-- src/MainGenerator/ui/CommentBubble/CommentBubbleZero.vue -->
<template>
  <div class="h-screen">
    <!-- 0番地キャラクターのコメント表示エリア（中央上部） -->
    <div class="absolute top-0 left-0 right-0 flex justify-center">
      <CommentDisplay
        :displayed-comments="displayedComments"
        :remove-comment="handleRemoveComment"
        :enter-motion="bubble.bubbleMotionEnter"
        :leave-motion="bubble.bubbleMotionEnter"
        :animated-text="bubble.bubbleTextAnimate"
      >
        <template #default="{ message }">
          <!-- キャラクター（最新コメント時のみ表示） -->
          <div
            v-if="hasImage(message.bubble?.characterKey)"
            class="absolute top-[180px] left-0 right-0 flex justify-center"
          >
            <CharacterLayerImage
              v-if="getCharacterLayers(message).length > 0"
              :layers="getCharacterLayers(message)"
              :size="bubble.characterSize"
              :color="getCharacterColor(message.bubble?.characterKey)"
            />
          </div>
        </template>
      </CommentDisplay>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, toRef } from 'vue'
  import CommentDisplay from './CommentDisplay.vue'
  import { useBotDisplay } from './composables/useBotDisplay'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import CharacterLayerImage from '@/common/LayerImage/CharacterLayerImage.vue'
  import { BotMessageBubbleType } from '@/types'

  const props = defineProps<{
    centerMessages: BotMessageBubbleType[]
  }>()

  const emit = defineEmits<{
    removeComment: [messageId: string]
  }>()

  const appStore = useAppStore()
  const { hasImage, getCharacterLayers, getCharacterColor } = useCharacterManager()

  // 設定の取得
  const bubble = computed(() => appStore.data.components.bubble || {})

  // コメント表示制御
  const { displayedComments, removeComment, start, stop } = useBotDisplay(toRef(() => props.centerMessages))

  // コメント削除ハンドラ（親にemit）
  const handleRemoveComment = (messageId: string) => {
    removeComment(messageId)
    emit('removeComment', messageId)
  }

  onMounted(start)
  onUnmounted(stop)
</script>
