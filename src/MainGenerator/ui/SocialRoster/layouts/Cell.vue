<!-- src/MainGenerator/ui/SocialRoster/layouts/Cell.vue -->
<template>
  <div class="relative flex items-center justify-center seat-pop">
    <div class="avatar">
      <div
        class="rounded-full overflow-hidden"
        :class="[seat.isSyoken ? 'ring-6 ring-warning' : '', seat.team ? `border-6 border-${seat.team}` : '']"
        :style="{ width: cellSize + 'px', height: cellSize + 'px' }"
      >
        <img v-if="seat.profileImage" :src="seat.profileImage" :alt="seat.userName" />
        <img v-else :src="getAvatarUrl(seat.userName)" :alt="seat.userName" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- stat表示 -->
    <div
      v-if="shouldShowStat"
      class="absolute bottom-0 right-0 text-white font-bold max-w-20"
      :class="statClassMap[sortKey]"
    >
      <!-- isSyoken -->
      <template v-if="sortKey === 'isSyoken' && seat.isSyoken">
        <span class="badge badge-warning badge-sm">初見</span>
      </template>

      <!-- userName -->
      <template v-else-if="sortKey === 'userName'">
        <div class="leading-tight break-all line-clamp-2 text-sm seat-text-stroke">
          {{ seat.userName }}
        </div>
      </template>

      <!-- その他 -->
      <template v-else>
        <div class="seat-text-stroke">
          {{ seat[sortKey] }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, SocialSortKey } from '@/types'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'

  const props = defineProps<{
    seat: UserStatsRecord
    index: number
    sortKey: SocialSortKey
    size?: number
  }>()

  const cellSize = computed(() => props.size ?? 80)

  const shouldShowStat = computed(() => {
    if (!props.sortKey) return false
    if (props.sortKey === 'lastVisit') return false
    if (!statClassMap[props.sortKey]) return false

    // isSyokenは true のときだけ表示
    if (props.sortKey === 'isSyoken') {
      return props.seat.isSyoken
    }

    return !!props.seat[props.sortKey]
  })

  const statClassMap: Record<SocialSortKey, string> = {
    lastVisit: 'text-xs',
    userName: 'text-xs',
    tc: 'text-2xl',
    no: 'text-2xl',
    giftPrice: 'text-2xl',
    isSyoken: 'text-md',
  }
</script>

<style scoped>
  .seat-text-stroke {
    color: white;
    text-shadow:
      -1px -1px 0 #000,
      1px -1px 0 #000,
      -1px 1px 0 #000,
      1px 1px 0 #000;
  }

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
