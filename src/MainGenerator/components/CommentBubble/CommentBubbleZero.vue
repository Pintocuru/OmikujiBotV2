<!-- src\MainGenerator\components\CommentBubble\ViewBotMessage.vue -->
<template>
  <div class="relative h-screen">
    <!-- 0番地キャラクターのコメント表示エリア（中央上部） -->
    <div class="absolute top-0 left-0 right-0 flex justify-center">
      <CommentDisplay
        :displayed-comments="displayedComments"
        :remove-comment="removeComment"
        :enter-motion="bubble.bubbleMotionEnter"
        :leave-motion="bubble.bubbleMotionEnter"
        :animated-text="bubble.bubbleTextAnimate"
      >
        <template #default="{ message, index }">
          <!-- キャラクター（最新コメント時のみ表示） -->
          <div class="absolute top-[180px] left-0 right-0 flex justify-center">
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
  import { storeToRefs } from 'pinia'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterLayerImage from '@/common/LayerImage/CharacterLayerImage.vue'
  import { useBotDisplay } from './composables/useBotDisplay'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'

  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)
  const { iconSrc, isValidCharacter, showCharacters } = useCharacterManager()

  // 設定の取得
  const bubble = computed(() => appStore.data.components.bubble || {})

  // 0番地のコメント取得
  const zeroIndexMessages = computed(() => {
    const allowKeys = showCharacters.value.center ?? []

    // centerが空の場合は何も表示しない
    if (allowKeys.length === 0) return []

    return botMessages.value.filter((message) => {
      // null の場合はキャラクター非表示モードなのでそのまま表示させる
      if (message.characterKey === null) return true
      return allowKeys.includes(message.characterKey)
    })
  })

  // 既存のuseBotDisplayはそのまま使用
  const { displayedComments, removeComment, start, stop } = useBotDisplay(zeroIndexMessages, 'comment')

  onMounted(() => start())
  onUnmounted(() => stop())
</script>
