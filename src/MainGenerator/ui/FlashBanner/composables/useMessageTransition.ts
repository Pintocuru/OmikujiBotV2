// src/MainGenerator/ui/FlashBanner/composables/useMessageTransition.ts
import { ref, watch } from 'vue'
import { useMotion } from '@vueuse/motion'

export type MessageTransitionVariant = 'fadeUp' | 'slideInRight'

export function useMessageTransition(getMessage: () => string, variant: MessageTransitionVariant = 'fadeUp') {
  const displayMessage = ref(getMessage())
  const wrapperRef = ref<HTMLElement | null>(null)

  const variants = {
    fadeUp: {
      initial: { opacity: 0, y: 10 },
      enter: { opacity: 1, y: 0, transition: { duration: 250, ease: 'easeOut' } },
      exit: { opacity: 0, y: -6, transition: { duration: 180, ease: 'easeIn' } },
      reenter: { opacity: 1, y: 0, transition: { duration: 250, ease: 'easeOut' } },
    },
    slideInRight: {
      initial: { opacity: 0, x: 120 },
      enter: { opacity: 1, x: 0, transition: { duration: 600, ease: [0.22, 1, 0.36, 1] } },
      exit: { opacity: 0, x: 40, transition: { duration: 180, ease: 'easeIn' } },
      reenter: { opacity: 1, x: 0, transition: { duration: 600, ease: [0.22, 1, 0.36, 1] } },
    },
  }

  const v = variants[variant]

  const { apply } = useMotion(wrapperRef, {
    initial: v.initial,
    enter: v.enter,
  })

  watch(getMessage, async (newVal) => {
    if (newVal === displayMessage.value) return

    await apply(v.exit)
    displayMessage.value = newVal
    await apply(v.reenter)
  })

  return {
    displayMessage,
    wrapperRef,
  }
}
