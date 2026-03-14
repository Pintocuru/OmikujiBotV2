// src/MainGenerator/ui/DeadAir/composables/useDeadAirDisplay.ts
import { computed } from 'vue'

/**
 * 表示フォーマット専用コンポーザブル。
 * ロジックとビューの橋渡しを担う。
 */
export function useDeadAirDisplay(remainSeconds: Readonly<{ value: number }>) {
  /** MM:SS 形式 */
  const formattedTime = computed(() => {
    const total = Math.max(remainSeconds.value, 0)
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  /** 残り時間が 30 秒以下で警告状態 */
  const isWarning = computed(() => remainSeconds.value <= 30 && remainSeconds.value > 0)

  /** 残り時間が 10 秒以下でクリティカル状態 */
  const isCritical = computed(() => remainSeconds.value <= 10 && remainSeconds.value > 0)

  return {
    formattedTime,
    isWarning,
    isCritical,
  }
}
