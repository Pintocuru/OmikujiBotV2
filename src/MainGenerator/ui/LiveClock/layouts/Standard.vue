<!-- src/MainGenerator/ui/LiveClock/parts/Standard.vue -->
<template>
  <div class="flipper-wrap w-full max-w-md" :class="{ 'is-mounted': isMounted }">
    <div class="flipper-inner" :class="{ 'is-flipped': isFlipped }">
      <!-- 表面 -->
      <div
        class="flip-card card shadow-xl border border-y-4 border-current/25"
        :class="uiMap.bubble.class"
        :style="uiMap.bubble.style"
      >
        <div class="card-body items-center justify-center gap-0.5 p-2">
          <div class="flex text-7xl font-black tracking-wide -mt-3" :class="uiMap.text.class" :style="uiMap.text.style">
            <span>{{ hours }}</span>
            <span class="mx-0.5 transition-opacity duration-75" :class="{ 'opacity-0': !colonVisible }">:</span>
            <span>{{ minutes }}</span>
          </div>

          <div class="text-lg font-bold tracking-wide opacity-80 mt-1 line-clamp-1" v-html="defaultMessage" />
        </div>
      </div>

      <!-- 裏面 -->
      <div
        class="flip-card face-back card shadow-xl border border-y-4 border-current/25"
        :class="uiMap.bubble.class"
        :style="uiMap.bubble.style"
      >
        <div class="card-body items-center justify-center p-2 gap-1">
          <p
            class="text-2xl font-bold text-center break-words line-clamp-2"
            :class="uiMap.text.class"
            :style="uiMap.text.style"
            v-html="currentMsg"
          ></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { SettingsClockType } from '@/types/OmikujiData/'
  import { useLiveClockTime } from '../composables/useLiveClockTime'
  import { createUiMap } from '../../CommentBubble/composables/UiBubbleMap'
  import { computed } from 'vue'

  const props = defineProps<{
    settings: SettingsClockType
    defaultMessage: string
    isMounted: boolean
    isFlipped: boolean
    currentMsg: string
  }>()

  const { hours, minutes, colonVisible } = useLiveClockTime()
  const uiMap = computed(() => createUiMap({ color: props.settings.color }))
</script>

<style scoped>
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
    min-width: 180px; /* ← コンパクト化 */
  }

  .face-back {
    transform: rotateY(180deg);
  }
</style>
