// shared/utils/rankComponent/useScoreAnimation.ts
import { ScoreAnimationType } from '@/types'
import type { MotionVariants } from '@vueuse/motion'

export const ANIMATION_CONFIGS: Record<ScoreAnimationType, MotionVariants<ScoreAnimationType>> = {
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
  },

  fadeInUp: {
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
  },

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
  },

  slideInDown: {
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
  },

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
  },

  heartBeat: {
    initial: {
      scale: 1,
    },
    enter: {
      scale: [1, 1.3, 1, 1.3, 1],
      transition: {
        type: 'keyframes',
        ease: 'easeInOut',
        duration: 1200,
        delay: 0,
        repeat: Infinity,
      },
    },
  },
}
