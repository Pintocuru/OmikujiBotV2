// src/ConfigMaker/UiEditor/StreamCounter/usePreviewCounters.ts
import { ref, computed } from 'vue'

export const baseCounters: Record<string, number> = {
  upVote: 456,
  viewer: 123,
  syoken: 123,
  commenter: 456,
  lc: 7890,
  totalComments: 123456,
  totalPrice: 5000,
  follower: 78900,
}

type Options = {
  getExtraKeys: () => string[] // 差分を吸収
  defaultValue?: number // 7
}

export const usePreviewCounters = (options: Options) => {
  const { getExtraKeys, defaultValue = 7 } = options

  const counters = ref<Record<string, number>>({})

  /**
   * プレビュー用カウンタデータの生成
   * settings.counters 内の各項目の target に対して数値を割り当てる
   */
  const previewCounters = computed<Record<string, number>>(() => {
    const result: Record<string, number> = { ...baseCounters }

    // base
    for (const key of Object.keys(baseCounters)) {
      result[key] = counters.value[key] ?? baseCounters[key]
    }

    // extra
    for (const key of getExtraKeys()) {
      if (counters.value[key] !== undefined) {
        result[key] = counters.value[key]
      } else if (baseCounters[key] !== undefined) {
        result[key] = baseCounters[key]
      } else {
        result[key] = defaultValue
      }
    }

    return result
  })

  /**
   * 全てのカウンタをインクリメント
   */
  const incrementAll = () => {
    const updated = { ...counters.value }

    const keys = Array.from(new Set([...Object.keys(baseCounters), ...getExtraKeys()]))

    for (const key of keys) {
      if (updated[key] === undefined) {
        updated[key] = (baseCounters[key] ?? defaultValue) + 1
      } else {
        updated[key] += 1
      }
    }

    counters.value = updated
  }

  const resetCounters = () => {
    counters.value = {}
  }

  return {
    counters,
    previewCounters,
    incrementAll,
    resetCounters,
  }
}
