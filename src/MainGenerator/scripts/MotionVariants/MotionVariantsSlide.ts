// src\MainGenerator\scripts\MotionVariants\MotionVariantsBase.ts
import { MotionVariants } from '@vueuse/motion'
import { MotionType } from './MotionVariants'

// スライド系
export const slideVariants = {
  slideUp: {
    initial: {
      y: 50,
      opacity: 0,
    },
    enter: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'keyframes',
        ease: 'easeOut',
        duration: 800,
        delay: 200,
      },
    },
    leave: {
      y: -50,
      opacity: 0,
      transition: {
        type: 'keyframes',
        ease: 'easeIn',
        duration: 400,
      },
    },
  },
  slideDown: {
    initial: {
      y: '-100%',
      opacity: 0,
    },
    enter: {
      y: '0%',
      opacity: 1,
      transition: {
        type: 'keyframes',
        ease: 'easeOut',
        duration: 800,
        delay: 150,
      },
    },
    leave: {
      y: '100%',
      opacity: 0,
      transition: {
        type: 'keyframes',
        ease: 'easeIn',
        duration: 400,
      },
    },
  },
  slideLeft: {
    initial: { opacity: 0, x: 300 },
    enter: { opacity: 1, x: 0, transition: { duration: 600, ease: 'easeOutBack' } },
    leave: { opacity: 0, x: -300, transition: { duration: 400, ease: 'easeInBack' } },
  },
  slideRight: {
    initial: { opacity: 0, x: -300 },
    enter: { opacity: 1, x: 0, transition: { duration: 600, ease: 'easeOutBack' } },
    leave: { opacity: 0, x: 300, transition: { duration: 400, ease: 'easeInBack' } },
  },
}
