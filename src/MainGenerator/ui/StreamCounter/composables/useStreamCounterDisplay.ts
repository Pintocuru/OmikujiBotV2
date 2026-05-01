// src/MainGenerator/ui/StreamCounter/composables/useStreamCounterDisplay.ts
import { computed, type Ref } from 'vue'
import type { StreamCounterType } from '@/types'
import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

/**
 * StreamCounter 系コンポーネント共通のキー列挙・カラーパターン取得ロジック
 * BasicCircle など複数のスタイルコンポーネントで再利用できるよう切り出し
 */
export function useStreamCounterDisplay(settings: Ref<StreamCounterType>) {
  const allKeys = computed(() => {
    const defaults = settings.value.defaultCounters as string[]
    const events = settings.value.eventCounters ?? []
    const variables = (settings.value.variableCounters ?? []).map((c) => c.target)
    const maxEvents = Math.max(0, 8 - defaults.length - variables.length)
    return [...defaults, ...events.slice(0, maxEvents), ...variables]
  })

  /**
   * キーのインデックスに応じたカラーパターン文字列を返す
   */
  const variableLabels = computed<Record<string, string>>(() =>
    Object.fromEntries((settings.value.variableCounters ?? []).map((c) => [c.target, c.label]))
  )

  const getPattern = (key: string): DaisyUIColorType => {
    const index = allKeys.value.indexOf(key)
    if (index === -1) return 'neutral'
    return settings.value.colorCycle[index % settings.value.colorCycle.length]
  }

  const formatValue = (v: number) => new Intl.NumberFormat().format(v)

  return { allKeys, getPattern, formatValue, variableLabels }
}
