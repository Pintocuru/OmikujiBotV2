<template>
  <div class="w-full max-w-md transition-all duration-500 ease-out">
    <div class="cyber-frame relative bg-base-200 border border-primary px-4 overflow-hidden">
      <div class="relative h-24 flex items-center">
        <transition name="cyber-slide" mode="out-in">
          <!-- 時計表示 -->
          <div v-if="!isFlipped" key="clock" class="w-full">
            <div
              class="flex items-baseline font-mono text-6xl font-black leading-none tracking-tighter text-primary drop-shadow-[0_0_8px_var(--fallback-p,theme(colors.primary))]"
            >
              <span>{{ hours }}</span>
              <span class="mx-1 transition-opacity duration-100" :class="{ 'opacity-20': !colonVisible }">:</span>
              <span>{{ minutes }}</span>

              <span v-if="settings.isSecond" class="pl-3 mt-4 text-5xl leading-none">{{ seconds }}</span>
            </div>

            <div class="flex items-center gap-2">
              <div class="bg-accent text-accent-content px-1 text-sm rounded-sm font-bold tracking-wider">ON_AIR</div>
              <div class="text-lg text-accent truncate font-medium line-clamp-1" v-html="defaultMessage"></div>
            </div>
          </div>

          <!-- メッセージ表示 -->
          <div v-else key="msg" class="w-full text-secondary">
            <div class="flex items-center gap-2 text-sm tracking-[0.2em]">
              <span class="animate-pulse">▶▶</span>
              <span>SIGNAL_RECEIVED</span>
            </div>

            <p class="text-2xl font-bold leading-tight h-14 line-clamp-2 italic" v-html="currentMsg"></p>

            <div class="mt-2 w-full bg-secondary/30 relative overflow-hidden">
              <div class="absolute inset-0 bg-secondary w-1/3 cyber-progress-anim"></div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 角パーツ -->
      <div class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary"></div>
      <div class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary"></div>
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

  const { hours, minutes, seconds, colonVisible } = useLiveClockTime()
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
