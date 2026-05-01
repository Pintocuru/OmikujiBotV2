<!-- src/MainGenerator/ui/CookieCounter/parts/CookieCounterSelector.vue -->
<template>
  <div class="w-full bg-base-100 transparent-bg" :data-theme="settings.color.daisyUiTheme">
    <component
      :is="currentItem"
      :counters="counters"
      :counter-defs="settings.counters"
      :event-labels="eventLabels"
      :variable-labels="variableLabels"
      :color="settings.color"
      :images="settings.images"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import type { CookieCounterType, CookieComponent } from '@/types'
  import Sakura from '../layouts/Sakura.vue'
  import Block3d from '../layouts/Block3d.vue'

  const props = defineProps<{
    settings: CookieCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
    variableLabels: Record<string, string>
  }>()

  const itemMap: Record<CookieComponent, Component> = {
    sakura: Sakura,
    block3d: Block3d,
  }

  const currentItem = computed(() => itemMap[props.settings.component] ?? Sakura)
</script>
