// src/MainGenerator/scripts/MotionVariants/Loop/LoopMotionVariantsBase.ts
import { MotionVariants } from '@vueuse/motion'
import { LoopMotionType } from '../MotionVariants'

// ベース系
export const loopBaseVariants = {
  none: {
    initial: {},
    visible: {},
  },
  glow: {
    initial: {
      opacity: 1,
    },
    visible: {
      opacity: [1, 0.5, 1],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 2000,
        repeat: Infinity,
      },
    },
  },
}
