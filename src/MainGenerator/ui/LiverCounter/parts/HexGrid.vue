<!-- src/MainGenerator/ui/LiverCounter/parts/HexGrid.vue -->
<template>
  <div class="hex-container">
    <div v-for="(key, i) in allKeys" :key="key" class="hex-wrap" :style="getHexStyle(key, i)">
      <svg class="hex-svg" viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg">
        <!-- 背景六角形 -->
        <polygon
          points="50,2 97,27 97,88 50,113 3,88 3,27"
          :fill="`url(#hex-bg-${key})`"
          :stroke="`url(#hex-stroke-${key})`"
          stroke-width="1.5"
        />
        <!-- 内側の細ライン -->
        <polygon
          points="50,10 90,32 90,83 50,105 10,83 10,32"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          stroke-width="0.8"
        />
        <!-- 上部のキャップハイライト -->
        <polygon points="50,2 97,27 80,18 50,6 20,18 3,27" fill="rgba(255,255,255,0.06)" />
        <defs>
          <linearGradient :id="`hex-bg-${key}`" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="getHexColors(key)[0]" stop-opacity="0.22" />
            <stop offset="100%" :stop-color="getHexColors(key)[1]" stop-opacity="0.08" />
          </linearGradient>
          <linearGradient :id="`hex-stroke-${key}`" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="getHexColors(key)[0]" stop-opacity="0.9" />
            <stop offset="100%" :stop-color="getHexColors(key)[1]" stop-opacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      <!-- コンテンツ -->
      <div class="hex-content">
        <component
          :is="getLabel(key)"
          v-if="isComponent(getLabel(key))"
          class="hex-icon"
          :style="{ color: getHexColors(key)[0] }"
        />
        <span v-else class="hex-emoji">{{ getLabel(key) }}</span>
        <div class="hex-value" :style="{ color: getHexColors(key)[0] }">
          {{ formatValue(counters[key] ?? 0) }}
        </div>
      </div>
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

  // DaisyUI トークン → SF系カラーペア [明, 暗]
  const hexColorMap: Record<string, [string, string]> = {
    primary: ['#38bdf8', '#0369a1'],
    secondary: ['#e879f9', '#86198f'],
    accent: ['#4ade80', '#166534'],
    neutral: ['#94a3b8', '#334155'],
    info: ['#67e8f9', '#0e7490'],
    success: ['#34d399', '#065f46'],
    warning: ['#fbbf24', '#92400e'],
    error: ['#f87171', '#991b1b'],
  }

  const getHexColors = (key: string): [string, string] => {
    const token = getPattern(key)
    return hexColorMap[token] ?? ['#38bdf8', '#0369a1']
  }

  const getHexStyle = (key: string, index: number) => {
    const [light] = getHexColors(key)
    return {
      '--hex-glow': light,
      animationDelay: `${index * 0.1}s`,
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Orbitron:wght@700;900&display=swap');

  .hex-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* 六角形をタイル状に並べる: 偶数番目を下にオフセット */
    align-items: flex-start;
    gap: 4px 0px;
    padding: 8px 10px;
    font-family: 'Rajdhani', sans-serif;
  }

  .hex-wrap {
    position: relative;
    width: 60px;
    height: 69px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 2px;
    cursor: default;
    animation: hexReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    filter: drop-shadow(0 2px 8px color-mix(in srgb, var(--hex-glow) 30%, transparent));
    transition:
      filter 0.2s ease,
      transform 0.2s ease;
  }

  /* 偶数インデックスを縦にずらしてハニカム配置 */
  .hex-wrap:nth-child(2n) {
    margin-top: 20px;
  }

  .hex-wrap:hover {
    transform: translateY(-3px) scale(1.06);
    filter: drop-shadow(0 4px 16px color-mix(in srgb, var(--hex-glow) 70%, transparent));
  }

  .hex-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .hex-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding-bottom: 2px;
  }

  .hex-icon {
    width: 16px;
    height: 16px;
    filter: drop-shadow(0 0 4px currentColor);
  }

  .hex-emoji {
    font-size: 13px;
    line-height: 1;
  }

  .hex-value {
    font-family: 'Orbitron', sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-shadow: 0 0 8px currentColor;
    white-space: nowrap;
  }

  @keyframes hexReveal {
    from {
      opacity: 0;
      transform: scale(0.6) rotate(-10deg);
      filter: drop-shadow(0 0 0px transparent);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }
</style>
