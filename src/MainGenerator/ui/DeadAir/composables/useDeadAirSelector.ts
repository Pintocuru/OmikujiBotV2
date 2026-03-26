// src/MainGenerator/ui/DeadAir/composables/useDeadAirSelector.ts
import { ref, computed, watch, onUnmounted } from 'vue'
import type { DeadAirType, DeadEventRuleType } from '@/types/OmikujiData/UiSettings/DeadAirSchema'

// ---------------------------------------------------------------------------
// 型
// ---------------------------------------------------------------------------

export type DeadAirPhase = 'running' | 'gameOver'

// ---------------------------------------------------------------------------
// composable
// ---------------------------------------------------------------------------

export function useDeadAirSelector(settings: DeadAirType, counters: Readonly<{ value: Record<string, number> }>) {
  // --- 状態 -----------------------------------------------------------------

  // 残り秒数 */
  const remainSeconds = ref(settings.initialMinutes * 60)

  // 現在ライフ */
  const currentLives = ref(settings.initialLives)

  // ボーナス蓄積秒数（initialMinutes * 60 を超えた分を積み上げる） */
  const bonusAccumSeconds = ref(0)

  // フェーズ */
  const phase = ref<DeadAirPhase>('running')

  // 前回の counters スナップショット（threshold 判定に使用）
  const prevCounters = ref<Record<string, number>>({})

  // --- 導出値 ---------------------------------------------------------------

  const maxSeconds = computed(() => settings.initialMinutes * 60)

  // ライフ割合（0〜1）。画面明度制御に使用 */
  const lifeFraction = computed(() => (settings.initialLives > 0 ? currentLives.value / settings.initialLives : 0))

  // ボーナスメーター割合（0〜1） */
  const bonusFraction = computed(() =>
    settings.bonusEnabled && maxSeconds.value > 0 ? Math.min(bonusAccumSeconds.value / maxSeconds.value, 1) : 0
  )

  // オプション表示値 */
  const optionalValue = computed(() => {
    const key = settings.optionalCounterKey
    return key ? (counters.value[key] ?? 0) : null
  })

  // --- タイマーループ -------------------------------------------------------

  let intervalId: ReturnType<typeof setInterval> | null = null

  const startTimer = () => {
    if (intervalId) return
    intervalId = setInterval(tick, 1000)
  }

  const tick = () => {
    if (phase.value === 'gameOver') return

    remainSeconds.value -= 1

    if (remainSeconds.value <= 0) {
      remainSeconds.value = 0
      loseLife()
    }
  }

  const loseLife = () => {
    // ボーナス蓄積リセット
    bonusAccumSeconds.value = 0

    currentLives.value -= 1

    if (currentLives.value <= 0) {
      currentLives.value = 0
      phase.value = 'gameOver'
      stopTimer()
      return
    }

    // ライフが残っていたらタイマーをリセットして再開
    remainSeconds.value = maxSeconds.value
  }

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  // --- イベントルール評価 ---------------------------------------------------

  /**
   * counters の変化を監視し、各 eventRule の threshold を超えるたびに効果を適用する。
   * threshold 判定：前回値から今回値へ何回しきい値を跨いだかをカウント。
   */
  const evaluateRules = (current: Record<string, number>, prev: Record<string, number>) => {
    if (phase.value === 'gameOver') return

    for (const rule of settings.eventRules) {
      const key = rule.counterKey
      if (!key) continue

      const curr = current[key] ?? 0
      const p = prev[key] ?? 0
      if (curr <= p) continue

      // threshold を何回跨いだか
      const times = Math.floor(curr / rule.threshold) - Math.floor(p / rule.threshold)
      if (times <= 0) continue

      for (let i = 0; i < times; i++) {
        applyEffect(rule)
      }
    }
  }

  const applyEffect = (rule: DeadEventRuleType) => {
    if (rule.effect === 'timer') {
      addTimer(rule.value * 60)
    } else {
      addLife(rule.value)
    }
  }

  const addTimer = (seconds: number) => {
    const newVal = remainSeconds.value + seconds

    if (newVal <= maxSeconds.value) {
      remainSeconds.value = newVal
      return
    }

    // 満タンを超えた場合
    remainSeconds.value = maxSeconds.value

    if (settings.bonusEnabled) {
      const overflow = newVal - maxSeconds.value
      bonusAccumSeconds.value += overflow
      checkBonus()
    }
  }

  const addLife = (amount: number) => {
    currentLives.value = Math.min(currentLives.value + amount, settings.initialLives)
  }

  const checkBonus = () => {
    if (bonusAccumSeconds.value >= maxSeconds.value) {
      bonusAccumSeconds.value -= maxSeconds.value
      addLife(1)
    }
  }

  // --- counters 監視 --------------------------------------------------------

  const unwatch = watch(
    () => ({ ...counters.value }),
    (current, prev) => {
      evaluateRules(current, prev ?? {})
      prevCounters.value = { ...current }
    },
    { deep: false }
  )

  // --- ライフサイクル -------------------------------------------------------

  startTimer()

  onUnmounted(() => {
    stopTimer()
    unwatch()
  })

  // --- 公開 API -------------------------------------------------------------

  return {
    phase,
    remainSeconds,
    currentLives,
    bonusFraction,
    lifeFraction,
    optionalValue,
    maxSeconds,
  }
}
