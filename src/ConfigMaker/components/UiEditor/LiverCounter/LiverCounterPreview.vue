<!-- src/ConfigMaker/components/UiEditor/LiverCounter/LiverCounterPreview.vue -->
<template>
  <HudPreview>
    <LiverCounterManager :settings="liverCounter" :counters="previewCounters" :event-labels="previewEventLabels" />
    <button class="btn btn-xs btn-ghost absolute bottom-1 right-1 opacity-60 hover:opacity-100" @click="incrementAll">
      🎲 +1
    </button>
  </HudPreview>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { SettingsLiverCounterType } from '@/types/'
  import LiverCounterManager from '@main/ui/LiverCounter/parts/LiverCounterManager.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'

  const props = defineProps<{
    liverCounter: SettingsLiverCounterType
    eventLabels: Record<string, string>
  }>()

  const baseCounters: Record<string, number> = {
    upVote: 456,
    viewer: 123,
    syoken: 123,
    commenter: 456,
    lc: 7890,
    totalPrice: 5000,
  }

  const counters = ref<Record<string, number>>({ ...baseCounters })

  const previewCounters = computed<Record<string, number>>(() => {
    const result: Record<string, number> = { ...baseCounters }

    for (const key of Object.keys(baseCounters)) {
      result[key] = counters.value[key] ?? baseCounters[key]
    }

    for (const key of props.liverCounter.eventCounters) {
      result[key] = counters.value[key] ?? 7
    }

    return result
  })

  const previewEventLabels = computed(() => props.eventLabels)

  const incrementAll = () => {
    const keys = [...Object.keys(baseCounters), ...props.liverCounter.eventCounters]
    const updated: Record<string, number> = { ...counters.value }
    for (const key of keys) updated[key] = (updated[key] ?? 0) + 1
    counters.value = updated
  }
</script>
