// src/MainGenerator/ui/CookieCounter/composables/useStreamCounterDisplay.ts
import { computed, type Ref } from 'vue'
import type { StreamCounterType } from '@/types'
import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

/**
 * StreamCounter 系コンポーネント共通のキー列挙・カラーパターン取得ロジック
 * BasicCircle など複数のスタイルコンポーネントで再利用できるよう切り出し
 */
export function useStreamCounterDisplay(settings: Ref<StreamCounterType>) {
  /**
   * 表示するカウンターキーの一覧（デフォルト + イベント、最大8件）
   */
  const allKeys = computed(() => {
    const defaults = settings.value.defaultCounters as string[]
    const events = settings.value.eventCounters ?? []
    const maxEvents = Math.max(0, 8 - defaults.length)
    return [...defaults, ...events.slice(0, maxEvents)]
  })

  /**
   * キーのインデックスに応じたカラーパターン文字列を返す
   */
  const getPattern = (key: string): DaisyUIColorType => {
    const index = allKeys.value.indexOf(key)
    if (index === -1) return 'neutral'
    return settings.value.colorCycle[index % settings.value.colorCycle.length]
  }

  // 数値に , を付与する
  const formatValue = (v: number) => new Intl.NumberFormat().format(v)

  return { allKeys, getPattern, formatValue }
}
