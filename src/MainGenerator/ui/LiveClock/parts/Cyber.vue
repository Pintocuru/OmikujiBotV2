<template>
  <div
    class="w-full max-w-[400px] transition-all duration-500 ease-out"
    :class="{ 'opacity-100 translate-x-0': isMounted, 'opacity-0 -translate-x-5': !isMounted }"
  >
    <!-- メインフレーム: クリップパスとグロー効果はCSSで制御 -->
    <div
      class="cyber-frame relative bg-slate-950 border border-cyan-500 p-3 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)]"
    >
      <!-- 背景のグリッドライン演出 -->
      <div
        class="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[length:100%_4px]"
      ></div>

      <div class="relative h-20 flex items-center">
        <transition name="cyber-slide" mode="out-in">
          <!-- 時計表示面 -->
          <div v-if="!isFlipped" key="clock" class="w-full">
            <div
              class="flex items-baseline font-mono text-6xl font-black leading-none tracking-tighter text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
            >
              <span>{{ hours }}</span>
              <span class="mx-1 transition-opacity duration-100" :class="{ 'opacity-20': !colonVisible }">:</span>
              <span>{{ minutes }}</span>
            </div>
            <div class="mt-1 flex items-center gap-2">
              <div class="bg-cyan-900 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider">
                ON_AIR
              </div>
              <div class="text-xs text-cyan-400/80 truncate font-medium" v-html="defaultMessage"></div>
            </div>
          </div>

          <!-- メッセージ表示面 -->
          <div v-else key="msg" class="w-full text-pink-500">
            <div class="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] mb-1">
              <span class="animate-pulse">▶▶</span>
              <span>SIGNAL_RECEIVED</span>
            </div>
            <p class="text-xl font-bold leading-tight h-10 line-clamp-2 italic" v-html="currentMsg"></p>
            <div class="mt-2 w-full h-0.5 bg-pink-900/30 relative overflow-hidden">
              <div class="absolute inset-0 bg-pink-500 w-1/3 cyber-progress-anim"></div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 装飾用の角パーツ -->
      <div class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
      <div class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>
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
  /* サイバーパンク特有の形状 (右下を斜めにカット) */
  .cyber-frame {
    clip-path: polygon(0 0, 100% 0, 100% 75%, 95% 100%, 0 100%);
  }

  /* 独自のプログレスバーアニメーション */
  .cyber-progress-anim {
    animation: cyber-data-move 2s infinite linear;
  }

  @keyframes cyber-data-move {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(300%);
    }
  }

  /* アニメーション: スライド (Tailwindのtransitionでは表現しきれないカスタム挙動) */
  .cyber-slide-enter-active,
  .cyber-slide-leave-active {
    transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .cyber-slide-enter-from {
    opacity: 0;
    transform: translateX(20px) skewX(-10deg);
  }

  .cyber-slide-leave-to {
    opacity: 0;
    transform: translateX(-20px) skewX(10deg);
  }
</style>
