// src/MainGenerator/scripts/MotionVariants/EnterLeave/MotionVariantsElastic.ts
import { MotionVariants } from '@vueuse/motion'
import { MotionType } from '../MotionVariants'

// 弾性・特殊系
export const elasticVariants = {
  bounce: {
    initial: {
      y: -100,
      scale: 0.3,
      opacity: 1,
    },
    enter: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 8,
        duration: 1200,
        delay: 0,
      },
    },
    leave: {
      y: 100,
      scale: 0.3,
      opacity: 0,
      transition: {
        type: 'keyframes',
        ease: 'easeIn',
        duration: 400,
      },
    },
  },
  rubberBand: {
    initial: {
      scaleX: 1,
      scaleY: 1,
    },
    enter: {
      scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
      scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 1000,
        delay: 0,
      },
    },
    leave: {
      scaleX: 0,
      scaleY: 0,
      opacity: 0,
      transition: {
        type: 'keyframes',
        ease: 'easeIn',
        duration: 300,
      },
    },
  },
  jello: {
    initial: {
      skewX: 0,
      skewY: 0,
    },
    enter: {
      skewX: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0],
      skewY: [0, 2.5, -1.25, 0.625, -0.3125, 0.15625, 0],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 900,
        delay: 100,
      },
    },
    leave: {
      skewX: 15,
      skewY: -5,
      scale: 0,
      opacity: 0,
      transition: {
        type: 'keyframes',
        ease: 'easeIn',
        duration: 400,
      },
    },
  },
}
