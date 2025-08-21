// src\MainGenerator\scripts\MotionVariants\MotionVariantsBase.ts
import { MotionVariants } from '@vueuse/motion'
import { MotionType } from './MotionVariants'

// フリップ・回転系
export const flipVariants = {
  flipInY: {
    initial: {
      rotateY: -90,
      opacity: 0,
    },
    enter: {
      rotateY: 0,
      opacity: 1,
      transition: {
        type: 'keyframes',
        ease: 'easeOut',
        duration: 700,
        delay: 100,
      },
    },
    leave: {
      rotateY: 90,
      opacity: 0,
      transition: {
        type: 'keyframes',
        ease: 'easeIn',
        duration: 400,
      },
    },
  },
  flipX: {
    initial: { opacity: 0, rotateX: 90, z: 100 },
    enter: { opacity: 1, rotateX: 0, z: 0, transition: { duration: 900, ease: 'easeOutElastic' } },
    leave: {
      opacity: 0,
      rotateX: -90,
      z: -100,
      transition: { duration: 400, ease: 'easeInQuart' },
    },
  },
  rotateIn: {
    initial: {
      rotate: -200,
      scale: 0,
      opacity: 0,
    },
    enter: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        duration: 1000,
        delay: 0,
      },
    },
    leave: {
      rotate: 200,
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
