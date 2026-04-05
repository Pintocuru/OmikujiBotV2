<!-- src/MainGenerator/ui/CommentBubble/CommentBubblePersistent.vue -->
<template>
  <div class="relative pointer-events-auto -mx-4" :style="characterStyle">
    <div class="relative flex flex-col items-center">
      <!-- コメント吹き出し -->
      <div class="absolute bottom-full -translate-y-36 left-1/2 -translate-x-1/2 min-w-[320px]">
        <CommentDisplay
          :displayed-comments="messages"
          :remove-comment="handleRemoveComment"
          :enter-motion="enterMotion"
          :leave-motion="enterMotion"
          :animated-text="bubble.bubbleTextAnimate"
        />
      </div>

      <!-- キャラクター画像（画像がある場合のみ表示） -->
      <div v-if="isValidCharacter(character.key)" class="flex justify-center items-end">
        <LayerImage :layers="characterLayers" :size="bubble.characterSize" :animation="characterAnimation" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import { useCharacterEmotionState } from './composables/useCharacterEmotionState'
  import CommentDisplay from './CommentDisplay.vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { BotMessageBubbleType, CharacterType, CommentBubbleSchema } from '@/types'

  const props = defineProps<{
    character: CharacterType
    slotIndex: number
    messages: BotMessageBubbleType[]
    isActive: boolean
  }>()

  const emit = defineEmits<{
    removeComment: [messageId: string]
  }>()

  const appStore = useAppStore()
  const { characterMap, isValidCharacter } = useCharacterManager()

  // 設定取得
  const bubble = computed(() => appStore.data.components.settings.bubble || CommentBubbleSchema.parse({}))
  const enterMotion = computed(() => bubble.value.bubbleMotionEnter)

  // キャラクター感情状態（composableを統合）
  const messagesRef = computed(() => props.messages)
  const { getCharacterLayers, getCharacterAnimation, updateCharacterEmotion } = useCharacterEmotionState(
    messagesRef,
    characterMap
  )

  // このキャラクターのレイヤー
  const characterLayers = computed(() => getCharacterLayers(props.character.key))
  const characterAnimation = computed(() => getCharacterAnimation(props.character.key))

  // キャラクタースタイル（最新発言者をハイライト）
  const characterStyle = computed(() => ({
    zIndex: props.isActive ? 50 : 0,
    filter: props.isActive ? 'brightness(100%)' : 'brightness(60%)',
  }))

  // コメント削除時の処理（親にemit）
  const handleRemoveComment = (messageId: string) => {
    emit('removeComment', messageId)

    // 感情状態を更新
    updateCharacterEmotion(props.character.key)
  }
</script>
