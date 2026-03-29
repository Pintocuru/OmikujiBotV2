<!-- src/MainGenerator/ui/SocialRoster/parts/SocialRosterGrid.vue -->
<template>
  <div class="grid w-full" :style="{ gridTemplateColumns: `repeat(auto-fill, 64px)` }">
    <SeatCell v-for="user in users" :key="user.userId" :seat="user" :index="0" :statKey="statKey" />
  </div>
</template>

<script setup lang="ts">
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatCell from '@main/ui/FlightSeat/layouts/SeatCell.vue'

  defineProps<{
    users: UserStatsRecord[]
    statKey: StatKeyNum | null
  }>()
</script>
