<!-- src/MainGenerator/ui/FlashBanner/parts/FlashBannerSelector.vue -->
<template>
  <div v-if="message" class="w-full bg-base-100 transparent-bg" :data-theme="color?.daisyUiTheme">
    <component
      :is="currentComponent"
      :settings="settings"
      :message="message"
      :layers="layers"
      :color="color"
      :label-class="labelClass ?? ''"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { CharacterColorType, FlashBannerType, FlashComponent } from '@/types/'
  import standard from '../layouts/standard.vue'
  import ticker from '../layouts/ticker.vue'
  import glass from '../layouts/glass.vue'
  import arcade from '../layouts/arcade.vue'
  import scroll from '../layouts/scroll.vue'

  const props = defineProps<{
    settings: FlashBannerType
    message: string
    layers: string[]
    color: CharacterColorType
    labelClass?: string
  }>()

  const componentMap: Record<FlashComponent, Component> = {
    standard,
    ticker,
    glass,
    arcade,
    scroll,
  }
  const currentComponent = computed(() => componentMap[props.settings.component] ?? standard)
</script>
