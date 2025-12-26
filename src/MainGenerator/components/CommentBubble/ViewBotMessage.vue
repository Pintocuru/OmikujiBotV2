<!-- src\MainGenerator\components\CommentBubble\ViewBotMessage.vue -->
<template>
  <div class="relative h-screen">
    <!-- 0番地キャラクターのコメント表示エリア（中央上部） -->
    <div class="absolute w-full" :style="{ bottom: '440px' }">
      <CommentDisplay
        :displayed-comments="displayedComments"
        :remove-comment="removeComment"
        :enter-motion="bubbleMotionEnter"
        :leave-motion="bubbleMotionEnter"
        :animated-text="bubbleTextAnimate"
        :show-toast-fallback="showToastFallback"
      >
        <template #default="{ message, index }">
          <!-- キャラクター（最新コメント時のみ表示） -->
          <CharacterAvatar
            v-if="index === 0 && message.profileImage"
            class="absolute top-[180px] left-1/2 -translate-x-1/2 transform"
            :profileImage="message.profileImage"
            :backgroundColor="message.color?.backgroundColor"
            :characterSize="bubble.characterSize"
            :showCharacterFrame="true"
          />
        </template>
      </CommentDisplay>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterAvatar from './CharacterAvatar.vue'
  import { useBotDisplay } from './composables/useBotDisplay'
  import { useMessageFilter } from './composables/useMessageFilter'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  const appStore = useAppStore()

  // 設定の取得
  const bubble = computed(() => appStore.data.components.bubble || {})
  const bubbleMotionEnter = computed(() => bubble.value.bubbleMotionEnter)
  const bubbleTextAnimate = computed(() => bubble.value.bubbleTextAnimate)

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
