<!-- src\MainGenerator\components\CommentBubble\ViewBotMessage.vue -->
<template>
  <div class="relative h-screen">
    <!-- 0番地キャラクターのコメント表示エリア（中央上部） -->
    <div class="absolute w-full" :style="{ bottom: '440px' }">
      <CommentDisplay
        :displayed-comments="displayedComments"
        :remove-comment="removeComment"
        :enter-motion="bubble.bubbleMotionEnter"
        :leave-motion="bubble.bubbleMotionEnter"
        :animated-text="bubble.bubbleTextAnimate"
        :show-toast-fallback="showToastFallback"
      >
        <template #default="{ message, index }">
          <!-- キャラクター（最新コメント時のみ表示） -->
          <div class="absolute top-[180px] left-1/2 -translate-x-1/2 transform">
            <CharacterLayerImage
              v-if="index === 0 && isValidCharacter(message.characterKey)"
              :layers="iconSrc(message.characterKey, message.iconKey)"
              :size="bubble.characterSize"
              :color="message.color"
            />
          </div>
        </template>
      </CommentDisplay>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterLayerImage from '@/common/LayerImage/CharacterLayerImage.vue'
  import { useBotDisplay } from './composables/useBotDisplay'
  import { useMessageFilter } from './composables/useMessageFilter'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import { useCharacterManager } from '@/MainGenerator/scripts/CharacterManager/useCharacterManager'

  const appStore = useAppStore()
  const { iconSrc, isValidCharacter } = useCharacterManager()

  // 設定の取得
  const bubble = computed(() => appStore.data.components.bubble || {})

  // toast専用コンポーネントが無効な場合、toastをフォールバック表示
  const conditions = computed(() => appStore.data.components?.conditions || [])
  const showToastFallback = computed(() => !conditions.value.includes('toast'))

  // 新しいフィルタリングロジックを使用
  const { zeroIndexMessages } = useMessageFilter()

  // 既存のuseBotDisplayはそのまま使用
  const { displayedComments, removeComment, start, stop } = useBotDisplay(zeroIndexMessages, 'comment')

  onMounted(() => start())
  onUnmounted(() => stop())
</script>
