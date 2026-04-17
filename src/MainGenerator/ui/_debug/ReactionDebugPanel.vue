<!-- src/MainGenerator/ui/_debug/ReactionDebugPanel.vue -->
<template>
  <div class="fixed right-2 bottom-2 w-80 max-h-[60vh] overflow-auto bg-black/75 text-white text-xs p-2 rounded">
    <div class="font-bold mb-1">
      Reaction Debug
      <span class="opacity-60 ml-1">#{{ count }}</span>
    </div>

    <!-- テスト用ボタン -->
    <div class="flex gap-2 mb-2 flex-wrap">
      <button class="px-2 py-1 bg-gray-700 rounded" @click="pushTestReaction('heart')">heart</button>
      <button class="px-2 py-1 bg-gray-700 rounded" @click="pushTestReaction('smile')">smile</button>
      <button class="px-2 py-1 bg-gray-700 rounded" @click="pushTestReaction('celebrate')">celebrate</button>
      <button class="px-2 py-1 bg-gray-700 rounded" @click="pushTestReaction('surprise')">surprise</button>
      <button class="px-2 py-1 bg-gray-700 rounded" @click="pushTestReaction('praise')">praise</button>
    </div>

    <!-- バーストレベル -->
    <section class="mb-1">
      <h4 class="font-semibold">burst</h4>
      <div class="flex items-center gap-2 mb-1">
        <div class="flex gap-1">
          <span
            v-for="n in 3"
            :key="n"
            class="inline-block w-5 h-5 rounded"
            :class="burstState.level >= n ? levelColor(burstState.level) : 'bg-gray-700'"
          >
            <span class="flex items-center justify-center h-full font-bold">{{ n }}</span>
          </span>
        </div>
        <span class="opacity-70">Lv {{ burstState.level }}</span>
        <span v-if="timerActive" class="ml-auto text-yellow-300">
          decay in {{ (decayMsRemaining / 1000).toFixed(1) }}s
        </span>
        <span v-else class="ml-auto opacity-40">no timer</span>
      </div>
      <pre class="whitespace-pre-wrap m-0">{{
        {
          levelUpCount: burstState.levelUpCount,
          sustainCount: burstState.sustainCount,
          peakRate: burstState.peakRate.toFixed(2) + ' /s',
          reachedLevel: burstState.reachedLevel,
          droppedLevel: burstState.droppedLevel,
        }
      }}</pre>
    </section>

    <section class="mb-1">
      <h4 class="font-semibold">total</h4>
      <pre class="whitespace-pre-wrap m-0">{{ total }}</pre>
    </section>

    <section>
      <h4 class="font-semibold">history (raw, last {{ MAX }})</h4>
      <pre class="whitespace-pre-wrap m-0">{{ history }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import type { BurstState } from '@main/stores/ReactionManager/ReactionStatsManager'

  const appStore = useAppStore()
  const reactionStats = appStore.reactionStats

  const DECAY_MS = 10_000
  const MAX = 200

  const history = ref<any[]>([])
  const count = ref(0)
  const burstState = ref<BurstState>(reactionStats.getBurstState())
  const timerActive = ref(false)
  const decayMsRemaining = ref(0)

  const keys = ['heart', 'smile', 'celebrate', 'surprise', 'praise'] as const

  const total = computed(() => {
    const result: Record<string, number> = {}
    for (const k of keys) {
      result[k] = reactionStats.getTotal([k])
    }
    return result
  })

  function levelColor(level: number): string {
    if (level === 3) return 'bg-red-500'
    if (level === 2) return 'bg-orange-400'
    return 'bg-yellow-400'
  }

  // --- デバッグ用タイマー（EventReactionProcessor の代替） ---
  let decayTimer: ReturnType<typeof setTimeout> | null = null
  let decayScheduledAt = 0
  let pollTimer: ReturnType<typeof setInterval> | null = null

  function scheduleDecay(): void {
    if (decayTimer !== null) {
      clearTimeout(decayTimer)
      decayTimer = null
    }
    if (reactionStats.getBurstState().level === 0) {
      timerActive.value = false
      return
    }
    decayScheduledAt = Date.now()
    timerActive.value = true
    decayTimer = setTimeout(() => {
      const newLevel = reactionStats.decrementBurstLevel()
      burstState.value = reactionStats.getBurstState()
      if (newLevel > 0) {
        scheduleDecay()
      } else {
        timerActive.value = false
        decayTimer = null
      }
    }, DECAY_MS)
  }
  // ----------------------------------------------------------

  onMounted(() => {
    pollTimer = setInterval(() => {
      count.value++
      burstState.value = reactionStats.getBurstState()
      history.value = reactionStats.getHistory().slice(-MAX)
      decayMsRemaining.value = timerActive.value ? Math.max(0, DECAY_MS - (Date.now() - decayScheduledAt)) : 0
    }, 500)
  })

  onUnmounted(() => {
    if (pollTimer !== null) clearInterval(pollTimer)
    if (decayTimer !== null) clearTimeout(decayTimer)
  })

  function pushTestReaction(type: string) {
    const fake = { [type]: 1 }
    reactionStats.record(fake)
    burstState.value = reactionStats.getBurstState()
    scheduleDecay()
  }
</script>
