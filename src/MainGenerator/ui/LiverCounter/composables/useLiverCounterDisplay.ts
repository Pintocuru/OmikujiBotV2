// src/MainGenerator/ui/LiverCounter/composables/useLiverCounterDisplay.ts
import { computed, type Ref } from 'vue'
import type { SettingsLiverCounterType } from '@/types/'
import { BaseVariant } from '@shared/components/parts/ItemVariantTypes'

/**
 * LiverCounter 系コンポーネント共通のキー列挙・カラーパターン取得ロジック
 * BasicCircle など複数のスタイルコンポーネントで再利用できるよう切り出し
 */
export function useLiverCounterDisplay(settings: Ref<SettingsLiverCounterType>) {
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
  const getPattern = (key: string): BaseVariant => {
    const index = allKeys.value.indexOf(key)
    if (settings.value.colorOdd === null) {
      return settings.value.colorCycle[index % settings.value.colorCycle.length]
    }
    if (index % 2 === 0) return settings.value.colorOdd
    return settings.value.colorEven ?? settings.value.colorOdd
  }

  return { allKeys, getPattern }
}
