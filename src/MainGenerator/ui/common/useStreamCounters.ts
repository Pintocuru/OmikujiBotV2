// src/MainGenerator/ui/common/useStreamCounters.ts
import { reactive, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@main/stores/useAppStore'
import type { Ref } from 'vue'

/**
 * カウンター取得コンポーザブル
 */
export function useStreamCounters(eventKeys: Ref<string[]>, variableLabelMap: Ref<Record<string, string>>) {
  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  // カウンター state
  const counters = reactive<Record<string, number>>({
    upVote: 0,
    viewer: 0,
    follower: 0,
    syoken: 0,
    commenter: 0,
    lc: 0,
    totalPrice: 0,
    reaction: 0,
  })

  // eventLabels（CommentRule.key → name マッピング）
  const eventLabels = computed<Record<string, string>>(() => {
    const comments = data.value.comments
    const result: Record<string, string> = {}
    for (const record of Object.values(comments)) {
      if (record.key) result[record.key] = record.name
    }
    return result
  })

  // variableLabels（variableLabelMap をそのまま公開）
  const variableLabels = computed<Record<string, string>>(() => variableLabelMap.value)

  // 取得関数
  const fetchStats = () => {
    const { liveComments, syoken, totalPrice } = appStore.streamStats.getStats()
    const reaction = appStore.reactionStats.getGrandTotal()
    Object.assign(counters, {
      lc: liveComments,
      commenter: appStore.userSession.stats.getUniqueCount(),
      syoken,
      totalPrice,
      reaction,
    })
  }

  // コメントイベントのkeyから値を取得
  const fetchEventCounters = () => {
    for (const eventKey of eventKeys.value) {
      if (!eventKey) continue
      const records = appStore.userSession.visits.getByEvent(eventKey)
      counters[eventKey] = records.reduce((sum, r) => sum + (r.visitValue ?? 0), 0)
    }
  }

  // 変数プレースホルダーから値を取得
  const updateVariableCounters = () => {
    const evaluator = appStore.placeholderVariable.getEvaluator()
    for (const key of Object.keys(variableLabelMap.value)) {
      const v = evaluator.get(key)
      counters[key] = typeof v === 'number' ? v : 0
    }
  }

  // リアクティブ更新（botMessages の変化をトリガーに統計を再取得）
  const previewTick = computed(() => botMessages.value.length)

  watchEffect(() => {
    const _ = previewTick.value
    fetchStats()
    fetchEventCounters()
    updateVariableCounters()
  })

  // Meta（upVote / viewer / follower）の購読
  let unsubscribeMeta: (() => void) | null = null

  onMounted(() => {
    const initial = appStore.serviceMetaStore.getCurrent()
    Object.assign(counters, {
      upVote: initial?.upVote ?? 0,
      viewer: initial?.viewer ?? 0,
      follower: initial?.follower ?? 0,
    })

    unsubscribeMeta = appStore.serviceMetaStore.subscribe((event) => {
      Object.assign(counters, {
        upVote: event.current.upVote,
        viewer: event.current.viewer,
        follower: event.current.follower,
      })
    })
  })

  onUnmounted(() => {
    unsubscribeMeta?.()
  })

  return {
    counters,
    eventLabels,
    variableLabels,
  }
}
