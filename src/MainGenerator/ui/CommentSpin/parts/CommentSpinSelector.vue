<!-- src/MainGenerator/ui/CommentSpin/parts/CommentSpinSelector.vue -->
<template>
  <div class="bg-base-100 transparent-bg" :data-theme="color.daisyUiTheme" :style="wrapperStyle">
    <component
      :is="currentItem"
      :settings="settings"
      :color="color"
      :logoPath="logoPath"
      :is-spinning="isSpinning"
      :slot-messages="slotMessages"
      :resolved-message="resolvedMessage"
      :size="settings.size"
      :animation="settings.animation"
      @animation-ready="(el: HTMLElement, itemHeight: number) => emit('animation-ready', el, itemHeight)"
      @animation-end="emit('animation-end')"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import type { BotMessageBubbleType } from '@/types'
  import type { CommentSpinType, spinComponent } from '@/types/OmikujiData/UiSettings/CommentSpinSchema'
  import Standard from '../layouts/Standard.vue'
  import CharacterSpin from '../layouts/CharacterSpin.vue'
  import FlipCalendar from '../layouts/FlipCalendar.vue'
  import { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'
  import Popup from '../layouts/Popup.vue'

  const props = defineProps<{
    settings: CommentSpinType
    logoPath: string[]
    color: DaisyUiThemeFieldsType
    isSpinning: boolean
    slotMessages: BotMessageBubbleType[]
    resolvedMessage: BotMessageBubbleType | null
  }>()

  const emit = defineEmits<{
    'animation-ready': [el: HTMLElement, itemHeight: number]
    'animation-end': []
  }>()

  const itemMap: Record<spinComponent, Component> = {
    standard: Standard,
    character: CharacterSpin,
    flipCalendar: FlipCalendar,
    popup: Popup,
  }

  const currentItem = computed(() => itemMap[props.settings.component] ?? Standard)

  const wrapperStyle = computed(() => {
    const size = props.settings.size
    return {
      width: `${size.width}px`,
      maxWidth: '100%', // 念のため
    }
  })
</script>
