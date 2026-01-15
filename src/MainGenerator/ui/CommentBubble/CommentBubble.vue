<!-- src\MainGenerator\ui\CommentBubble\CommentBubble.vue -->
<template>
  <div class="relative">
    <!-- BOTメッセージ表示(0番地) -->
    <div class="flex justify-center item-center">
      <CommentBubbleZero :center-messages="centerMessages" @remove-comment="handleRemoveComment" />
    </div>
    <!-- 常時表示キャラクター(1番地以降) -->
    <div class="absolute bottom-0 left-0 right-0 items-end">
      <CommentBubblePersistent
        v-for="{ character, slotIndex } in slotCharacters"
        :key="character.key"
        :character="character"
        :slot-index="slotIndex"
        :messages="getCharacterMessages(character.key)"
        :is-active="character.key === latestCommenterKey"
        @remove-comment="handleRemoveComment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import CommentBubbleZero from './CommentBubbleZero.vue'
  import CommentBubblePersistent from './CommentBubblePersistent.vue'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import { storeToRefs } from 'pinia'
  import { useCharacterManager } from '@/MainGenerator/scripts/CharacterManager/useCharacterManager'
  import { computed, onMounted, onUnmounted } from 'vue'
  import { BotMessageCommentType } from '@/types'
  import { useCharacterSelection } from './composables/useCharacterSelection'
  import { useBotDisplay } from './composables/useBotDisplay'

  // メッセージはここから取り出す
  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)
  const { showCharacters, characterMap } = useCharacterManager()

  // 設定の取得
  const isToastEnabled = computed(() => appStore.data.featureUsage.components.includes('toast'))

  // 0番地のコメント取得
  const centerMessages = computed(() => {
    const allowKeys = showCharacters.value.center ?? []
    if (allowKeys.length === 0) return []

    return botMessages.value.filter((message): message is BotMessageCommentType => {
      if (message.type !== 'comment') return false
      if (isToastEnabled.value && message.bubble?.isToast) return false
      return allowKeys.includes(message.bubble?.characterKey)
    })
  })

  // 1-4番地のコメント取得
  const indexMessages = computed(() => {
    const allowKeys = [
      ...showCharacters.value.slot1,
      ...showCharacters.value.slot2,
      ...showCharacters.value.slot3,
      ...showCharacters.value.slot4,
    ]

    if (allowKeys.length === 0) return []

    return botMessages.value.filter((message): message is BotMessageCommentType => {
      if (message.type !== 'comment') return false
      if (isToastEnabled.value && message.bubble?.isToast) return false

      // null の場合はキャラクター非表示モードなのでそのまま表示
      if (message.bubble?.characterKey === null) return true

      return allowKeys.includes(message.bubble?.characterKey)
    })
  })

  // 常時表示キャラクターの制御
  const { displayedComments, removeComment, start, stop } = useBotDisplay(indexMessages)

  // キャラクター選択
  const { latestCommenterKey, slotCharacters } = useCharacterSelection(displayedComments, showCharacters, characterMap)

  // 特定キャラクターのメッセージを取得
  const getCharacterMessages = (characterKey: string) => {
    return displayedComments.value.filter((c) => c.bubble?.characterKey === characterKey && c.display?.visible)
  }

  // コメント削除ハンドラ（子からのemitを受け取る）
  const handleRemoveComment = (messageId: string) => removeComment(messageId)

  onMounted(start)
  onUnmounted(stop)
</script>
