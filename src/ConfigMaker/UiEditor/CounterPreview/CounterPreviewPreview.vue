<!-- src/ConfigMaker/components/UiEditor/CounterPreview/CounterPreviewPreview.vue -->
<template>
  <!-- プレビュー -->
  <HudPreview :isAdminOnly="true">
    <div :class="[fontFamily]">
      <CounterPreviewSelector :counterSetting="counter" :count="0" :users="dummyUsers" />
    </div>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsCounterSchema, useFontFamily } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import CounterPreviewSelector from '@main/ui/CounterPreview/parts/CounterPreviewSelector.vue'
  import { generateDummyVisitRecords } from '@/common/MockUser/MockGenerators'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))

  const counter = computed(() => data.value.components.settings.counter ?? SettingsCounterSchema.parse({}))

  const dummyUsers = generateDummyVisitRecords(100)
</script>
