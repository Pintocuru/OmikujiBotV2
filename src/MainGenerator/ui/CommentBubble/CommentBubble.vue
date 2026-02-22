<!-- src/MainGenerator/ui/CommentBubble/CommentBubble.vue -->
<template>
  <div class="relative pointer-events-none z-10">
    <!-- BOTメッセージ表示(0番地) -->
    <div class="flex justify-center item-center">
      <CommentBubbleZero :center-messages="centerMessages" @remove-comment="handleRemoveComment" />
    </div>
    <!-- 常時表示キャラクター(1番地以降) -->
    <div class="absolute bottom-0 left-0 right-0 flex items-end justify-center">
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
  import { computed, onMounted, onUnmounted } from 'vue'
  import type { BotMessageBubbleType } from '@/types'
  import CommentBubbleZero from './CommentBubbleZero.vue'
  import CommentBubblePersistent from './CommentBubblePersistent.vue'
  import { useCharacterSelection } from './composables/useCharacterSelection'
  import { useBotDisplay } from './composables/useBotDisplay'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'

  const { showCharacters, characterMap } = useCharacterManager()

  // bubble kind をまとめて処理済みメッセージ取得
  const { messages } = useFilteredBotMessages('bubble')

  // 0番地: 中央表示用
  const centerMessages = computed<BotMessageBubbleType[]>(() => {
    const allowKeys = showCharacters.value.center

    return messages.value.filter((msg) => {
      const key = msg.bubble?.characterKey
      // null は中央表示
      return key === null || allowKeys.includes(key)
    })
  })

  // 1-4番地: スロット用
  const indexMessages = computed<BotMessageBubbleType[]>(() => {
    const allowKeys = [
      ...(showCharacters.value.slot1 ?? []),
      ...(showCharacters.value.slot2 ?? []),
      ...(showCharacters.value.slot3 ?? []),
      ...(showCharacters.value.slot4 ?? []),
    ]

    if (!allowKeys.length) return []

    return messages.value.filter((msg) => {
      const key = msg.bubble?.characterKey
      // null は中央専用
      return key !== null && allowKeys.includes(key)
    })
  })

  // 常時表示キャラクター制御
  const { displayedComments, removeComment, start, stop } = useBotDisplay(indexMessages)

  // キャラクター選択
  const { latestCommenterKey, slotCharacters } = useCharacterSelection(displayedComments, showCharacters, characterMap)

  // 表示中メッセージ取得
  const getCharacterMessages = (characterKey: string): BotMessageBubbleType[] => {
    return displayedComments.value.filter((msg) => msg.bubble?.characterKey === characterKey && msg.display?.visible)
  }

  // コメント削除
  const handleRemoveComment = (messageId: string) => removeComment(messageId)

  onMounted(start)
  onUnmounted(stop)
</script>
