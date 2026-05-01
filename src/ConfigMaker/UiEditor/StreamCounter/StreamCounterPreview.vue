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
  import { computed } from 'vue'
  import { useFontFamily, type StreamCounterType } from '@/types'
  import StreamCounterSelector from '@main/ui/StreamCounter/parts/StreamCounterSelector.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { usePreviewCounters } from './usePreviewCounters'

  const props = defineProps<{
    streamCounter: StreamCounterType
    eventLabels: Record<string, string>
    variableLabels: Record<string, string>
  }>()

  const { previewCounters, incrementAll } = usePreviewCounters({
    getExtraKeys: () => props.streamCounter.eventCounters,
  })

  const omikujiStore = useOmikujiStore()
  const fontFamily = computed(() => useFontFamily(omikujiStore.data.components.commonStyle.fontFamily ?? 'default'))

  const previewEventLabels = computed(() => props.eventLabels)
  const variableLabels = computed(() => props.variableLabels)
</script>
