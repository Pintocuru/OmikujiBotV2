<!-- src/MainGenerator/ui/StreamCounter/layouts/StarBurst.vue -->
<template>
  <div class="relative flex justify-center w-32 h-32" :class="`text-${colorPattern}`">
    <!-- 回転させる星レイヤー -->
    <div class="absolute inset-0 star-rotate" :class="{ spinning: isIncreasing }">
      <Star class="w-full h-full" fill="currentColor" />
    </div>

    <!-- 固定コンテンツ -->
    <div class="relative z-10 flex flex-col items-center justify-center pt-2" :class="`text-${colorPattern}-content`">
      <!-- アイコン -->
      <LabelText :label="label" />

      <!-- 数値 -->
      <div class="flex items-baseline justify-center whitespace-nowrap">
        <!-- ブラー効果付き -->
        <TransitionGroup
          name="count-blur"
          tag="span"
          class="inline-flex"
          enter-active-class="transition-all duration-500"
          enter-from-class="opacity-0 blur-sm"
          leave-to-class="opacity-0 blur-md"
          leave-active-class="absolute"
        >
          <span :key="value" class="text-4xl font-bold">
            {{ value }}
          </span>
        </TransitionGroup>
      </div>
    </div>
    <!-- ハイライト -->
    <div
      class="absolute top-8 left-8 w-8 h-6 rounded-full bg-white/40 rotate-[-20deg] pointer-events-none blur-[8px]"
    ></div>
    <!-- パーティクル -->
    <span class="sparkle sparkle-1 absolute rounded-full bg-white pointer-events-none w-3 h-3 top-4 right-5" />
    <span class="sparkle sparkle-2 absolute rounded-full bg-white pointer-events-none w-2 h-2 bottom-6 left-4" />
  </div>
</template>

<script setup lang="ts">
  import { type Component, ref, watch } from 'vue'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'
  import LabelText from './LabelText.vue'
  import { Star } from 'lucide-vue-next'

  const props = defineProps<{
    index: number
    label: string | Component
    value: string
    colorPattern: DaisyUIColorType
  }>()

  const isIncreasing = ref(false)
  const toNum = (v: string) => Number(v.replace(/,/g, ''))
  let prev = toNum(props.value)

  watch(
    () => props.value,
    (v) => {
      const next = toNum(v)
      if (next > prev) {
        isIncreasing.value = true
        setTimeout(() => (isIncreasing.value = false), 600)
      }
      prev = next
    }
  )
</script>

<style scoped>
  .star-item {
    animation:
      starPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both,
      starPulse 3.5s ease-in-out infinite 0.5s;

    filter: drop-shadow(0 3px 8px color-mix(in srgb, currentColor 60%, transparent));
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

  .sparkle {
    animation: sparkleAnim 2.5s ease-in-out infinite;
    opacity: 0;
  }

  .sparkle-1 {
    animation-delay: 0.3s;
  }

  .sparkle-2 {
    animation-delay: 1.2s;
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

  .star-rotate {
    animation: starPulse 3.5s ease-in-out infinite;
  }

  .spinning {
    animation: spinFast 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  @keyframes spinFast {
    0% {
      transform: rotate(0deg);
    }
    80% {
      transform: rotate(720deg);
    }
    100% {
      transform: rotate(740deg);
    }
  }
</style>
