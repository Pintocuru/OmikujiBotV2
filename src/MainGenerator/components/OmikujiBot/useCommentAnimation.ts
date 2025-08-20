// src/MainGenerator/components/OmikujiBot/useCommentAnimation.ts
import type { MotionVariants, MotionProperties } from '@vueuse/motion'
import type { AnimationType } from '@/types/BotComponents/animation'

// アニメーション設定を、VueUse Motionの variants 形式で定義
export const animationVariants: Record<AnimationType, MotionVariants<AnimationType>> = {
  slideUp: {
    initial: { opacity: 0, y: 150 } as MotionProperties,
    enter: { opacity: 1, y: 0, transition: { duration: 800, ease: [0.25, 0.46, 0.45, 0.94] } } as MotionProperties,
    leave: { opacity: 0, y: -150, transition: { duration: 600, ease: [0.55, 0.055, 0.675, 0.19] } } as MotionProperties,
  },
  slideDown: {
    initial: { opacity: 0, y: -150 } as MotionProperties,
    enter: { opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOutQuart' } } as MotionProperties,
    leave: { opacity: 0, y: 150, transition: { duration: 500, ease: 'easeInQuart' } } as MotionProperties,
  },
  slideLeft: {
    initial: { opacity: 0, x: 300 } as MotionProperties,
    enter: { opacity: 1, x: 0, transition: { duration: 600, ease: 'easeOutBack' } } as MotionProperties,
    leave: { opacity: 0, x: -300, transition: { duration: 400, ease: 'easeInBack' } } as MotionProperties,
  },
  slideRight: {
    initial: { opacity: 0, x: -300 } as MotionProperties,
    enter: { opacity: 1, x: 0, transition: { duration: 600, ease: 'easeOutBack' } } as MotionProperties,
    leave: { opacity: 0, x: 300, transition: { duration: 400, ease: 'easeInBack' } } as MotionProperties,
  },
  flipY: {
    initial: { opacity: 0, rotateY: 90, y: 50 } as MotionProperties,
    enter: { opacity: 1, rotateY: 0, y: 0, transition: { duration: 900, ease: 'easeOutElastic' } } as MotionProperties,
    leave: { opacity: 0, rotateY: -90, y: -50, transition: { duration: 400, ease: 'easeInQuart' } } as MotionProperties,
  },
  flipX: {
    initial: { opacity: 0, rotateX: 90, z: 100 } as MotionProperties,
    enter: { opacity: 1, rotateX: 0, z: 0, transition: { duration: 900, ease: 'easeOutElastic' } } as MotionProperties,
    leave: {
      opacity: 0,
      rotateX: -90,
      z: -100,
      transition: { duration: 400, ease: 'easeInQuart' },
    } as MotionProperties,
  },
  scale: {
    initial: { opacity: 0, scale: 0.3, y: 30 } as MotionProperties,
    enter: { opacity: 1, scale: 1, y: 0, transition: { duration: 500, ease: 'easeOutBack' } } as MotionProperties,
    leave: { opacity: 0, scale: 0.3, y: -30, transition: { duration: 300, ease: 'easeInBack' } } as MotionProperties,
  },
  rotate: {
    initial: { opacity: 0, rotate: 180, scale: 0.5 } as MotionProperties,
    enter: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 800, ease: 'easeOutBack' } } as MotionProperties,
    leave: {
      opacity: 0,
      rotate: -180,
      scale: 0.5,
      transition: { duration: 400, ease: 'easeInQuart' },
    } as MotionProperties,
  },
  bounce: {
    initial: { opacity: 0, y: 200, scale: 0.8 } as MotionProperties,
    enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 1000, ease: 'easeOutBounce' } } as MotionProperties,
    leave: { opacity: 0, y: -100, scale: 0.8, transition: { duration: 300, ease: 'easeInQuart' } } as MotionProperties,
  },
  fade: {
    initial: { opacity: 0 } as MotionProperties,
    enter: { opacity: 1, transition: { duration: 600, ease: 'easeOutQuart' } } as MotionProperties,
    leave: { opacity: 0, transition: { duration: 400, ease: 'easeInQuart' } } as MotionProperties,
  },
}
