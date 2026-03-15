<!-- src/MainGenerator/ui/LiveClock/parts/Standard.vue -->
<template>
  <div class="flipper-wrap" :class="{ 'is-mounted': isMounted }">
    <div class="flipper-inner" :class="{ 'is-flipped': isFlipped }">
      <!-- 表面: 時計 -->
      <div class="flip-card face-front card bg-base-100 shadow-xl">
        <div class="card-body items-center justify-center py-5 px-10 gap-1">
          <div
            class="flex items-baseline font-black tabular-nums text-base-content"
            style="font-size: 5.5rem; line-height: 1.05; letter-spacing: -0.02em"
          >
            <span>{{ hours }}</span>
            <span class="text-primary mx-1 transition-opacity duration-75" :class="{ 'opacity-0': !colonVisible }"
              >:</span
            >
            <span>{{ minutes }}</span>
          </div>

          <div class="text-xs font-bold tracking-widest text-base-content/50" v-html="defaultMessage" />
        </div>
      </div>

      <!-- 裏面: メッセージ -->
      <div class="flip-card face-back card bg-base-100 shadow-xl">
        <div class="card-body items-center justify-center py-5 px-10 gap-2">
          <span class="text-3xl">💬</span>
          <p class="text-lg font-bold text-base-content text-center leading-snug m-0">
            {{ currentMsg }}
          </p>
          <div class="text-xs font-bold tracking-widest text-base-content/50">BOT MESSAGE</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { SettingsClockType } from '@/types/OmikujiData/'
  import { useLiveClockTime } from '../composables/useLiveClockTime'

  defineProps<{
    settings: SettingsClockType
    defaultMessage: string
    isMounted: boolean
    isFlipped: boolean
    currentMsg: string
  }>()

  const { hours, minutes, colonVisible } = useLiveClockTime()
</script>

<style scoped>
  .flipper-wrap {
    display: inline-block;
    opacity: 0;
    transform: scale(0.55) translateY(24px);
  }

  .flipper-wrap.is-mounted {
    animation: bounceIn 0.72s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.55) translateY(24px);
    }
    55% {
      opacity: 1;
      transform: scale(1.07) translateY(-7px);
    }
    78% {
      transform: scale(0.97) translateY(2px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .flipper-inner {
    display: grid;
    perspective: 900px;
    transform-style: preserve-3d;
    transition: transform 0.62s cubic-bezier(0.45, 0.05, 0.55, 0.95);
  }

  .flipper-inner.is-flipped {
    transform: rotateY(180deg);
  }

  .flip-card {
    grid-area: 1 / 1;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    min-width: 280px;
  }

  .face-back {
    transform: rotateY(180deg);
  }
</style>
