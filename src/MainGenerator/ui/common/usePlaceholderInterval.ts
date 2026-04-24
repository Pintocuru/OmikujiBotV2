// src/MainGenerator/ui/common/usePlaceholderInterval.ts
import { ref, onMounted, onUnmounted } from 'vue'
import { usePlaceholderResolver } from '@main/ui/common/usePlaceholderResolver'

export function usePlaceholderInterval(templateRef: () => string, intervalMs = 30000) {
  const { resolveComment } = usePlaceholderResolver()

  const getTemplates = (): string[] => {
    const t = templateRef()
    return Array.isArray(t) ? t : [t ?? '']
  }

  const generateOne = (): string => {
    const list = getTemplates()
    const picked = list[Math.floor(Math.random() * list.length)] ?? ''
    return resolveComment(picked)
  }

  const message = ref(generateOne())
  const pending = ref<string | null>(null)

  function commitIfPending(isShowingDefault: boolean) {
    if (pending.value !== null && isShowingDefault) {
      message.value = pending.value
      pending.value = null
    }
  }

  let interval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    interval = setInterval(() => {
      // 直接更新
      pending.value = generateOne()

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
