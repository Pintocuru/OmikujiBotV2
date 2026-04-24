<!-- src/MainGenerator/ui/LiveClock/layouts/ClearGlass.vue -->
<template>
  <div class="flipper-wrap w-full max-w-md" :class="{ 'is-mounted': isMounted }">
    <div class="flipper-inner" :class="{ 'is-flipped': isFlipped }">
      <!-- 表面（時計側） -->
      <div class="flip-card glass-card rounded-2xl">
        <!-- ガラス色調レイヤー（backFrom カラーを薄く乗せる） -->
        <div class="absolute inset-0 rounded-2xl color-tint-from pointer-events-none"></div>
        <!-- 上辺ハイライト -->
        <div
          class="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none"
        ></div>
        <!-- シマーアニメ -->
        <div class="shimmer-overlay absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div class="shimmer-beam"></div>
        </div>

        <div class="card-body items-center justify-center gap-0.5 p-2 relative">
          <!-- 時計 -->
          <div class="flex text-7xl font-black tracking-tight -mt-3 drop-shadow-sm" :class="`text-${backFrom}`">
            <!-- 時刻表示 -->
            <span>{{ hours }}</span>
            <span class="mx-0.5 transition-opacity duration-75" :class="{ 'opacity-0': !colonVisible }">:</span>
            <span>{{ minutes }}</span>
            <!-- 秒表示 -->
            <span v-if="settings.isSecond" class="pl-3 mt-4 text-5xl leading-none">{{ seconds }}</span>
          </div>

          <!-- 日付表示 -->
          <div
            v-if="settings.isDate"
            class="flex items-center justify-center text-lg font-bold -mt-1"
            :class="`text-${backFrom}`"
          >
            {{ year }}/{{ month }}/{{ date }} ({{ day }})
          </div>

          <!-- 下部メッセージ -->
          <div
            v-if="defaultMessage"
            class="text-lg font-bold tracking-normal line-clamp-1 drop-shadow-sm"
            :class="`text-${backTo}`"
          >
            <RotatingMessage :message="defaultMessage" />
          </div>
        </div>
      </div>

      <!-- 裏面（メッセージ側） -->
      <div class="flip-card face-back glass-card rounded-2xl">
        <div class="absolute inset-0 rounded-2xl pointer-events-none"></div>
        <div
          class="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none"
        ></div>
        <div class="shimmer-overlay absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div class="shimmer-beam shimmer-beam--slow"></div>
        </div>
        <div class="card-body items-center justify-center p-2 gap-1 relative">
          <p
            class="text-2xl font-bold text-center break-words line-clamp-2 drop-shadow-sm"
            :class="`text-${backFrom}`"
            v-html="currentMsg"
          ></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { LiveClockType } from '@/types/OmikujiData/'
  import { useLiveClockTime } from '../composables/useLiveClockTime'
  import RotatingMessage from '../common/RotatingMessage.vue'

  const props = defineProps<{
    settings: LiveClockType
    defaultMessage: string
    isMounted: boolean
    isFlipped: boolean
    currentMsg: string
  }>()

  const { hours, minutes, seconds, colonVisible, year, month, date, day } = useLiveClockTime()

  const backFrom = computed(() => props.settings.color.backFrom)
  const backTo = computed(() => props.settings.color.backTo)
</script>

<style scoped>
  /* =====================
   カード基本スタイル
   ===================== */
  .glass-card {
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-bottom-color: rgba(255, 255, 255, 0.12);
    border-right-color: rgba(255, 255, 255, 0.12);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.45),
      inset 0 -1px 0 rgba(0, 0, 0, 0.12),
      0 4px 24px rgba(0, 0, 0, 0.18),
      0 1px 4px rgba(0, 0, 0, 0.12);
  }

  /* =====================
   シマーアニメーション
   ===================== */
  .shimmer-beam {
    position: absolute;
    top: -60%;
    left: -80%;
    width: 50%;
    height: 220%;
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(255, 255, 255, 0.18) 50%,
      rgba(255, 255, 255, 0.06) 60%,
      transparent 70%
    );
    transform: skewX(-15deg);
    animation: shimmerSweep 12s ease-in-out infinite;
  }

  .shimmer-beam--slow {
    animation-duration: 18s;
    animation-delay: -6s;
  }

  @keyframes shimmerSweep {
    0% {
      left: -80%;
      opacity: 0;
    }
    8% {
      opacity: 1;
    }
    40% {
      left: 140%;
      opacity: 0.8;
    }
    50% {
      left: 140%;
      opacity: 0;
    }
    100% {
      left: 140%;
      opacity: 0;
    }
  }

  /* =====================
   フリップ時の追加光沢
   ===================== */
  .flipper-inner.is-flipped .flip-card:not(.face-back) .shimmer-beam,
  .flipper-inner:not(.is-flipped) .face-back .shimmer-beam {
    animation-play-state: paused;
  }

  /* フリップ直後にビームを一度だけ走らせる */
  .flipper-inner.is-flipped .face-back .shimmer-beam {
    animation: shimmerFlip 0.9s ease-out 0.3s both;
  }

  @keyframes shimmerFlip {
    0% {
      left: -80%;
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      left: 160%;
      opacity: 0;
    }
  }

  /* =====================
   マウントアニメーション
   ===================== */
  .flipper-wrap {
    display: inline-block;
    opacity: 0;
    transform: scale(0.48) translateY(16px);
  }

  .flipper-wrap.is-mounted {
    animation: bounceIn 0.62s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.48) translateY(16px);
    }
    55% {
      opacity: 1;
      transform: scale(1.05) translateY(-4px);
    }
    78% {
      transform: scale(0.97) translateY(1px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  /* =====================
   フリップ
   ===================== */
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
    min-width: 180px;
  }

  .face-back {
    transform: rotateY(180deg);
  }
</style>
