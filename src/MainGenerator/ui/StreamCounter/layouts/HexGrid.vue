<!-- src/MainGenerator/ui/StreamCounter/layouts/HexGrid.vue -->
<template>
  <div class="relative w-32 h-32 hex-wrap" :class="index % 2 === 1 && 'mt-5'" :style="hexStyle">
    <!-- 背景六角形（絶対配置） -->
    <HexGridSvg
      class="absolute inset-0 w-full h-full"
      :hexColors1="getHexColors()[0]"
      :hexColors2="getHexColors()[1]"
      :colorPattern="colorPattern"
    />

    <!-- 中身（絶対配置） -->
    <div
      class="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-2"
      :class="`text-${colorPattern}-content`"
    >
      <!-- アイコン -->
      <LabelText :label="label" />

      <!-- カウント表示 -->
      <div class="flex items-baseline justify-center whitespace-nowrap">
        <TransitionGroup
          name="count"
          tag="span"
          class="inline-flex"
          enter-active-class="transition-all duration-500"
          enter-from-class="opacity-0 scale-90 -translate-y-5"
          leave-to-class="opacity-0 scale-90 translate-y-5"
          leave-active-class="absolute"
        >
          <span :key="value" class="text-3xl font-bold transition-all duration-300" :class="[textClass]">
            {{ value }}
          </span>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'
  import HexGridSvg from './HexGridSvg.vue'
  import { type Component, computed } from 'vue'
  import LabelText from './LabelText.vue'

  const props = defineProps<{
    index: number
    label: string | Component
    value: string
    colorPattern: DaisyUIColorType
  }>()

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

  const getHexColors = (): [string, string] => {
    const token = props.colorPattern
    return hexColorMap[token] ?? ['#38bdf8', '#0369a1']
  }

  const hexStyle = computed(() => ({
    '--hex-glow': getHexColors()[0],
    animationDelay: `${props.index * 0.1}s`,
  }))

  const colorToken = computed(() => props.colorPattern || 'primary')

  // テキストカラー
  const textClass = computed(() => `text-${colorToken.value}`)
</script>

<style scoped>
  .hex-wrap {
    animation: hexReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    filter: drop-shadow(0 2px 8px color-mix(in srgb, var(--hex-glow) 30%, transparent));
    transition:
      filter 0.2s ease,
      transform 0.2s ease;
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
