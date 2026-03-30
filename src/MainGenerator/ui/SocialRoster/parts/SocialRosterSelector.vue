<!-- src/MainGenerator/ui/SocialRoster/parts/SocialRosterSelector.vue -->
<template>
  <div class="bg-base-100 transparent-bg overflow-hidden" :data-theme="settings.color.daisyUiTheme">
    <component
      :is="currentComponent"
      :users="users"
      :sortKey="settings.sortKey"
      :color="settings.color"
      :streamScore="streamScore"
      :size="size"
    />
  </div>
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

  const size = 80

  const componentMap: Record<SocialComponent, Component> = {
    grid,
    streamPower,
  }

  const currentComponent = computed(() => componentMap[props.settings.component] ?? grid)
</script>
