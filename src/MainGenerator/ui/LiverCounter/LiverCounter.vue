<template>
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-center">
    <LiverCounterManager :settings="rankingSettings" :counters="counters" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsLiverCounterSchema } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'
  import LiverCounterManager from './parts/LiverCounterManager.vue'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  // 設定を取得
  const rankingSettings = computed(
    () => data.value.components.settings.liverCounter ?? SettingsLiverCounterSchema.parse({})
  )

  const counters = ref<Record<string, number>>({
    upVote: 0,
    viewer: 0,
    syoken: 0,
    commenter: 0,
    lc: 0,
    totalPrice: 0,
  })

  let timer: number | null = null

  const fetchMeta = async () => {
    const meta = appStore.metaState.getCurrent()
    counters.value.upVote = meta?.upVote ?? 0
    counters.value.viewer = meta?.viewer ?? 0
  }

  const fetchStats = async () => {
    counters.value.lc = appStore.userSession.stats.getLiveComments()
    counters.value.commenter = appStore.userSession.stats.getUniqueCount()
    counters.value.syoken = appStore.userSession.stats.getSyoken()
    counters.value.totalPrice = appStore.userSession.stats.getTotalPrice()
  }

  const previewTick = computed(() => botMessages.value.length)

  watchEffect(() => {
    const _ = previewTick.value
    fetchStats()
  })

  onMounted(() => {
    fetchMeta()
    timer = window.setInterval(() => {
      fetchMeta()
    }, 5000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })
</script>
