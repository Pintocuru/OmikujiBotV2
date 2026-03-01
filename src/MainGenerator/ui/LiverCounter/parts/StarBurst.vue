<!-- src/MainGenerator/ui/LiverCounter/parts/StarBurst.vue -->
<template>
  <div class="star-container">
    <div v-for="(key, i) in allKeys" :key="key" class="star-item" :style="getStarStyle(key, i)">
      <!-- 背景の星型 SVG -->
      <svg class="star-bg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,4 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" :fill="`url(#grad-${key})`" />
        <defs>
          <radialGradient :id="`grad-${key}`" cx="40%" cy="35%" r="65%">
            <stop offset="0%" :stop-color="getStarColors(key)[0]" />
            <stop offset="100%" :stop-color="getStarColors(key)[1]" />
          </radialGradient>
        </defs>
        <!-- キラキラ -->
        <circle cx="72" cy="18" r="3" fill="white" opacity="0.7" />
        <circle cx="82" cy="30" r="1.5" fill="white" opacity="0.5" />
        <circle cx="20" cy="22" r="2" fill="white" opacity="0.4" />
      </svg>

      <!-- コンテンツ -->
      <div class="star-content">
        <component :is="getLabel(key)" v-if="isComponent(getLabel(key))" class="star-icon" />
        <span v-else class="star-emoji">{{ getLabel(key) }}</span>
        <div class="star-value">{{ formatValue(counters[key] ?? 0) }}</div>
      </div>

      <!-- アニメーション用のキラキラパーティクル -->
      <span class="sparkle s1" />
      <span class="sparkle s2" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { toRef, type Component } from 'vue'
  import type { LiverDefaultKey, SettingsLiverCounterType } from '@/types/'
  import { ThumbsUp, Eye, Sparkles, MessageCircle, TrendingUp, BadgeDollarSign } from 'lucide-vue-next'
  import { useLiverCounterDisplay } from '../composables/useLiverCounterDisplay'

  const props = defineProps<{
    settings: SettingsLiverCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
  }>()

  const DEFAULT_LABELS: Record<LiverDefaultKey, string | Component> = {
    upVote: ThumbsUp,
    viewer: Eye,
    syoken: Sparkles,
    commenter: MessageCircle,
    lc: TrendingUp,
    totalPrice: BadgeDollarSign,
  }

  const getLabel = (key: string): string | Component => {
    if (key in DEFAULT_LABELS) return DEFAULT_LABELS[key as LiverDefaultKey]
    return props.eventLabels[key] ?? key
  }

  const isComponent = (label: string | Component): label is Component => typeof label !== 'string'

  const formatValue = (v: number) => new Intl.NumberFormat().format(v)

  const { allKeys, getPattern } = useLiverCounterDisplay(toRef(props, 'settings'))

  const colorPairs: Record<string, [string, string]> = {
    primary: ['#c4b5fd', '#7c3aed'],
    secondary: ['#f9a8d4', '#db2777'],
    accent: ['#6ee7b7', '#059669'],
    neutral: ['#e2e8f0', '#64748b'],
    info: ['#7dd3fc', '#0284c7'],
    success: ['#86efac', '#16a34a'],
    warning: ['#fde68a', '#d97706'],
    error: ['#fca5a5', '#dc2626'],
  }

  const getStarColors = (key: string): [string, string] => {
    const token = getPattern(key)
    return colorPairs[token] ?? ['#c4b5fd', '#7c3aed']
  }

  const getStarStyle = (key: string, index: number) => {
    const [light] = getStarColors(key)
    return {
      '--star-glow': light,
      animationDelay: `${index * 0.15}s`,
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@700&family=Quicksand:wght@600;700&display=swap');

  .star-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 10px 8px;
    font-family: 'Quicksand', sans-serif;
  }

  .star-item {
    position: relative;
    width: 68px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation:
      starPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both,
      starPulse 3.5s ease-in-out infinite 0.5s;
    cursor: default;
    filter: drop-shadow(0 3px 8px color-mix(in srgb, var(--star-glow) 60%, transparent));
  }

  .star-item:hover {
    filter: drop-shadow(0 4px 14px color-mix(in srgb, var(--star-glow) 90%, transparent)) brightness(1.1);
  }

  .star-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .star-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 2px;
    gap: 1px;
  }

  .star-icon {
    width: 16px;
    height: 16px;
    color: rgba(255, 255, 255, 0.95);
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }

  .star-emoji {
    font-size: 13px;
    line-height: 1;
  }

  .star-value {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    letter-spacing: 0.5px;
  }

  /* キラキラパーティクル */
  .sparkle {
    position: absolute;
    border-radius: 50%;
    background: white;
    opacity: 0;
    animation: sparkleAnim 2.5s ease-in-out infinite;
    pointer-events: none;
  }
  .s1 {
    width: 4px;
    height: 4px;
    top: 8px;
    right: 10px;
    animation-delay: 0.3s;
  }
  .s2 {
    width: 3px;
    height: 3px;
    bottom: 12px;
    left: 8px;
    animation-delay: 1.2s;
  }

  @keyframes starPop {
    from {
      transform: scale(0) rotate(-15deg);
      opacity: 0;
    }
    to {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }

  @keyframes starPulse {
    0%,
    100% {
      transform: scale(1) rotate(0deg);
    }
    50% {
      transform: scale(1.05) rotate(2deg);
    }
  }

  @keyframes sparkleAnim {
    0%,
    100% {
      transform: scale(0);
      opacity: 0;
    }
    40% {
      transform: scale(1);
      opacity: 0.9;
    }
    60% {
      transform: scale(1);
      opacity: 0.9;
    }
    80% {
      transform: scale(0);
      opacity: 0;
    }
  }
</style>
