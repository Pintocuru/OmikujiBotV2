// src/MainGenerator/scripts/MotionVariants/EnterLeave/MotionVariantsBase.ts
import { MotionVariants } from '@vueuse/motion'
import { MotionType } from '../MotionVariants'

// ベース・基本系
export const baseVariants = {
  none: {
    initial: {},
    enter: {},
    leave: {},
  },
  fade: {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 600, ease: 'easeOutQuart' } },
    leave: { opacity: 0, transition: { duration: 400, ease: 'easeInQuart' } },
  },
}
