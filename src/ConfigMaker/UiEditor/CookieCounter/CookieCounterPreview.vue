<template>
  <HudPreview>
    <div :class="[fontFamily]">
      <CookieCounterSelector
        :key="cookieCounter.component"
        :settings="cookieCounter"
        :counters="previewCounters"
        :event-labels="eventLabels"
        :variableLabels="variableLabels"
      />
    </div>

    <template #hud>
      <div class="flex items-center gap-2">
        <button class="btn btn-xs btn-ghost" @click="incrementAll">🎲 全て +1</button>
        <button class="btn btn-xs btn-outline" @click="resetCounters">リセット</button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useFontFamily } from '@/types/'
  import type { CookieCounterType } from '@/types/'
  import CookieCounterSelector from '@main/ui/CookieCounter/parts/CookieCounterSelector.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'

  const props = defineProps<{
    cookieCounter: CookieCounterType
    eventLabels: Record<string, string>
    variableLabels: Record<string, string>
  }>()

  // 標準項目のダミーデータ
  const baseCounters: Record<string, number> = {
    upVote: 456,
    viewer: 123,
    syoken: 12,
    commenter: 89,
    lc: 7890,
    totalPrice: 5000,
    follower: 1200,
  }

  const omikujiStore = useOmikujiStore()
  const fontFamily = computed(() => useFontFamily(omikujiStore.data.components.commonStyle.fontFamily ?? 'default'))

  // 現在のカウント状態（target をキーにする）
  const counters = ref<Record<string, number>>({})

  /**
   * プレビュー用カウンタデータの生成
   * settings.counters 内の各項目の target に対して数値を割り当てる
   */
  const previewCounters = computed<Record<string, number>>(() => {
    const result: Record<string, number> = { ...baseCounters }

    // 設定されている counters を走査
    for (const counter of props.cookieCounter.counters) {
      const target = counter.target
      // すでに increment 操作などで値がある場合はそれを使用、なければ初期値(7)
      if (counters.value[target] !== undefined) {
        result[target] = counters.value[target]
      } else if (baseCounters[target] !== undefined) {
        result[target] = baseCounters[target]
      } else {
        result[target] = 7 // カスタムイベントや変数のデフォルト値
      }
    }

    return result
  })

  /**
   * 全てのカウンタをインクリメント
   */
  const incrementAll = () => {
    const updated = { ...counters.value }

    // baseCounters にあるもの
    for (const key of Object.keys(baseCounters)) {
      updated[key] = (updated[key] ?? baseCounters[key]) + 1
    }

    // 設定されている counters にあるもの
    for (const counter of props.cookieCounter.counters) {
      const target = counter.target
      if (updated[target] === undefined) {
        updated[target] = 8 // 初期値 7 + 1
      } else {
        updated[target] += 1
      }
    }

    counters.value = updated
  }

  const resetCounters = () => {
    counters.value = {}
  }
</script>
