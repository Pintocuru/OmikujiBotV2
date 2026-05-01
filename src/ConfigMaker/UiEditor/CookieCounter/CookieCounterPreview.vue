<!-- src/ConfigMaker/UiEditor/CookieCounter/CookieCounterPreview.vue -->
<template>
  <HudPreview :defaultScale="0.8">
    <div :class="[fontFamily]">
      <CookieCounterSelector
        :key="cookieCounter.component"
        :settings="cookieCounter"
        :counters="previewCounters"
        :event-labels="eventLabels"
        :variableLabels="variableLabels"
      />
    </div>

    <template #hud>
      <div class="flex items-center gap-2">
        <button class="btn btn-xs btn-ghost" @click="incrementAll">🎲 全て +1</button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useFontFamily } from '@/types'
  import type { CookieCounterType } from '@/types'
  import CookieCounterSelector from '@main/ui/CookieCounter/parts/CookieCounterSelector.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { usePreviewCounters } from '../StreamCounter/usePreviewCounters'

  const props = defineProps<{
    cookieCounter: CookieCounterType
    eventLabels: Record<string, string>
    variableLabels: Record<string, string>
  }>()

  const { previewCounters, incrementAll } = usePreviewCounters({
    getExtraKeys: () => props.cookieCounter.counters.map((c) => c.target),
  })

  const omikujiStore = useOmikujiStore()
  const fontFamily = computed(() => useFontFamily(omikujiStore.data.components.commonStyle.fontFamily ?? 'default'))
</script>
