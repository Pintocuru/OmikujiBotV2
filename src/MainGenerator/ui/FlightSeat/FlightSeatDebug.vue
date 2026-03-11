<!-- src/MainGenerator/ui/FlightSeat/FlightSeatDebug.vue -->
<template>
  <div class="stats shadow w-full">
    <div class="stat">
      <div class="stat-title">現在の乗車人数</div>
      <div class="stat-value text-primary">{{ occupiedSeats }}</div>
      <div class="stat-desc">/ {{ totalSeats }}席</div>
    </div>
  </div>

  <details class="mt-4">
    <summary class="cursor-pointer text-sm text-base-content/70">デバッグログ ({{ debugLog.length }}件)</summary>
    <div class="mt-2 p-4 bg-base-200 rounded-lg max-h-60 overflow-y-auto">
      <div v-for="(log, index) in debugLog.slice().reverse()" :key="index" class="text-xs font-mono mb-1">
        {{ log }}
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
  defineProps<{
    occupiedSeats: number
    totalSeats: number
    debugLog: string[]
  }>()
</script>
