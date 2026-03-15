// src/MainGenerator/ui/common/usePlaceholderInterval.ts
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { usePlaceholderResolver } from '@main/ui/common/usePlaceholderResolver'

export function usePlaceholderInterval(templateRef: () => string, intervalMs = 30000) {
  const { resolveComment } = usePlaceholderResolver()

  const refreshKey = ref(0)

  const generate = () => resolveComment(templateRef() ?? '')

  const message = ref(generate())
  const pending = ref<string | null>(null)

  watch(refreshKey, () => {
    pending.value = generate()
  })

  function commitIfPending(isShowingDefault: boolean) {
    if (pending.value !== null && isShowingDefault) {
      message.value = pending.value
      pending.value = null
    }
  }

  let interval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    interval = setInterval(() => {
      refreshKey.value++
      _onInterval()
    }, intervalMs)
  })

  onUnmounted(() => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  })

  let _onInterval: () => void = () => undefined

  function registerIntervalHook(fn: () => void) {
    _onInterval = fn
  }

  return {
    message,
    commitIfPending,
    registerIntervalHook,
  }
}
