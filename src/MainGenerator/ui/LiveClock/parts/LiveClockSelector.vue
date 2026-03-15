<!-- src/MainGenerator/ui/LiveClock/parts/LiveClockSelector.vue -->
<template>
  <div
    class="flex justify-center bg-base-100 transparent-bg overflow-hidden"
    :data-theme="settings.color?.daisyUiTheme"
  >
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
  import { ClockComponent, SettingsClockType } from '@/types/'
  import Standard from '../layouts/Standard.vue'
  import Cyber from '../layouts/Cyber.vue'
  import Disco from '../layouts/Disco.vue'
  import Pastel from '../layouts/Pastel.vue'

  const props = defineProps<{
    settings: SettingsClockType
    defaultMessage: string
    isMounted: boolean
    isFlipped: boolean
    currentMsg: string
  }>()

  const componentMap: Record<ClockComponent, Component> = {
    standard: Standard,
    cyber: Cyber,
    disco: Disco,
    pastel: Pastel,
  }
  const currentComponent = computed(() => componentMap[props.settings.component] ?? Standard)
</script>
