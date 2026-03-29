<!-- src/MainGenerator/ui/SocialRoster/parts/SocialRosterSelector.vue -->
<template>
  <component
    :is="currentComponent"
    :users="users"
    :statKey="settings.statKey"
    :color="settings.color"
    :streamScore="streamScore"
  />
</template>

<script setup lang="ts">
  import { type Component, computed } from 'vue'
  import { SocialComponent, SocialRosterType, UserStatsRecord } from '@/types'
  import grid from '../layouts/Grid.vue'
  import streamPower from '../layouts/StreamPower.vue'

  const props = defineProps<{
    settings: SocialRosterType
    users: UserStatsRecord[]
    streamScore: number
  }>()

  const componentMap: Record<SocialComponent, Component> = {
    grid,
    streamPower,
  }

  const currentComponent = computed(() => componentMap[props.settings.component] ?? grid)
</script>
