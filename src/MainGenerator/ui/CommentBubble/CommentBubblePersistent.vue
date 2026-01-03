<!-- src/MainGenerator/components/CommentBubble/CommentBubblePersistent.vue -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
    <div
      v-for="{ character, slotIndex } in slotCharacters"
      :key="character.key"
      class="relative pointer-events-auto -mx-4"
      :style="getCharacterStyle(character.key)"
    >
      <div class="relative flex flex-col items-center">
        <!-- コメント吹き出し -->
        <div class="absolute bottom-full mb-[240px] left-1/2 -translate-x-1/2 min-w-[320px] max-w-[90vw]">
          <CommentDisplay
            :displayed-comments="getCharacterComments(character.key)"
            :remove-comment="(id) => removeCommentWithEmotionUpdate(id, character.key)"
            :enter-motion="enterMotion"
            :leave-motion="enterMotion"
            :animated-text="bubble.bubbleTextAnimate"
          />
        </div>

        <!-- キャラクター画像 -->
        <div class="flex justify-center items-end">
          <LayerImage :layers="getCharacterLayers(character.key)" :size="bubble.characterSize" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { useCommentBubblePersistent } from './composables/useCommentBubblePersistent'
  import CommentDisplay from './CommentDisplay.vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'

  const {
    slotCharacters,
    latestCommenterKey,
    getCharacterLayers,
    getCharacterComments,
    removeCommentWithEmotionUpdate,
    enterMotion,
    bubble,
    start,
    stop,
  } = useCommentBubblePersistent()

  // キャラクタースタイル（最新発言者をハイライト）
  const getCharacterStyle = (key: string) => {
    const isActive = key === latestCommenterKey.value
    return {
      zIndex: isActive ? 50 : 0,
      filter: isActive ? 'brightness(100%)' : 'brightness(60%)',
    }
  }

  onMounted(start)
  onUnmounted(stop)
</script>
