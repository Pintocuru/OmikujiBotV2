<template>
  <div class="fixed right-2 bottom-2 w-80 max-h-[60vh] overflow-auto bg-black/75 text-white text-xs p-2 rounded">
    <div class="font-bold mb-1">
      Meta Debug
      <span class="opacity-60 ml-1">#{{ count }}</span>
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
  import type { MetaUpdateEvent } from '@main/scripts/MetaState/MetaStateService'
  import { useAppStore } from '@main/stores/useAppStore'

  const store = useAppStore()
  const metaState = store.metaState

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
</script>
