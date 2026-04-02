<!-- src/ConfigMaker/UiEditor/StreamCounter/StreamCounterPreview.vue -->
<template>
  <HudPreview maxHeightClass="h-42">
    <div :class="[fontFamily]">
      <StreamCounterSelector
        :key="streamCounter.labelStyle"
        :settings="streamCounter"
        :counters="previewCounters"
        :event-labels="previewEventLabels"
        :variable-labels="variableLabels"
      />
    </div>

    <template #hud>
      <button class="btn btn-xs btn-ghost" @click="incrementAll">🎲 +1</button>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useFontFamily, type StreamCounterType } from '@/types/'
  import StreamCounterSelector from '@main/ui/StreamCounter/parts/StreamCounterSelector.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

  const props = defineProps<{
    streamCounter: StreamCounterType
    eventLabels: Record<string, string>
    variableLabels: Record<string, string>
  }>()

  const baseCounters: Record<string, number> = {
    upVote: 456,
    viewer: 123,
    syoken: 123,
    commenter: 456,
    lc: 7890,
    totalComments: 123456,
    totalPrice: 5000,
    follower: 78900,
  }

  const omikujiStore = useOmikujiStore()
  const fontFamily = computed(() => useFontFamily(omikujiStore.data.components.commonStyle.fontFamily ?? 'default'))

  const counters = ref<Record<string, number>>({ ...baseCounters })

  const previewCounters = computed<Record<string, number>>(() => {
    const result: Record<string, number> = { ...baseCounters }

    for (const key of Object.keys(baseCounters)) {
      result[key] = counters.value[key] ?? baseCounters[key]
    }

    for (const key of props.streamCounter.eventCounters) {
      result[key] = counters.value[key] ?? 7
    }

    return result
  })

  const previewEventLabels = computed(() => props.eventLabels)
  const variableLabels = computed(() => props.variableLabels)

  const incrementAll = () => {
    const keys = [...Object.keys(baseCounters), ...props.streamCounter.eventCounters]
    const updated: Record<string, number> = { ...counters.value }
    for (const key of keys) updated[key] = (updated[key] ?? 0) + 1
    counters.value = updated
  }
</script>
