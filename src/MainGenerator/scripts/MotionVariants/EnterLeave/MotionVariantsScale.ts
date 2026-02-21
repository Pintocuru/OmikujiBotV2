// src/MainGenerator/scripts/MotionVariants/EnterLeave/MotionVariantsScale.ts
import { MotionVariants } from '@vueuse/motion'
import { EnterMotionType } from '../MotionVariants'

// スケール・ズーム系
export const scaleVariants = {
  zoomIn: {
    initial: {
      scale: 0,
      opacity: 0,
    },
    enter: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        duration: 600,
        delay: 100,
      },
    },
    leave: {
      scale: 0,
      opacity: 0,
      transition: {
        type: 'keyframes',
        ease: 'easeIn',
        duration: 300,
      },
    },
  },
  scale: {
    initial: { opacity: 0, scale: 0.3, y: 30 },
    enter: { opacity: 1, scale: 1, y: 0, transition: { duration: 500, ease: 'easeOutBack' } },
    leave: { opacity: 0, scale: 0.3, y: -30, transition: { duration: 300, ease: 'easeInBack' } },
  },
  pulse: {
    initial: {
      scale: 1,
    },
    enter: {
      scale: [1, 1.1, 1],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 1000,
        delay: 0,
        repeat: Infinity,
      },
    },
    leave: {
      scale: 0,
      opacity: 0,
      transition: {
        type: 'keyframes',
        ease: 'easeIn',
        duration: 300,
      },
    },
  },
}
