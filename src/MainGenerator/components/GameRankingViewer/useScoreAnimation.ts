// shared/utils/rankComponent/useScoreAnimation.ts
import { ref, nextTick } from 'vue';
import anime from 'animejs';
import type { ScoreAnimationType } from '../../../types/GameComponent/GameRankingTypes';

// Animation configurations
const ANIMATION_CONFIGS = {
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
  delay: 0
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
  delay: 0
 }
} as const;

export function useScoreAnimation() {
 // Score animation element reference
 const scoreElement = ref<HTMLElement | null>(null);

 // Score animation function
 const animateScore = async (animationType: ScoreAnimationType) => {
  if (!scoreElement.value) return;

  const animConfig = ANIMATION_CONFIGS[animationType];
  const { duration, delay, easing, ...animationProps } = animConfig;

  return anime({
   targets: scoreElement.value,
   duration,
   delay,
   easing,
   ...animationProps
  }).finished;
 };

 // Initialize score animation
 const initScoreAnimation = async (animationType: ScoreAnimationType) => {
  await nextTick();
  if (scoreElement.value) {
   await animateScore(animationType);
  }
 };

 return {
  scoreElement,
  animateScore,
  initScoreAnimation
 };
}
