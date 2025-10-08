// src/MainGenerator/scripts/MotionVariants/Loop/LoopMotionVariantsRotate.ts
import { MotionVariants } from '@vueuse/motion'
import { LoopMotionType } from '../MotionVariants'

// 回転系
export const loopRotateVariants = {
  rotate: {
    initial: {
      rotate: 0,
    },
    visible: {
      rotate: 360,
      transition: {
        type: 'keyframes',
        ease: 'linear',
        duration: 3000,
        repeat: Infinity,
      },
    },
  },
  flipLoop: {
    initial: {
      rotateY: 0,
    },
    visible: {
      rotateY: [0, 180, 360],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 2000,
        repeat: Infinity,
        repeatDelay: 1000,
      },
    },
  },
}
