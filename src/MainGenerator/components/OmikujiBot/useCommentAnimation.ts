// src\MainGenerator\components\OmikujiBot\useCommentAnimation.ts
import anime from 'animejs';
import type { AnimationType, AnimationConfig } from '@/types/BotComponents/animation';

export function useCommentAnimation(animationType: AnimationType = 'slideUp') {
 const animationConfig: Record<AnimationType, AnimationConfig> = {
  slideUp: {
   enter: { duration: 800, easing: 'cubicBezier(0.25, 0.46, 0.45, 0.94)' },
   leave: { duration: 600, easing: 'cubicBezier(0.55, 0.055, 0.675, 0.19)' }
  },
  slideDown: {
   enter: { duration: 700, easing: 'easeOutQuart' },
   leave: { duration: 500, easing: 'easeInQuart' }
  },
  slideLeft: {
   enter: { duration: 600, easing: 'easeOutBack' },
   leave: { duration: 400, easing: 'easeInBack' }
  },
  slideRight: {
   enter: { duration: 600, easing: 'easeOutBack' },
   leave: { duration: 400, easing: 'easeInBack' }
  },
  flipY: {
   enter: { duration: 900, easing: 'easeOutElastic(1, .8)' },
   leave: { duration: 400, easing: 'easeInQuart' }
  },
  flipX: {
   enter: { duration: 900, easing: 'easeOutElastic(1, .8)' },
   leave: { duration: 400, easing: 'easeInQuart' }
  },
  scale: {
   enter: { duration: 500, easing: 'easeOutBack' },
   leave: { duration: 300, easing: 'easeInBack' }
  },
  rotate: {
   enter: { duration: 800, easing: 'easeOutBack' },
   leave: { duration: 400, easing: 'easeInQuart' }
  },
  bounce: {
   enter: { duration: 1000, easing: 'easeOutBounce' },
   leave: { duration: 300, easing: 'easeInQuart' }
  },
  fade: {
   enter: { duration: 600, easing: 'easeOutQuart' },
   leave: { duration: 400, easing: 'easeInQuart' }
  }
 };

 const getEnterAnimation = (element: Element) => {
  const baseProps = {
   targets: element,
   duration: animationConfig[animationType].enter.duration,
   easing: animationConfig[animationType].enter.easing,
   opacity: [0, 1]
  };

  switch (animationType) {
   case 'slideUp':
    return { ...baseProps, translateY: [150, 0] };
   case 'slideDown':
    return { ...baseProps, translateY: [-150, 0] };
   case 'slideLeft':
    return { ...baseProps, translateX: [300, 0] };
   case 'slideRight':
    return { ...baseProps, translateX: [-300, 0] };
   case 'flipY':
    return { ...baseProps, rotateY: [90, 0], translateY: [50, 0] };
   case 'flipX':
    return { ...baseProps, rotateX: [90, 0], translateZ: [100, 0] };
   case 'scale':
    return { ...baseProps, scale: [0.3, 1], translateY: [30, 0] };
   case 'rotate':
    return { ...baseProps, rotate: [180, 0], scale: [0.5, 1] };
   case 'bounce':
    return { ...baseProps, translateY: [200, 0], scale: [0.8, 1] };
   case 'fade':
    return { ...baseProps };
   default:
    return { ...baseProps, translateY: [150, 0] };
  }
 };

 const getLeaveAnimation = (element: Element) => {
  const baseProps = {
   targets: element,
   duration: animationConfig[animationType].leave.duration,
   easing: animationConfig[animationType].leave.easing,
   opacity: [1, 0]
  };

  switch (animationType) {
   case 'slideUp':
    return { ...baseProps, translateY: [0, -150] };
   case 'slideDown':
    return { ...baseProps, translateY: [0, 150] };
   case 'slideLeft':
    return { ...baseProps, translateX: [0, -300] };
   case 'slideRight':
    return { ...baseProps, translateX: [0, 300] };
   case 'flipY':
    return { ...baseProps, rotateY: [0, -90], translateY: [0, -50] };
   case 'flipX':
    return { ...baseProps, rotateX: [0, -90], translateZ: [0, -100] };
   case 'scale':
    return { ...baseProps, scale: [1, 0.3], translateY: [0, -30] };
   case 'rotate':
    return { ...baseProps, rotate: [0, -180], scale: [1, 0.5] };
   case 'bounce':
    return { ...baseProps, translateY: [0, -100], scale: [1, 0.8] };
   case 'fade':
    return { ...baseProps };
   default:
    return { ...baseProps, translateY: [0, -150] };
  }
 };

 const animateEnter = (element: Element, done?: () => void) => {
  anime({
   ...getEnterAnimation(element),
   complete: done
  });
 };

 const animateLeave = (element: Element, done?: () => void) => {
  anime({
   ...getLeaveAnimation(element),
   complete: done
  });
 };

 return {
  animateEnter,
  animateLeave,
  animationConfig: animationConfig[animationType]
 };
}
