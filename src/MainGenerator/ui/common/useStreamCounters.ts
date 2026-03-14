// src/MainGenerator/ui/common/composables/useStreamCounters.ts
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@main/stores/useAppStore'
import type { ComputedRef } from 'vue'

/**
 * 共通ストリームカウンター取得コンポーザブル。
 *
 * StreamCounter / DeadAir など複数のコンポーネントで
 * 同じカウンター値・イベントラベルを利用するために共通化。
 *
 * @param eventKeys - 監視対象の CommentRule.key 一覧。
 *                    呼び出し元の設定から導出した ComputedRef を渡す。
 *                    StreamCounter: liverSettings.value.eventCounters
 *                    DeadAir      : settings.eventRules.map(r => r.counterKey)
 */
export function useStreamCounters(eventKeys: ComputedRef<string[]>) {
  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  // ---------------------------------------------------------------------------
  // カウンター state
  // ---------------------------------------------------------------------------

  const counters = ref<Record<string, number>>({
    upVote: 0,
    viewer: 0,
    follower: 0,
    syoken: 0,
    commenter: 0,
    lc: 0,
    totalPrice: 0,
  })

  // ---------------------------------------------------------------------------
  // eventLabels（CommentRule.key → name マッピング）
  // ---------------------------------------------------------------------------

  const eventLabels = computed<Record<string, string>>(() => {
    const comments = data.value.comments
    const result: Record<string, string> = {}
    for (const record of Object.values(comments)) {
      if (record.key) result[record.key] = record.name
    }
    return result
  })

  // ---------------------------------------------------------------------------
  // 取得関数
  // ---------------------------------------------------------------------------

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
    for (const ruleId of eventKeys.value) {
      if (!ruleId) continue
      const records = grouped[ruleId] ?? []
      counters.value[ruleId] = records.reduce((sum, r) => sum + (r.visitValue ?? 0), 0)
    }
  }

  // ---------------------------------------------------------------------------
  // リアクティブ更新（botMessages の変化をトリガーに統計を再取得）
  // ---------------------------------------------------------------------------

  const previewTick = computed(() => botMessages.value.length)

  watchEffect(() => {
    const _ = previewTick.value
    fetchStats()
    fetchEventCounters()
  })

  // ---------------------------------------------------------------------------
  // Meta（upVote / viewer / follower）の購読
  // ---------------------------------------------------------------------------

  let unsubscribeMeta: (() => void) | null = null

  onMounted(() => {
    const initial = appStore.serviceMetaStore.getCurrent()
    counters.value = {
      ...counters.value,
      upVote: initial?.upVote ?? 0,
      viewer: initial?.viewer ?? 0,
      follower: initial?.follower ?? 0,
    }

    unsubscribeMeta = appStore.serviceMetaStore.subscribe((event) => {
      counters.value = {
        ...counters.value,
        upVote: event.current.upVote,
        viewer: event.current.viewer,
        follower: event.current.follower,
      }
    })
  })

  onUnmounted(() => {
    unsubscribeMeta?.()
  })

  // ---------------------------------------------------------------------------
  // 公開
  // ---------------------------------------------------------------------------

  return {
    counters,
    eventLabels,
  }
}
