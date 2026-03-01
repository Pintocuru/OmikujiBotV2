<template>
  <div class="flex flex-wrap justify-center gap-3 px-2 py-3">
    <div v-for="key in allKeys" :key="key" class="relative w-[72px] h-[72px]">
      <div class="petal-inner" :class="`text-${getPattern(key)}`">
        <!-- 中身 -->
        <div class="w-full h-full flex flex-col items-center justify-center" :class="`text-${getPattern(key)}-content`">
          <!-- アイコン -->
          <component :is="getLabel(key)" v-if="isComponent(getLabel(key))" class="icon-svg" />

          <!-- ラベル -->
          <span v-else class="icon-text font-bold truncate">
            {{ getLabel(key) }}
          </span>

          <!-- 数値 -->
          <div class="petal-value text-xl font-bold">
            {{ formatValue(counters[key] ?? 0) }}
          </div>
        </div>

        <!-- ハイライト -->
        <div class="absolute top-2 left-3 w-7 h-3 rounded-full bg-white/40 rotate-[-20deg] pointer-events-none"></div>
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
</script>

<style scoped>
  .petal-inner {
    width: 100%;
    height: 100%;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;

    /* DaisyUIテーマ色を使用 */
    background: linear-gradient(135deg, currentColor, color-mix(in srgb, currentColor 70%, white));

    box-shadow:
      0 4px 16px color-mix(in srgb, currentColor 40%, transparent),
      inset 0 1px 1px rgba(255, 255, 255, 0.5);

    animation: petalFloat 4s ease-in-out infinite;
    transition: transform 0.2s ease;
  }

  .flex > div:nth-child(2n) .petal-inner {
    border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
    animation-delay: -2s;
  }

  .flex > div:nth-child(3n) .petal-inner {
    border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%;
    animation-delay: -1s;
  }

  /* コンテンツ */
  .icon-svg {
    color: hsl(var(--pc));
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }

  .icon-text {
    color: hsl(var(--pc));
  }

  .petal-value {
    color: hsl(var(--pc));
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  }

  @keyframes petalFloat {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-4px) rotate(1.5deg);
    }
  }
</style>
