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
  import { storeToRefs } from 'pinia'
  import { BotMessageBubbleType, BotMessageType } from '@/types'
  import CommentBubbleZero from './CommentBubbleZero.vue'
  import CommentBubblePersistent from './CommentBubblePersistent.vue'
  import { useCharacterSelection } from './composables/useCharacterSelection'
  import { useBotDisplay } from './composables/useBotDisplay'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'

  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)
  const { showCharacters, characterMap } = useCharacterManager()

  const isToastEnabled = computed(() => appStore.data.featureUsage.components.includes('toast'))

  // 型ガードヘルパー: トーストでないコメントメッセージのみを抽出
  const isDisplayableComment = (msg: BotMessageType): msg is BotMessageBubbleType => {
    if (typeof msg !== 'object' || msg === null) return false
    const m = msg as Partial<BotMessageBubbleType>
    return m.type === 'comment' && !(isToastEnabled.value && m.bubble?.isToast)
  }

  // 0番地: 中央表示用メッセージ
  const centerMessages = computed(() => {
    const allowKeys = showCharacters.value.center
    return botMessages.value.filter((msg): msg is BotMessageBubbleType => {
      if (!isDisplayableComment(msg)) return false
      const key = msg.bubble?.characterKey
      // null の場合はキャラクター非表示モードなので表示
      return key === null || allowKeys.includes(key)
    })
  })

  // 1-4番地: スロット表示用メッセージ
  const indexMessages = computed(() => {
    const allowKeys = [
      ...(showCharacters.value.slot1 ?? []),
      ...(showCharacters.value.slot2 ?? []),
      ...(showCharacters.value.slot3 ?? []),
      ...(showCharacters.value.slot4 ?? []),
    ]

    if (!allowKeys.length) return []

    return botMessages.value.filter((msg): msg is BotMessageBubbleType => {
      if (!isDisplayableComment(msg)) return false
      const key = msg.bubble?.characterKey
      // null は除外（0番地で表示）
      return key !== null && allowKeys.includes(key)
    })
  })

  // 常時表示キャラクターの制御
  const { displayedComments, removeComment, start, stop } = useBotDisplay(indexMessages)

  // キャラクター選択
  const { latestCommenterKey, slotCharacters } = useCharacterSelection(displayedComments, showCharacters, characterMap)

  // 特定キャラクターの表示中メッセージを取得
  const getCharacterMessages = (characterKey: string) => {
    return displayedComments.value.filter((msg) => msg.bubble?.characterKey === characterKey && msg.display?.visible)
  }

  // コメント削除ハンドラ
  const handleRemoveComment = (messageId: string) => removeComment(messageId)

  onMounted(start)
  onUnmounted(stop)
</script>
