// shared/utils/rankComponent/useScoreAnimation.ts
import { ref } from 'vue';
import { ScoreAnimationType } from '@/types';
import anime from 'animejs';

// anime.js のアニメーションプロパティの型を定義
type AnimeProperties = anime.AnimeAnimParams & {
 loop?: boolean;
};

// Animation configurations
const ANIMATION_CONFIGS: Record<ScoreAnimationType, AnimeProperties> = {
 bounce: {
  translateY: ['-100px', '0px'],
  scale: [0.3, 1],
  easing: 'easeOutBounce',
  duration: 1200,
  delay: 0
 },
 fadeInUp: {
  translateY: ['50px', '0px'],
  opacity: [0, 1],
  easing: 'easeOutQuad',
  duration: 800,
  delay: 200
 },
 zoomIn: {
  scale: [0, 1],
  opacity: [0, 1],
  easing: 'easeOutBack',
  duration: 600,
  delay: 100
 },
 pulse: {
  scale: [1, 1.1, 1],
  easing: 'easeInOutQuad',
  duration: 1000,
  delay: 0,
  loop: true
 },
 slideInDown: {
  translateY: ['-100%', '0%'],
  opacity: [0, 1],
  easing: 'easeOutCubic',
  duration: 800,
  delay: 150
 },
 rotateIn: {
  rotate: ['-200deg', '0deg'],
  scale: [0, 1],
  opacity: [0, 1],
  easing: 'easeOutBack',
  duration: 1000,
  delay: 0
 },
 flipInY: {
  rotateY: ['-90deg', '0deg'],
  opacity: [0, 1],
  easing: 'easeOutQuart',
  duration: 700,
  delay: 100
 },
 rubberBand: {
  scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
  scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
  easing: 'easeInOutQuad',
  duration: 1000,
  delay: 0
 },
 jello: {
  skewX: ['0deg', '-12.5deg', '6.25deg', '-3.125deg', '1.5625deg', '-0.78125deg', '0deg'],
  skewY: ['0deg', '2.5deg', '-1.25deg', '0.625deg', '-0.3125deg', '0.15625deg', '0deg'],
  easing: 'easeInOutQuad',
  duration: 900,
  delay: 100
 },
 heartBeat: {
  scale: [1, 1.3, 1, 1.3, 1],
  easing: 'easeInOutQuad',
  duration: 1200,
  delay: 0,
  loop: true
 }
};

// アニメーションで使われる可能性のある全てのプロパティの初期値を定義
const INITIAL_PROPS: Record<string, any> = {
 opacity: 1,
 translateY: '0px',
 scale: 1,
 scaleX: 1,
 scaleY: 1,
 rotate: '0deg',
 rotateY: '0deg',
 skewX: '0deg',
 skewY: '0deg'
};

export function useScoreAnimation() {
 const scoreElement = ref<HTMLElement | null>(null);
 let currentAnimation: anime.AnimeInstance | null = null;

 const animateScore = (animationType: ScoreAnimationType = 'bounce'): void => {
  if (!scoreElement.value) {
   return;
  }

  if (currentAnimation) {
   currentAnimation.pause();
   currentAnimation = null;
  }

  const animConfig = ANIMATION_CONFIGS[animationType];
  if (!animConfig) {
   return;
  }

  if (scoreElement.value.offsetParent === null) {
   return;
  }

  const { duration, delay, easing, loop, ...animationProps } = animConfig;
  const propsToReset: Record<string, any> = {};

  for (const key of Object.keys(animationProps)) {
   if (INITIAL_PROPS.hasOwnProperty(key)) {
    propsToReset[key] = INITIAL_PROPS[key];
   }
  }

  try {
   anime.set(scoreElement.value, { ...propsToReset });

   currentAnimation = anime({
    targets: scoreElement.value,
    duration,
    delay,
    easing,
    loop: loop || false,
    direction: 'alternate',
    ...animationProps,
    complete: (anim) => {
     if (!loop) {
      currentAnimation = null;
     }
    }
   });
  } catch (error) {
   // ログは削除しましたが、念のためエラーハンドリングは残しておきます
  }
 };

 const resetAnimation = () => {
  if (currentAnimation) {
   currentAnimation.pause();
   currentAnimation = null;
  }
  if (scoreElement.value) {
   anime.set(scoreElement.value, { ...INITIAL_PROPS });
  }
 };

 const getAvailableAnimations = (): ScoreAnimationType[] => {
  return Object.keys(ANIMATION_CONFIGS) as ScoreAnimationType[];
 };

 return {
  scoreElement,
  animateScore,
  resetAnimation,
  getAvailableAnimations
 };
}
