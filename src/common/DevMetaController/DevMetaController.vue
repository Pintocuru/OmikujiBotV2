<!-- src/common/DevMetaController/DevMetaController.vue -->
<template>
  <div class="card bg-base-200 border border-error/40 shadow-xl">
    <div class="card-body gap-2 p-2">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-base-300" @click="collapsed = !collapsed">
        <h1 class="text-sm flex items-center gap-2">Meta Controller</h1>

        <div class="flex items-center gap-1">
          <span class="text-xs opacity-60">
            {{ collapsed ? '▶' : '▼' }}
          </span>
        </div>
      </div>

      <!-- Number fields -->
      <template v-if="!collapsed">
        <template v-for="key in numberKeys" :key="key">
          <div class="join">
            <label class="label pr-2">
              <span class="label-text text-xs opacity-60 uppercase flex items-center gap-1">
                {{ key }}
                <span v-if="isRunning" class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              </span>
            </label>
            <button class="btn btn-xs btn-outline join-item" @click="increment(key, -1)">-1</button>
            <input
              type="number"
              min="0"
              class="input input-bordered input-xs join-item flex-1 text-center"
              v-model.number="fields[key]"
            />
            <button class="btn btn-xs btn-outline join-item" @click="increment(key, 1)">+1</button>
          </div>
        </template>

        <!-- Apply -->
        <div class="join">
          <button
            class="btn btn-xs join-item flex-1"
            :class="isRunning ? 'btn-error' : 'btn-primary'"
            @click="toggleAuto"
          >
            {{ isRunning ? 'STOP' : 'AUTO' }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, onUnmounted } from 'vue'
  import { ServiceMetaStore, NormalizedMeta } from '@main/stores/MetaState/MetaStateService'

  const store = ServiceMetaStore.getInstance()
  const collapsed = ref(true)

  type NumericFields = Pick<NormalizedMeta, 'viewer' | 'upVote' | 'follower'>

  const VIEWER_BASE = 50
  const FOLLOWER_INIT = 3000

  const fields = reactive<NumericFields>({
    viewer: VIEWER_BASE,
    upVote: 0,
    follower: FOLLOWER_INIT,
  })

  const numberKeys = ['viewer', 'upVote', 'follower'] as const

  // --- Auto ---

  const isRunning = ref(false)
  const timers: Partial<Record<keyof NumericFields, ReturnType<typeof setTimeout>>> = {}

  /** 10〜20秒のランダムな ms を返す */
  function randMs() {
    return (10 + Math.random() * 10) * 1000
  }

  /**
   * viewer: ±1〜5 のランダムな変動（平均 VIEWER_BASE に引き戻すバイアス付き）
   * 偏差が大きいほど戻す方向に引っ張り、0 未満にはならない
   */
  function nextViewer(): number {
    const deviation = fields.viewer - VIEWER_BASE
    // 偏差に比例したバイアス（-0.3〜+0.3）
    const bias = -deviation * 0.15
    const delta = Math.round(bias + (Math.random() * 10 - 5))
    return Math.max(0, fields.viewer + delta)
  }

  function scheduleUpVote() {
    timers.upVote = setTimeout(() => {
      if (!isRunning.value) return
      fields.upVote += 1
      apply()
      scheduleUpVote()
    }, randMs())
  }

  function scheduleViewer() {
    // viewer は 3〜8 秒の短いサイクルで変動
    timers.viewer = setTimeout(
      () => {
        if (!isRunning.value) return
        fields.viewer = nextViewer()
        apply()
        scheduleViewer()
      },
      (3 + Math.random() * 5) * 1000
    )
  }

  function scheduleFollower() {
    timers.follower = setTimeout(() => {
      if (!isRunning.value) return
      fields.follower += 1
      apply()
      scheduleFollower()
    }, randMs())
  }

  function startAuto() {
    scheduleUpVote()
    scheduleViewer()
    scheduleFollower()
    apply()
  }

  function stopAuto() {
    for (const key of numberKeys) {
      const t = timers[key]
      if (t !== undefined) clearTimeout(t)
      delete timers[key]
    }
  }

  function toggleAuto() {
    isRunning.value = !isRunning.value
    if (isRunning.value) {
      startAuto()
    } else {
      stopAuto()
    }
  }

  // --- 手動操作 ---

  function increment(key: keyof NumericFields, delta: number) {
    fields[key] = Math.max(0, fields[key] + delta)
    apply()
  }

  function apply() {
    store._devSetMeta?.(fields)
  }

  onUnmounted(stopAuto)
</script>
