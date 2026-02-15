<!-- src/MainGenerator/MetaDebugPanel.vue -->
<template>
  <div class="fixed right-2 bottom-2 w-80 max-h-[60vh] overflow-auto bg-black/75 text-white text-xs p-2 rounded">
    <div class="font-bold mb-1">
      Meta Debug
      <span class="opacity-60 ml-1">#{{ count }}</span>
    </div>

    <!-- テスト用ボタン -->
    <div class="flex gap-2 mb-2">
      <button class="px-2 py-1 bg-gray-700 rounded" @click="inc('upVote')">upVote +</button>
      <button class="px-2 py-1 bg-gray-700 rounded" @click="dec('upVote')">upVote -</button>
      <button class="px-2 py-1 bg-gray-700 rounded" @click="inc('viewer')">viewer +</button>
      <button class="px-2 py-1 bg-gray-700 rounded" @click="dec('viewer')">viewer -</button>
    </div>

    <div v-if="latest" class="space-y-2">
      <section>
        <h4 class="font-semibold">current</h4>
        <pre class="whitespace-pre-wrap m-0">{{ latest.current }}</pre>
      </section>

      <section>
        <h4 class="font-semibold">previous</h4>
        <pre class="whitespace-pre-wrap m-0">{{ latest.previous }}</pre>
      </section>

      <section>
        <h4 class="font-semibold">peak</h4>
        <pre class="whitespace-pre-wrap m-0">{{ latest.peak }}</pre>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import type { MetaUpdateEvent, NormalizedMeta } from '@main/stores/MetaState/MetaStateService'
  import { useAppStore } from '@main/stores/useAppStore'

  const { metaState } = useAppStore()

  const MAX = 20
  const history = ref<MetaUpdateEvent[]>([])
  const count = ref(0)

  const latest = computed(() => (history.value.length ? history.value[history.value.length - 1] : null))

  onMounted(() => {
    metaState.subscribe((event) => {
      count.value++
      history.value.push(event)
      if (history.value.length > MAX) history.value.shift()
    })
  })

  /* -------------------------
   テスト用 fake meta event
-------------------------- */
  function pushTestMeta(patch: Partial<NormalizedMeta>) {
    const current = metaState.getCurrent() ?? {
      upVote: 0,
      viewer: 0,
      follower: 0,
      startTime: null,
    }

    const next: NormalizedMeta = {
      ...current,
      ...patch,
    }

    // ★ peak を更新する（private だがテストなので許容）
    ;(metaState as any).updatePeak(next)

    const event: MetaUpdateEvent = {
      current: next,
      previous: current,
      peak: metaState.getPeak(),
      peakChanged: { upVote: false, viewer: false },
    }

    ;(metaState as any).subscribers.forEach((fn: any) => fn(event))
    ;(metaState as any).current = next
  }

  /* -------------------------
   ボタン操作
-------------------------- */
  function inc(key: 'upVote' | 'viewer') {
    const cur = metaState.getCurrent()
    const value = (cur?.[key] ?? 0) + 1
    pushTestMeta({ [key]: value })
  }

  function dec(key: 'upVote' | 'viewer') {
    const cur = metaState.getCurrent()
    const value = Math.max(0, (cur?.[key] ?? 0) - 1)
    pushTestMeta({ [key]: value })
  }
</script>
