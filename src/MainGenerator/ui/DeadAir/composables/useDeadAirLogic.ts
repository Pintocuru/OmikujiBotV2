// src/MainGenerator/ui/DeadAir/composables/useDeadAirLogic.ts
import { ref, computed, watch, onUnmounted, Ref } from 'vue'
import type { DeadAirType, DeadEventRuleType } from '@/types/OmikujiData/UiSettings/DeadAirSchema'

export type DeadAirPhase = 'running' | 'gameOver'

export function useDeadAirLogic(settings: Ref<DeadAirType>, counters: Ref<Record<string, number>>) {
  // ---------------------------------------------------------------------------
  // 状態
  // ---------------------------------------------------------------------------

  const phase = ref<DeadAirPhase>('running')
  const remainSeconds = ref(settings.value.initialMinutes * 60)
  const currentLives = ref(settings.value.initialLives)
  const bonusAccumSeconds = ref(0)

  // ---------------------------------------------------------------------------
  // 導出値
  // ---------------------------------------------------------------------------

  const maxSeconds = computed(() => settings.value.initialMinutes * 60)

  const lifeFraction = computed(() =>
    settings.value.initialLives > 0 ? currentLives.value / settings.value.initialLives : 0
  )

  const bonusFraction = computed(() =>
    settings.value.bonusEnabled && maxSeconds.value > 0 ? Math.min(bonusAccumSeconds.value / maxSeconds.value, 1) : 0
  )

  const optionalValue = computed(() => {
    const key = settings.value.optionalCounterKey
    return key ? (counters.value[key] ?? 0) : null
  })

  const formattedTime = computed(() => {
    const total = Math.max(remainSeconds.value, 0)
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  const isWarning = computed(() => remainSeconds.value <= 30 && remainSeconds.value > 0)
  const isCritical = computed(() => remainSeconds.value <= 10 && remainSeconds.value > 0)

  // ---------------------------------------------------------------------------
  // タイマー
  // ---------------------------------------------------------------------------

  let intervalId: ReturnType<typeof setInterval> | null = null

  const startTimer = () => {
    if (!intervalId) intervalId = setInterval(tick, 1000)
  }
  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const loseLife = () => {
    bonusAccumSeconds.value = 0
    currentLives.value -= 1
    if (currentLives.value <= 0) {
      currentLives.value = 0
      phase.value = 'gameOver'
      stopTimer()
      return
    }
    remainSeconds.value = maxSeconds.value
  }

  const tick = () => {
    if (phase.value === 'gameOver') return
    remainSeconds.value -= 10
    if (remainSeconds.value <= 0) {
      remainSeconds.value = 0
      loseLife()
    }
  }

  // ---------------------------------------------------------------------------
  // イベントルール
  // ---------------------------------------------------------------------------

  const addTimer = (seconds: number) => {
    const newVal = remainSeconds.value + seconds
    if (newVal <= maxSeconds.value) {
      remainSeconds.value = newVal
      return
    }
    remainSeconds.value = maxSeconds.value
    if (settings.value.bonusEnabled) {
      bonusAccumSeconds.value += newVal - maxSeconds.value
      if (bonusAccumSeconds.value >= maxSeconds.value) {
        bonusAccumSeconds.value -= maxSeconds.value
        currentLives.value = Math.min(currentLives.value + 1, settings.value.initialLives)
      }
    }
  }

  const applyEffect = (rule: DeadEventRuleType) => {
    if (rule.effect === 'timer') addTimer(rule.value * 60)
    else currentLives.value = Math.min(currentLives.value + rule.value, settings.value.initialLives)
  }

  const unwatchCounters = watch(
    () => ({ ...counters.value }),
    (current, prev) => {
      if (phase.value === 'gameOver') return
      for (const rule of settings.value.eventRules) {
        const key = rule.counterKey
        if (!key) continue
        const curr = current[key] ?? 0
        const p = (prev ?? {})[key] ?? 0
        if (curr <= p) continue
        const times = Math.floor(curr / rule.threshold) - Math.floor(p / rule.threshold)
        for (let i = 0; i < times; i++) applyEffect(rule)
      }
    },
    { deep: false }
  )

  // ---------------------------------------------------------------------------
  // settings 変更時リセット
  // ---------------------------------------------------------------------------

  const unwatchSettings = watch(
    () => [settings.value.initialMinutes, settings.value.initialLives],
    () => {
      stopTimer()
      phase.value = 'running'
      remainSeconds.value = settings.value.initialMinutes * 60
      currentLives.value = settings.value.initialLives
      bonusAccumSeconds.value = 0
      startTimer()
    }
  )

  // ---------------------------------------------------------------------------
  // ライフサイクル
  // ---------------------------------------------------------------------------

  startTimer()

  onUnmounted(() => {
    stopTimer()
    unwatchCounters()
    unwatchSettings()
  })

  // ---------------------------------------------------------------------------
  // プレビュー用（手動tick）
  // ---------------------------------------------------------------------------

  return {
    phase,
    formattedTime,
    isWarning,
    isCritical,
    currentLives,
    bonusFraction,
    lifeFraction,
    optionalValue,
    tick, // プレビュー用
  }
}
