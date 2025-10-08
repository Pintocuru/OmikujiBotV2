// src/MainGenerator/scripts/MotionVariants/Loop/LoopMotionVariantsPulse.ts
import { MotionVariants } from '@vueuse/motion'
import { LoopMotionType } from '../MotionVariants'

// パルス・拡大縮小系
export const loopPulseVariants = {
  pulse: {
    initial: {
      scale: 1,
    },
    visible: {
      scale: [1, 1.1, 1],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 1000,
        repeat: Infinity,
      },
    },
  },
  breathing: {
    initial: {
      scale: 1,
    },
    visible: {
      scale: [1, 1.05, 1],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 3000,
        repeat: Infinity,
      },
    },
  },
  heartbeat: {
    initial: {
      scale: 1,
    },
    visible: {
      scale: [1, 1.15, 1, 1.15, 1],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 1200,
        repeat: Infinity,
        repeatDelay: 500,
      },
    },
  },
}
