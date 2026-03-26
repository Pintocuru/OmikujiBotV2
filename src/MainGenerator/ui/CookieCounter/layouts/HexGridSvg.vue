<!-- src/MainGenerator/ui/StreamCounter/layouts/HexGridSvg.vue -->
<template>
  <svg class="absolute w-full h-full" viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg">
    <!-- 背景六角形 -->
    <polygon
      points="50,2 97,27 97,88 50,113 3,88 3,27"
      :fill="`url(#hex-bg-${colorPattern})`"
      :stroke="`url(#hex-stroke-${colorPattern})`"
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
      <linearGradient :id="`hex-bg-${colorPattern}`" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :stop-color="hexColors1" stop-opacity="0.22" />
        <stop offset="100%" :stop-color="hexColors2" stop-opacity="0.08" />
      </linearGradient>
      <linearGradient :id="`hex-stroke-${colorPattern}`" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :stop-color="hexColors1" stop-opacity="0.9" />
        <stop offset="100%" :stop-color="hexColors2" stop-opacity="0.4" />
      </linearGradient>
    </defs>
  </svg>
</template>
<script setup lang="ts">
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

  defineProps<{
    hexColors1: string
    hexColors2: string
    colorPattern: DaisyUIColorType
  }>()
</script>
