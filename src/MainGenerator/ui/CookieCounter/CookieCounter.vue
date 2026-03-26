<!-- src/MainGenerator/ui/CookieCounter/CookieCounter.vue -->
<template>
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-center">
    <CookieCounterSelector :settings="liverSettings" :counters="counters" :event-labels="eventLabels" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CookieCounterSchema } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useStreamCounters } from '@main/ui/common/useStreamCounters'
  import CookieCounterSelector from './parts/CookieCounterSelector.vue'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const cookieSettings = computed(() => data.value.components.settings.cookieCounter ?? CookieCounterSchema.parse({}))

  const eventKeys = computed(() => cookieSettings.value?.eventCounters ?? [])

  const { counters, eventLabels } = useCookieCounters(eventKeys)
</script>
