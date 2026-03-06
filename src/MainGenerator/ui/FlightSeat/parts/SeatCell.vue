<!-- src/MainGenerator/ui/FlightSeat/parts/SeatCell.vue -->
<template>
  <!-- ユーザーが座っている場合 -->
  <div v-if="seat" class="relative flex items-center justify-center seat-pop">
    <div class="avatar">
      <div
        class="rounded-full overflow-hidden"
        :class="[
          seat.isSyoken ? 'ring-3 ring-warning ring-offset-6 ring-offset-base-100' : '',
          seat.team ? `border-3 border-${seat.team}` : '',
        ]"
        :style="{ width: cellSize + 'px', height: cellSize + 'px' }"
      >
        <img v-if="seat.profileImage" :src="seat.profileImage" :alt="seat.userName" />
        <div
          v-else
          class="w-full h-full bg-primary flex items-center justify-center text-primary-content font-bold text-2xl"
        >
          {{ seat.userName.charAt(0) }}
        </div>
      </div>
    </div>

    <!-- tc (個人コメント数) -->
    <div
      v-if="statKey && statClassMap[statKey] && seat[statKey]"
      class="absolute bottom-0 right-0 text-white font-bold seat-text-stroke"
      :class="statClassMap[statKey]"
    >
      {{ seat[statKey] }}
    </div>
  </div>
  <div v-else class="rounded-lg flex items-center justify-center transition-all duration-300" :class="getSeatClass">
    <!-- 空席の場合（サイズは固定） -->
    <div
      class="relative flex items-center justify-center text-3xl font-bold"
      :style="{ width: cellSize + 'px', height: cellSize + 'px' }"
    >
      {{ index + 1 }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'

  const props = defineProps<{
    seat: UserStatsRecord | null
    index: number
    statKey: StatKeyNum | null
    size?: number
  }>()

  const cellSize = computed(() => props.size ?? 80)

  const getSeatClass = computed(() => {
    if (props.seat) return `bg-success text-success-content border-success`
    if (props.index % 2 === 0) return `bg-info text-info-content `
    return `bg-warning text-warning-content`
  })

  const statClassMap: Record<StatKeyNum, string> = {
    userName: 'text-xs',
    tc: 'text-xl',
    giftPrice: 'text-xl',
  }
</script>

<style scoped>
  .seat-text-stroke {
    color: white;
    /* 黒い縁取り */
    text-shadow:
      -1px -1px 0 #000,
      1px -1px 0 #000,
      -1px 1px 0 #000,
      1px 1px 0 #000;
  }

  /* ボヨン */
  @keyframes seat-pop {
    0% {
      transform: scale(0.5);
    }
    40% {
      transform: scale(1.3);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }

  .seat-pop {
    animation: seat-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
</style>
