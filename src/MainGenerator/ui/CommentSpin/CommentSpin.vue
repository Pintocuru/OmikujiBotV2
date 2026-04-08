<template>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
    <CommentSpinSelector
      :settings="spinSettings"
      :color="getCharacterColor(resolvedMessage?.bubble.characterKey ?? null) || defaultColor"
      :is-spinning="isSpinning"
      :slot-messages="slotMessages"
      :resolved-message="resolvedMessage"
      :characters="characters"
      @animation-ready="(el, h) => onAnimationReady(el, h)"
      @animation-end="onAnimationEnd"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'
  import { CommentSpinSchema } from '@/types/OmikujiData/UiSettings/CommentSpinSchema'
  import { useCommentSpinMessages } from './composables/useCommentSpinMessages'
  import { useCommentSpinAnimation } from './composables/useCommentSpinAnimation'
  import CommentSpinSelector from './parts/CommentSpinSelector.vue'
  import { useCharacterManager } from '@/MainGenerator/scripts/CharacterManager/useCharacterManager'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const { getCharacterColor } = useCharacterManager()
  const defaultColor = computed(() => data.value.components.commonStyle.defaultColor)

  const spinSettings = computed(() =>
    // data.value.components.settings.commentSpin ??
    CommentSpinSchema.parse({
      component: 'character',
      size: {
        width: 180,
        height: 180,
      },
    })
  )
  const animation = computed(() => spinSettings.value.animation)
  const characters = computed(() => data.value.characters)

  const { messages } = useFilteredBotMessages('commentSpin')

  const { slotMessages, isSpinning, resolvedMessage, startSpin, onAnimationReady, onAnimationEnd } =
    useCommentSpinAnimation({ type: animation })

  useCommentSpinMessages({ messages, startSpin })
</script>
