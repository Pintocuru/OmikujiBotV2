<!-- src/MainGenerator/ui/CookieCounter/parts/CookieCounterSelector.vue -->
<template>
  <div class="w-full transparent-bg" :data-theme="settings.color">
    <component
      :is="currentItem"
      :counters="counters"
      :counter-defs="settings.counters"
      :event-labels="eventLabels"
      :variable-labels="variableLabels"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import type { CookieCounterType, CookieComponent } from '@/types/'
  import Sakura from '../layouts/Sakura.vue'

  const props = defineProps<{
    settings: CookieCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
    variableLabels: Record<string, string>
  }>()

  const itemMap: Record<CookieComponent, Component> = {
    sakura: Sakura,
  }

  const currentItem = computed(() => itemMap[props.settings.component] ?? Sakura)
</script>
