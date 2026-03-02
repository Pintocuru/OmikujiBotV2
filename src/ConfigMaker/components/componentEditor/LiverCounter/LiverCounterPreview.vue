<!-- src/ConfigMaker/components/componentEditor/LiverCounter/LiverCounterPreview.vue -->
<template>
  <div class="max-h-56 overflow-y-hidden relative">
    <div :style="bgStyle">
      <LiverCounterManager :settings="liverCounter" :counters="previewCounters" :event-labels="previewEventLabels" />

      <!-- +1ボタン -->
      <button
        class="btn btn-xs btn-ghost absolute bottom-1 right-1 opacity-60 hover:opacity-100"
        @click="incrementRandom"
      >
        🎲 +1
      </button>

      <input type="range" min="0" max="100" v-model="lightness" class="range range-xs absolute bottom-1 left-1 w-24" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { SettingsLiverCounterType } from '@/types/'
  import LiverCounterManager from '@main/ui/LiverCounter/parts/LiverCounterManager.vue'

  const props = defineProps<{
    liverCounter: SettingsLiverCounterType
    eventLabels: Record<string, string>
  }>()

  // ---- プレビュー用カウンター ----
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

  // ---- ランダム +1 ----
  const incrementRandom = () => {
    const keys = [...Object.keys(baseCounters), ...props.liverCounter.eventCounters]
    if (keys.length === 0) return
    const key = keys[Math.floor(Math.random() * keys.length)]
    counters.value = { ...counters.value, [key]: (counters.value[key] ?? 0) + 1 }
  }

  //
  const lightness = ref(90) // 0〜100
  const bgStyle = computed(() => {
    return {
      backgroundColor: `hsl(200 80% ${lightness.value}%)`, // hue=200, saturation=80%
    }
  })
</script>
