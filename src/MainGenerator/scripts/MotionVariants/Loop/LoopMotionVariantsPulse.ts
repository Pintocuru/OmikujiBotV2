// src/MainGenerator/scripts/MotionVariants/Loop/LoopMotionVariantsPulse.ts

// パルス・拡大縮小系
export const loopPulseVariants = {
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
