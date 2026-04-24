<!-- src/MainGenerator/ui/LiveClock/layouts/Disco.vue -->
<template>
  <div
    class="w-[340px] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    :class="isMounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10'"
  >
    <!-- 外枠：グラデーションアニメーション -->
    <div class="disco-border-anim p-1 rounded-[2rem]">
      <!-- 内側：ガラス質感の背景 -->
      <div
        class="relative bg-black/80 backdrop-blur-md rounded-[1.8rem] h-[110px] flex items-center justify-center overflow-hidden border border-white/10"
      >
        <!-- キラキラ光る背景パーティクル -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute w-2 h-2 bg-white rounded-full blur-[1px] animate-ping left-[10%] top-[20%]"></div>
          <div
            class="absolute w-1 h-1 bg-purple-400 rounded-full blur-[1px] animate-ping left-[80%] top-[70%] animation-delay-500"
          ></div>
          <div
            class="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full blur-[1px] animate-ping left-[50%] top-[10%] animation-delay-1000"
          ></div>
        </div>

        <transition name="disco-pop" mode="out-in">
          <!-- 時計表示面 -->
          <div v-if="!isFlipped" key="clock" class="text-center">
            <div
              class="flex items-center justify-center text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]"
            >
              <span>{{ hours }}</span>
              <span
                class="mx-1 transition-opacity duration-200"
                :class="{ 'opacity-100': colonVisible, 'opacity-0': !colonVisible }"
                >:</span
              >
              <span>{{ minutes }}</span>
              <span v-if="settings.isSecond" class="pl-3 mt-4 text-5xl leading-none">{{ seconds }}</span>
            </div>

            <!-- 日付表示 -->
            <div
              v-if="settings.isDate && !isFlipped"
              class="flex items-center justify-center text-lg font-bold -mt-1 -mb-2"
            >
              {{ year }}/{{ month }}/{{ date }} ({{ day }})
            </div>

            <div v-if="defaultMessage" class="flex items-center justify-center gap-1">
              <span class="text-sm text-yellow-400 animate-bounce">★</span>
              <div class="text-base font-bold text-yellow-400 uppercase tracking-widest drop-shadow-sm line-clamp-1">
                <RotatingMessage :message="defaultMessage" />
              </div>
              <span class="text-sm text-yellow-400 animate-bounce">★</span>
            </div>
          </div>

          <!-- メッセージ表示面 -->
          <div v-else key="msg" class="w-full text-center">
            <p
              class="text-xl font-black leading-tight text-white drop-shadow-[0_0_12px_rgba(232,121,249,0.8)] line-clamp-3"
              v-html="currentMsg"
            ></p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { LiveClockType } from '@/types/OmikujiData/'
  import { useLiveClockTime } from '../composables/useLiveClockTime'
  import RotatingMessage from '../common/RotatingMessage.vue'

  defineProps<{
    settings: LiveClockType
    defaultMessage: string
    isMounted: boolean
    isFlipped: boolean
    currentMsg: string
  }>()

  const { hours, minutes, seconds, colonVisible, year, month, date, day } = useLiveClockTime()
</script>

<style scoped>
  /* 外枠の回転グラデーション */
  .disco-border-anim {
    background: linear-gradient(135deg, #f06 0%, #90f 25%, #0cf 50%, #90f 75%, #f06 100%);
    background-size: 400% 400%;
    animation: disco-gradient 4s linear infinite;
  }

  @keyframes disco-gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* ポップアップアニメーション */
  .disco-pop-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .disco-pop-leave-active {
    transition: all 0.3s ease-in;
  }

  .disco-pop-enter-from {
    opacity: 0;
    transform: scale(0.5) translateY(10px);
  }
  .disco-pop-leave-to {
    opacity: 0;
    transform: scale(1.3);
  }

  .animation-delay-500 {
    animation-delay: 500ms;
  }
  .animation-delay-1000 {
    animation-delay: 1000ms;
  }
</style>
