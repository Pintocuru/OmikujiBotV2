<!-- src/MainGenerator/ui/SocialRoster/parts/SocialRosterGrid.vue -->
<template>
  <div class="grid w-full" :style="{ gridTemplateColumns: `repeat(auto-fill, ${size}px)` }">
    <Cell
      v-for="user in users"
      :key="`${user.userId}-${user.timestamp}`"
      :size="size"
      :seat="user"
      :index="0"
      :sortKey="sortKey"
    />
  </div>
</template>

<script setup lang="ts">
  import { UserStatsRecord, SocialSortKey } from '@/types'
  import Cell from './Cell.vue'

  defineProps<{
    size: number
    users: UserStatsRecord[]
    sortKey: SocialSortKey
  }>()
</script>
