<!-- src/MainGenerator/ui/CommentBubble/CommentBubbleZero.vue -->
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
              v-if="shouldShowCharacterImage(message, index)"
              :layers="iconSrc(message.bubble?.characterKey, message.bubble?.iconKey)"
              :size="bubble.characterSize"
              :color="message.bubble?.color"
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
  import { useBotDisplay } from './composables/useBotDisplay'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import CharacterLayerImage from '@/common/LayerImage/CharacterLayerImage.vue'
  import { BotMessageCommentType } from '@/types'

  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)
  const { iconSrc, isValidCharacter, showCharacters } = useCharacterManager()

  // 設定の取得
  const bubble = computed(() => appStore.data.components.bubble || {})
  const isToastEnabled = computed(() => appStore.data.featureUsage.components.includes('toast'))

  // 0番地のコメント取得
  const zeroIndexMessages = computed(() => {
    const allowKeys = showCharacters.value.center ?? []

    // centerが空の場合は何も表示しない
    if (allowKeys.length === 0) return []

    return botMessages.value.filter((message): message is BotMessageCommentType => {
      if (message.type !== 'comment') return false
      if (isToastEnabled.value && message.bubble?.isToast) return false

      // null の場合はキャラクター非表示モードなのでそのまま表示させる
      if (message.bubble?.characterKey === null) return true

      // allowKeys に含まれていればフキダシは表示
      // ※ 画像の有無は問わない
      return allowKeys.includes(message.bubble?.characterKey)
    })
  })

  // 既存のuseBotDisplayはそのまま使用
  const { displayedComments, removeComment, start, stop } = useBotDisplay(zeroIndexMessages)

  // キャラクター画像を表示すべきかどうかを判定
  const shouldShowCharacterImage = (message: BotMessageCommentType, index: number): boolean => {
    if (!message.bubble) return false
    if (index !== 0) return false // 最新コメントのみ

    const characterKey = message.bubble.characterKey

    // キャラクター非表示モード
    if (characterKey === null) return false

    // キャラクターが有効（画像がある）場合のみ表示
    return isValidCharacter(characterKey)
  }

  onMounted(() => start())
  onUnmounted(() => stop())
</script>
