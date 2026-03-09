<!-- src/MainGenerator/ui/SocialRoster/parts/SocialRosterSelector.vue -->
<template>
  <component :is="gridComponent" :users="users" :cellSize="cellSize" :statKey="statKey" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { SocialComponent, StatKeyNum, UserStatsRecord } from '@/types'
  import SocialRosterGrid from './SocialRosterGrid.vue'

  const props = defineProps<{
    users: UserStatsRecord[]
    component: SocialComponent
    cellSize: string
    statKey: StatKeyNum | null
  }>()

  const gridComponent = computed(() => {
    switch (props.component) {
      case 'grid':
      default:
        return SocialRosterGrid
    }
  })
</script>
