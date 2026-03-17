<!-- src/MainGenerator/ui/StreamCounter/StreamCounter.vue -->
<template>
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-center">
    <StreamCounterSelector :settings="liverSettings" :counters="counters" :event-labels="eventLabels" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsStreamSchema } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useStreamCounters } from '@main/ui/common/useStreamCounters'
  import StreamCounterSelector from './parts/StreamCounterSelector.vue'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const liverSettings = computed(() => data.value.components.settings.streamCounter ?? SettingsStreamSchema.parse({}))

  const eventKeys = computed(() => liverSettings.value?.eventCounters ?? [])

  const { counters, eventLabels } = useStreamCounters(eventKeys)
</script>
