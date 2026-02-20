<!-- src/MainGenerator/ui/FlashBanner/parts/FlashBannerRenderer.vue -->
<template>
  <component
    :is="currentComponent"
    :settings="settings"
    :message="message"
    :layers="layers"
    :color="color"
    :label-class="labelClass"
  />
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import type { CharacterColorType, SettingsFlashBannerType } from '@/types/OmikujiData/'
  import type { FlashComponent } from '@/types/'
  import StandardItem from './StandardItem.vue'
  import TickerItem from './TickerItem.vue'
  import GlassItem from './GlassItem.vue'
  import ArcadeItem from './ArcadeItem.vue'

  const props = withDefaults(
    defineProps<{
      settings: SettingsFlashBannerType
      message: string
      layers: string[]
      color: CharacterColorType
      labelClass?: string
    }>(),
    {
      labelClass: '',
    }
  )

  const componentMap: Record<FlashComponent, Component> = {
    standard: StandardItem,
    ticker: TickerItem,
    glass: GlassItem,
    arcade: ArcadeItem,
  }
  const currentComponent = computed(() => componentMap[props.settings.component] ?? StandardItem)
</script>
