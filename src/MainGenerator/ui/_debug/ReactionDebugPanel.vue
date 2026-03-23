<template>
  <div class="fixed right-2 bottom-2 w-80 max-h-[60vh] overflow-auto bg-black/75 text-white text-xs p-2 rounded">
    <div class="font-bold mb-1">
      Reaction Debug
      <span class="opacity-60 ml-1">#{{ count }}</span>
    </div>

    <!-- テスト用ボタン -->
    <div class="flex gap-2 mb-2">
      <button class="px-2 py-1 bg-gray-700 rounded" @click="pushTestReaction('heart')">heart</button>
      <button class="px-2 py-1 bg-gray-700 rounded" @click="pushTestReaction('smile')">smile</button>
      <button class="px-2 py-1 bg-gray-700 rounded" @click="pushTestReaction('celebrate')">celebrate</button>
      <button class="px-2 py-1 bg-gray-700 rounded" @click="pushTestReaction('surprise')">surprise</button>
      <button class="px-2 py-1 bg-gray-700 rounded" @click="pushTestReaction('praise')">praise</button>
    </div>

    <section>
      <h4 class="font-semibold">last 30s count</h4>
      <pre class="whitespace-pre-wrap m-0">{{ last30s }}</pre>
    </section>

    <section>
      <h4 class="font-semibold">total</h4>
      <pre class="whitespace-pre-wrap m-0">{{ total }}</pre>
    </section>

    <section>
      <h4 class="font-semibold">history (raw)</h4>
      <pre class="whitespace-pre-wrap m-0">{{ history }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useAppStore } from '@main/stores/useAppStore'

  const appStore = useAppStore()
  const reactionStats = appStore.reactionStats

  const MAX = 200
  const history = ref<any[]>([])
  const count = ref(0)

  const last30s = computed(() => ({
    heart: reactionStats.countInLast30Seconds('heart'),
    smile: reactionStats.countInLast30Seconds('smile'),
    celebrate: reactionStats.countInLast30Seconds('celebrate'),
    surprise: reactionStats.countInLast30Seconds('surprise'),
    praise: reactionStats.countInLast30Seconds('praise'),
  }))

  const keys = ['heart', 'smile', 'celebrate', 'surprise', 'praise'] as const

  const total = computed(() => {
    const result: Record<string, number> = {}
    for (const k of keys) {
      result[k] = reactionStats.getTotal([k])
    }
    return result
  })

  onMounted(() => {
    setInterval(() => {
      count.value++
      history.value = reactionStats.getHistory().slice(-MAX)
    }, 500)
  })

  /* -------------------------
   テスト用 fake reaction
-------------------------- */
  function pushTestReaction(type: string) {
    // ReactionMap 形式で渡す
    const fake = { [type]: 1 }
    reactionStats.record(fake)
  }
</script>
