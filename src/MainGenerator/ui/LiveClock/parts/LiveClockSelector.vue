<!-- src/MainGenerator/ui/LiveClock/parts/LiveClockSelector.vue -->
<template>
  <div class="w-full bg-base-100 transparent-bg overflow-hidden" :data-theme="settings.color?.daisyUiTheme">
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
  import type { SettingsClockType } from '@/types/OmikujiData/'
  import type { ClockComponent } from '@/types/'
  import Standard from './Standard.vue'
  import Cyber from './Cyber.vue'
  import Disco from './Disco.vue'
  import Pastel from './Pastel.vue'

  const props = withDefaults(
    defineProps<{
      settings: SettingsClockType
      defaultMessage: string
      isMounted: boolean
      isFlipped: boolean
      currentMsg: string
    }>(),
    {}
  )

  const componentMap: Record<ClockComponent, Component> = {
    standard: Standard,
    cyber: Cyber,
    disco: Disco,
    pastel: Pastel,
  }
  const currentComponent = computed(() => componentMap[props.settings.component] ?? Standard)
</script>
