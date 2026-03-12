<!-- src/MainGenerator/ui/StreamCounter/StreamCounter.vue -->
<template>
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-center">
    <StreamCounterManager :settings="liverSettings" :counters="counters" :event-labels="eventLabels" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsStreamSchema } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'
  import StreamCounterManager from './parts/StreamCounterManager.vue'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  const liverSettings = computed(() => data.value.components.settings.streamCounter ?? SettingsStreamSchema.parse({}))

  const counters = ref<Record<string, number>>({
    upVote: 0,
    viewer: 0,
    syoken: 0,
    commenter: 0,
    lc: 0,
    totalPrice: 0,
  })

  // eventCounters の key → name マッピング
  // comments は Record<string, BaseRecordType> で、BaseRecordType.key が eventCounters の値と対応
  const eventLabels = computed<Record<string, string>>(() => {
    const comments = data.value.comments
    const result: Record<string, string> = {}
    for (const record of Object.values(comments)) {
      if (record.key) result[record.key] = record.name
    }
    return result
  })

  const fetchStats = () => {
    const { liveComments, syoken, totalPrice } = appStore.streamStats.getStats()
    counters.value = {
      ...counters.value,
      lc: liveComments,
      commenter: appStore.userSession.stats.getUniqueCount(),
      syoken,
      totalPrice,
    }
  }

  const fetchEventCounters = () => {
    const grouped = appStore.userSession.visits.getGroupedByRule() ?? {}
    const eventKeys = liverSettings.value?.eventCounters ?? []
    for (const ruleId of eventKeys) {
      const records = grouped[ruleId] ?? []
      counters.value[ruleId] = records.reduce((sum, r) => sum + (r.visitValue ?? 0), 0)
    }
  }

  const previewTick = computed(() => botMessages.value.length)

  watchEffect(() => {
    const _ = previewTick.value
    fetchStats()
    fetchEventCounters()
  })

  let unsubscribeMeta: (() => void) | null = null

  onMounted(() => {
    // getCurrent() で初期値を即時反映
    const initial = appStore.metaState.getCurrent()
    counters.value.upVote = initial?.upVote ?? 0
    counters.value.viewer = initial?.viewer ?? 0

    // 以降は subscribe でリアルタイム更新
    unsubscribeMeta = appStore.metaState.subscribe((event) => {
      counters.value.upVote = event.current.upVote
      counters.value.viewer = event.current.viewer
    })
  })

  onUnmounted(() => {
    unsubscribeMeta?.()
  })
</script>
