<!-- src/MainGenerator/ui/FlightSeat/SeatCell.vue -->
<template>
  <div
    class="aspect-square border-2 rounded-lg flex items-center justify-center p-2 transition-all duration-300"
    :class="getSeatClass"
  >
    <!-- ユーザーが座っている場合 -->
    <div v-if="seat" class="flex flex-col items-center gap-1 w-full">
      <div class="avatar">
        <div class="w-10 h-10 rounded-full">
          <img v-if="seat.profileImage" :src="seat.profileImage" :alt="seat.userName" />
          <div
            v-else
            class="w-full h-full bg-primary flex items-center justify-center text-primary-content font-bold text-lg"
          >
            {{ seat.userName.charAt(0) }}
          </div>
        </div>
      </div>
      <div class="text-xs text-center truncate w-full px-1">
        {{ seat.userName }}
      </div>
    </div>
    <!-- 空席の場合 -->
    <div v-else class="text-sm">
      {{ index + 1 }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserVisitRecord } from '@/types/MainGenerator/UserVisits'

  const props = defineProps<{
    seat: UserVisitRecord | null
    index: number
  }>()

  const getSeatClass = computed(() => {
    if (props.seat) return `bg-success/50 border-success`
    if (props.index % 2 === 0) return `bg-info/50`
    return `bg-warning/50`
  })
</script>
