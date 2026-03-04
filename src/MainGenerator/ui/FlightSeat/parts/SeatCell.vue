<!-- src/MainGenerator/ui/FlightSeat/parts/SeatCell.vue -->
<template>
  <div
    class="aspect-square border-2 rounded-lg flex items-center justify-center p-2 transition-all duration-300"
    :class="getSeatClass"
  >
    <!-- ユーザーが座っている場合 -->
    <div v-if="seat" class="flex flex-col items-center gap-1 w-full">
      <div class="avatar">
        <div class="w-8 h-8 rounded-full">
          <img v-if="seat.profileImage" :src="seat.profileImage" :alt="seat.userName" />
          <div
            v-else
            class="w-full h-full bg-primary flex items-center justify-center text-primary-content font-bold text-lg"
          >
            {{ seat.userName.charAt(0) }}
          </div>
        </div>
      </div>
      <div class="text-base text-center truncate w-full px-1">
        {{ seat.userName }}
      </div>
    </div>
    <!-- 空席の場合 -->
    <div v-else class="text-xl">
      {{ index + 1 }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserNameType } from '@shared/types'

  const props = defineProps<{
    seat: UserNameType | null
    index: number
  }>()

  const getSeatClass = computed(() => {
    if (props.seat) return `bg-success text-success-content border-success`
    if (props.index % 2 === 0) return `bg-info text-info-content `
    return `bg-warning text-warning-content`
  })
</script>
