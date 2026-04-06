<!-- src/MainGenerator/ui/CommentBubble/CommentBubble.vue -->
<template>
  <div class="relative pointer-events-none z-10">
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
  import { useCharacterSelection } from './composables/useCharacterSelection'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'

  const { showCharacters, characterMap } = useCharacterManager()

  // bubble kind をまとめて処理済みメッセージ取得
  const { messages } = useFilteredBotMessages('commentSpin')

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
