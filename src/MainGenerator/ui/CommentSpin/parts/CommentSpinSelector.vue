<!-- src/MainGenerator/ui/CommentSpin/parts/CommentSpinSelector.vue -->
<template>
  <div class="bg-base-100 transparent-bg" :data-theme="color.daisyUiTheme">
    <component
      :is="currentItem"
      :color="color"
      :is-spinning="isSpinning"
      :slot-messages="slotMessages"
      :resolved-message="resolvedMessage"
      :size="settings.size"
      :animation="settings.animation"
      :characters="characters"
      @animation-ready="(el: HTMLElement, itemHeight: number) => emit('animation-ready', el, itemHeight)"
      @animation-end="emit('animation-end')"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import type { BotMessageBubbleType } from '@/types'
  import type { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import type { CommentSpinType, spinComponent } from '@/types/OmikujiData/UiSettings/CommentSpinSchema'
  import Standard from '../layouts/Standard.vue'
  import CharacterSpin from '../layouts/CharacterSpin.vue'
  import FlipCalendar from '../layouts/FlipCalendar.vue'
  import { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    settings: CommentSpinType
    color: DaisyUiThemeFieldsType
    isSpinning: boolean
    slotMessages: BotMessageBubbleType[]
    resolvedMessage: BotMessageBubbleType | null
    characters: Record<string, CharacterType>
  }>()

  const emit = defineEmits<{
    'animation-ready': [el: HTMLElement, itemHeight: number]
    'animation-end': []
  }>()

  const itemMap: Record<spinComponent, Component> = {
    standard: Standard,
    character: CharacterSpin,
    flipCalendar: FlipCalendar,
  }

  const currentItem = computed(() => itemMap[props.settings.component] ?? Standard)
</script>
