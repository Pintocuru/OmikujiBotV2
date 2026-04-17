// src/MainGenerator/ui/CommentSpin/composables/useCommentSpinAnimation.ts
import { ref, nextTick, Ref } from 'vue'
import type { BotMessageBubbleType, spinAnimation } from '@/types'
import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'

interface AnimationOptions {
  duration?: number
  easing?: string
  type?: Ref<spinAnimation>
}

export function useCommentSpinAnimation(options: AnimationOptions = {}) {
  const { duration = 3000, easing = 'cubic-bezier(0.25, 0.1, 0.1, 1)' } = options
  const animationType = options.type?.value ?? 'vertical'

  const slotMessages = ref<BotMessageBubbleType[]>([])
  const isSpinning = ref(false)
  const resolvedMessage = ref<BotMessageBubbleType | null>(null)
  const overrideLogoPath = ref<string[] | null>(null)

  // 実行中アニメーションを保持（再起動時にキャンセルするため）
  let currentAnimation: Animation | null = null

  async function startSpin(msgs: BotMessageBubbleType[]) {
    // ガード削除：スピン中でも再起動を許可

    // 前のアニメーションが残っていればキャンセル（onfinish は発火させない）
    if (currentAnimation) {
      currentAnimation.onfinish = null
      currentAnimation.cancel()
      currentAnimation = null
    }

    overrideLogoPath.value = null
    isSpinning.value = false
    slotMessages.value = []
    resolvedMessage.value = null

    await nextTick()

    slotMessages.value = msgs
    isSpinning.value = true
  }

  /**
   * アニメーション実行
   */
  async function onAnimationReady(el: HTMLElement, itemSize: number) {
    let anim: Animation | null = null
    switch (animationType) {
      case 'vertical':
        anim = verticalSpin(el, itemSize)
        break
      case 'horizontal':
        anim = horizontalSpin(el, itemSize)
        break
      case 'flip':
        anim = flipSpin(el)
        break
      case 'calendar':
        anim = calendarSpin(el, itemSize)
        break
    }

    if (!anim) return

    currentAnimation = anim

    anim.onfinish = () => {
      // すでに別のアニメーションに切り替わっていたら無視
      if (currentAnimation !== anim) return

      currentAnimation = null

      const last = slotMessages.value[slotMessages.value.length - 1]
      if (last) resolvedMessage.value = last
      const { iconSrc } = useCharacterManager()

      const isHit = !!Boolean(resolvedMessage.value?.slots?.slot0)
      const characterKey = resolvedMessage.value?.bubble.characterKey ?? null
      const iconKey = resolvedMessage.value?.bubble.iconKey
      const src = characterKey ? iconSrc(characterKey, iconKey) : []

      if (isHit && src.length > 0) overrideLogoPath.value = src

      isSpinning.value = false
    }
  }

  function onAnimationEnd() {
    // 拡張用
  }

  return {
    slotMessages,
    isSpinning,
    resolvedMessage,
    overrideLogoPath,
    startSpin,
    onAnimationReady,
    onAnimationEnd,
  }

  // 各アニメーション実装（変更なし）

  function verticalSpin(el: HTMLElement, itemHeight: number) {
    const targetY = -((slotMessages.value.length - 1) * itemHeight)
    return el.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${targetY}px)` }], {
      duration,
      easing,
      fill: 'forwards',
    })
  }

  function horizontalSpin(el: HTMLElement, itemWidth: number) {
    const targetX = -((slotMessages.value.length - 1) * itemWidth)
    return el.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${targetX}px)` }], {
      duration,
      easing,
      fill: 'forwards',
    })
  }

  function flipSpin(el: HTMLElement) {
    return el.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(720deg)' }], {
      duration,
      easing: 'ease-in-out',
      fill: 'forwards',
    })
  }

  function calendarSpin(el: HTMLElement, itemHeight: number) {
    const steps = slotMessages.value.length
    const stepDuration = duration / steps

    let current = 0

    const animateStep = () => {
      if (current >= steps - 1) return

      const from = -current * itemHeight
      const to = -(current + 1) * itemHeight

      el.animate([{ transform: `translateY(${from}px)` }, { transform: `translateY(${to}px)` }], {
        duration: stepDuration,
        easing: 'ease-in-out',
        fill: 'forwards',
      })

      current++
      setTimeout(animateStep, stepDuration * 0.9)
    }

    animateStep()

    return { onfinish: null as any } as Animation
  }
}
