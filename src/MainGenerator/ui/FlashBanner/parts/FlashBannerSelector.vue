<!-- src/MainGenerator/ui/FlashBanner/parts/FlashBannerSelector.vue -->
<template>
  <div v-if="message" class="w-full bg-base-100 transparent-bg" :data-theme="color?.daisyUiTheme">
    <component
      :is="currentComponent"
      :settings="settings"
      :message="message"
      :characterLayers="characterLayers"
      :characterAnimation="characterAnimation"
      :color="color"
      :label-class="labelClass ?? ''"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { CharacterAnimationType, CharacterColorType, FlashBannerType, FlashComponent } from '@/types'
  import standard from '../layouts/standard.vue'
  import scroll from '../layouts/scroll.vue'
  import ticker from '../layouts/ticker.vue'
  import glass from '../layouts/glass.vue'
  import clear from '../layouts/clear.vue'
  import arcade from '../layouts/arcade.vue'
  import tweet from '../layouts/tweet.vue'

  const props = defineProps<{
    settings: FlashBannerType
    message: string
    characterLayers: string[]
    characterAnimation?: CharacterAnimationType
    color: CharacterColorType
    labelClass?: string
  }>()

  const componentMap: Record<FlashComponent, Component> = {
    standard,
    scroll,
    ticker,
    glass,
    clear,
    arcade,
    tweet,
  }
  const currentComponent = computed(() => componentMap[props.settings.component] ?? standard)
</script>
