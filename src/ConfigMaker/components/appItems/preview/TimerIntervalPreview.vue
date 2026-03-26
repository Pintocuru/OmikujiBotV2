<!-- src/ConfigMaker/components/appItems/preview/TimerIntervalPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-[180px] max-w-[240px]">
    <!-- ヘッダー -->
    <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70 pb-0.5 border-b border-base-300">
      <Clock class="w-3 h-3" />
      <span>タイマー設定</span>
    </div>

    <!-- モード -->
    <div class="flex items-center gap-1.5 text-xs">
      <Play class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">モード:</span>
      <span class="badge badge-xs" :class="data?.mode === 'onStart' ? 'badge-accent' : 'badge-primary'">
        {{ data?.mode === 'onStart' ? '起動時' : '間隔' }}
      </span>
    </div>

    <!-- 間隔 -->
    <div v-if="data?.mode !== 'onStart'" class="flex items-center gap-1.5 text-xs">
      <Timer class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">間隔:</span>
      <span class="font-mono">{{ formatInterval(data?.intervalSeconds) }}</span>
      <span v-if="data?.isBaseZero" class="badge badge-xs badge-ghost">0時基準</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Clock, Play, Timer } from 'lucide-vue-next'
  import type { TimerEventType } from '@/types/OmikujiData/EventSchema'

  defineProps<{
    data: Partial<TimerEventType> | null
  }>()

  function formatInterval(seconds?: number) {
    if (!seconds) return '—'
    if (seconds < 60) return `${seconds}秒`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分`
    return `${Math.floor(seconds / 3600)}時間`
  }
</script>
