<!-- src/MainGenerator/ui/CommentSpin/parts/CommentSpinSelector.vue -->
<template>
  <div class="w-full" :data-theme="settings.color">
    <component
      :is="currentItem"
      :color="settings.color"
      :is-spinning="isSpinning"
      :slot-messages="slotMessages"
      :resolved-message="resolvedMessage"
      @animation-ready="(el: HTMLElement) => emit('animation-ready', el)"
      @animation-end="emit('animation-end')"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import type { BotMessageBubbleType } from '@/types'
  import type { CommentSpinType, spinComponent } from '@/types/OmikujiData/UiSettings/CommentSpinSchema'
  import Standard from '../layouts/Standard.vue'

  const props = defineProps<{
    settings: CommentSpinType
    isSpinning: boolean
    slotMessages: BotMessageBubbleType[]
    resolvedMessage: BotMessageBubbleType | null
  }>()

  const emit = defineEmits<{
    'animation-ready': [el: HTMLElement]
    'animation-end': []
  }>()

  const itemMap: Record<spinComponent, Component> = {
    standard: Standard,
  }

  const currentItem = computed(() => itemMap[props.settings.component] ?? Standard)
</script>
