<!-- src/MainGenerator/ui/LiverCounter/parts/PixelBadge.vue -->
<template>
  <div class="pixel-container">
    <div v-for="(key, i) in allKeys" :key="key" class="pixel-badge" :style="getBadgeStyle(key, i)">
      <!-- スキャンライン -->
      <div class="scanlines" />
      <!-- コーナーの装飾 -->
      <span class="corner tl" /><span class="corner tr" /> <span class="corner bl" /><span class="corner br" />

      <div class="badge-content">
        <component :is="getLabel(key)" v-if="isComponent(getLabel(key))" class="badge-icon" />
        <span v-else class="badge-emoji">{{ getLabel(key) }}</span>
        <div class="badge-value">{{ formatValue(counters[key] ?? 0) }}</div>
      </div>

      <!-- ホバー時のグロウライン -->
      <div class="glow-line" />
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

  // DaisyUI トークン → ピクセル風アクセントカラー
  const tokenColors: Record<string, string> = {
    primary: '#00e5ff',
    secondary: '#ff4081',
    accent: '#69ff47',
    neutral: '#b0bec5',
    info: '#40c4ff',
    success: '#00e676',
    warning: '#ffea00',
    error: '#ff1744',
  }

  const getBadgeStyle = (key: string, index: number) => {
    const token = getPattern(key)
    const color = tokenColors[token] ?? '#00e5ff'
    return {
      '--accent': color,
      animationDelay: `${index * 0.08}s`,
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&display=swap');

  .pixel-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    padding: 10px 8px;
  }

  .pixel-badge {
    position: relative;
    width: 68px;
    height: 56px;
    background: #0a0e14;
    border: 2px solid var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: default;
    /* ピクセルっぽいシャープな影 */
    box-shadow:
      0 0 0 1px #000,
      4px 4px 0 0 color-mix(in srgb, var(--accent) 30%, transparent),
      0 0 12px color-mix(in srgb, var(--accent) 20%, transparent);
    animation: badgeDrop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition:
      box-shadow 0.15s ease,
      transform 0.15s ease;
    image-rendering: pixelated;
  }

  .pixel-badge:hover {
    transform: translate(-2px, -2px);
    box-shadow:
      0 0 0 1px #000,
      6px 6px 0 0 color-mix(in srgb, var(--accent) 40%, transparent),
      0 0 20px color-mix(in srgb, var(--accent) 40%, transparent);
  }

  /* スキャンライン */
  .scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.25) 2px,
      rgba(0, 0, 0, 0.25) 4px
    );
    pointer-events: none;
    z-index: 1;
  }

  /* コーナーの L 字デコレーション */
  .corner {
    position: absolute;
    width: 6px;
    height: 6px;
    border-color: var(--accent);
    border-style: solid;
    z-index: 3;
  }
  .corner.tl {
    top: -1px;
    left: -1px;
    border-width: 2px 0 0 2px;
  }
  .corner.tr {
    top: -1px;
    right: -1px;
    border-width: 2px 2px 0 0;
  }
  .corner.bl {
    bottom: -1px;
    left: -1px;
    border-width: 0 0 2px 2px;
  }
  .corner.br {
    bottom: -1px;
    right: -1px;
    border-width: 0 2px 2px 0;
  }

  .badge-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
  }

  .badge-icon {
    width: 16px;
    height: 16px;
    color: var(--accent);
    filter: drop-shadow(0 0 4px var(--accent));
  }

  .badge-emoji {
    font-size: 14px;
    line-height: 1;
    filter: drop-shadow(0 0 4px var(--accent));
  }

  .badge-value {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: var(--accent);
    text-shadow: 0 0 6px var(--accent);
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  /* ホバー時の上昇するグロウライン */
  .glow-line {
    position: absolute;
    bottom: -100%;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(to top, color-mix(in srgb, var(--accent) 15%, transparent), transparent);
    transition: bottom 0.25s ease;
    z-index: 1;
    pointer-events: none;
  }
  .pixel-badge:hover .glow-line {
    bottom: 0;
  }

  @keyframes badgeDrop {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
