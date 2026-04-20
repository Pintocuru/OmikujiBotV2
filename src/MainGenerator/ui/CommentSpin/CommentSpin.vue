<!-- src/MainGenerator/ui/CommentSpin/CommentSpin.vue -->
<template>
  <CenteringWrapper>
    <CommentSpinSelector
      :settings="spinSettings"
      :logoPath="displayLogoPath"
      :color="getCharacterColor(resolvedMessage?.bubble.characterKey ?? null) || defaultColor"
      :is-spinning="isSpinning"
      :slot-messages="slotMessages"
      :resolved-message="resolvedMessage"
      @animation-ready="(el, h) => onAnimationReady(el, h)"
      @animation-end="onAnimationEnd"
    />
  </CenteringWrapper>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CommentSpinSchema } from '@/types'
  import { useCommentSpinMessages } from './composables/useCommentSpinMessages'
  import { useCommentSpinAnimation } from './composables/useCommentSpinAnimation'
  import CommentSpinSelector from './parts/CommentSpinSelector.vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import CenteringWrapper from '@main/ui/common/CenteringWrapper.vue'
  import { useFilteredBotMessages } from '@main/ui/common/useFilteredBotMessages'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const { getCharacterColor } = useCharacterManager()
  const defaultColor = computed(() => data.value.components.commonStyle.defaultColor)

  const displayLogoPath = computed(() => overrideLogoPath.value ?? [spinSettings.value.logoPath])

  const spinSettings = computed(() => data.value.components.settings.commentSpin ?? CommentSpinSchema.parse({}))
  const animation = computed(() => spinSettings.value.animation)

  const { messages } = useFilteredBotMessages('commentSpin', {
    allowEmptyMessage: false,
  })

  const { slotMessages, isSpinning, resolvedMessage, overrideLogoPath, startSpin, onAnimationReady, onAnimationEnd } =
    useCommentSpinAnimation({
      duration: spinSettings.value.durationSeconds * 1000,
      type: animation,
    })

  useCommentSpinMessages({ messages, startSpin })
</script>
