<!-- src/MainGenerator/ui/SocialRoster/parts/SocialRosterSelector.vue -->
<template>
  <div class="flex flex-col w-full">
    <div class="bg-base-100 transparent-bg overflow-hidden" :data-theme="settings.color.daisyUiTheme">
      <component
        :is="currentComponent"
        :users="users"
        :sortKey="settings.sortKey"
        :color="settings.color"
        :counts="counts"
        :size="size"
        :maxRows="settings.layoutLimit.maxRows"
        :maxColumns="settings.layoutLimit.maxColumns"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type Component, computed } from 'vue'
  import { SocialComponent, SocialRosterCounts, SocialRosterType, UserStatsRecord } from '@/types'
  import grid from '../layouts/Grid.vue'
  import streamPower from '../layouts/StreamPower.vue'

  const props = defineProps<{
    settings: SocialRosterType
    users: UserStatsRecord[]
    counts: SocialRosterCounts
  }>()

  const size = 80

  const componentMap: Record<SocialComponent, Component> = {
    grid,
    streamPower,
  }

  const currentComponent = computed(() => componentMap[props.settings.component] ?? grid)
</script>
