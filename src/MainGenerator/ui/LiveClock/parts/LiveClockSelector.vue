<!-- src/MainGenerator/ui/LiveClock/parts/LiveClockSelector.vue -->
<template>
  <div class="bg-base-100 transparent-bg overflow-hidden" :data-theme="settings.color.daisyUiTheme">
    <component
      :is="currentComponent"
      :settings="settings"
      :default-message="defaultMessage"
      :is-mounted="isMounted"
      :is-flipped="isFlipped"
      :current-msg="currentMsg"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { ClockComponent, LiveClockType } from '@/types'
  import morning from '../layouts/Morning.vue'
  import soundPlayer from '../layouts/SoundPlayer.vue'
  import clearGlass from '../layouts/ClearGlass.vue'
  import steampunk from '../layouts/Steampunk.vue'
  import disco from '../layouts/Disco.vue'

  const props = defineProps<{
    settings: LiveClockType
    defaultMessage: string
    isMounted: boolean
    isFlipped: boolean
    currentMsg: string
  }>()

  const componentMap: Record<ClockComponent, Component> = {
    morning,
    soundPlayer,
    clearGlass,
    steampunk,
    disco,
  }
  const currentComponent = computed(() => componentMap[props.settings.component] ?? morning)
</script>
