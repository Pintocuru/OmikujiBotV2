<template>
  <div
    class="w-full max-w-xs transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    :class="isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75 translate-y-4'"
  >
    <!-- メインフレーム -->
    <div
      class="relative backdrop-blur-sm border-2 border-primary border-base-300 rounded-[2.5rem] overflow-hidden h-[120px] bg-base-200"
    >
      <!-- グラデーションオーブ -->
      <div class="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-60 bg-primary"></div>

      <div class="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-60 bg-secondary"></div>

      <div class="relative h-full flex flex-col items-center justify-center pt-2">
        <transition name="magical-pop" mode="out-in">
          <!-- 時計 -->
          <div v-if="!isFlipped" key="clock" class="-mt-4 flex flex-col items-center">
            <div
              class="flex items-center justify-center font-['Quicksand'] font-bold text-7xl tracking-tighter text-primary-content"
            >
              <span>{{ hours }}</span>

              <span
                class="mx-1.5 pb-2 transition-opacity duration-300"
                :class="{ 'opacity-100': colonVisible, 'opacity-20': !colonVisible }"
              >
                :
              </span>

              <span>{{ minutes }}</span>
            </div>

            <!-- 下部メッセージ -->
            <div class="px-3 rounded-full border border-accent/70 bg-base-200 shadow-sm">
              <div class="text-sm font-black flex items-center gap-1 text-base-content" :class="uiMap.text.class">
                <span class="text-xs">✨</span>
                <span class="line-clamp-1" v-html="defaultMessage"></span>
                <span class="text-xs">✨</span>
              </div>
            </div>
          </div>

          <!-- メッセージ -->
          <div v-else key="msg" class="w-full px-6 flex flex-col items-center">
            <p
              class="text-xl font-bold leading-tight text-center line-clamp-3 drop-shadow-sm text-base-content"
              v-html="currentMsg"
            ></p>

            <!-- タイピングドット -->
            <div class="mt-2 flex gap-1">
              <div
                v-for="i in 3"
                :key="i"
                class="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
                :style="{ animationDelay: `${i * 0.2}s` }"
              ></div>
            </div>
          </div>
        </transition>
      </div>

      <!-- サイドリボン -->
      <div class="absolute top-1/2 -left-1 -translate-y-1/2 w-4 h-10 bg-primary/70 rounded-r-full shadow-inner"></div>
      <div class="absolute top-1/2 -right-1 -translate-y-1/2 w-4 h-10 bg-primary/70 rounded-l-full shadow-inner"></div>
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
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@700&display=swap');

  /* 魔法のようなポップアニメーション */
  .magical-pop-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .magical-pop-leave-active {
    transition: all 0.3s ease-in;
  }

  .magical-pop-enter-from {
    opacity: 0;
    transform: scale(0.6) translateY(20px) rotate(-5deg);
    filter: blur(8px);
  }
  .magical-pop-leave-to {
    opacity: 0;
    transform: scale(1.2) rotate(5deg);
    filter: blur(8px);
  }

  .animate-spin-slow {
    animation: spin 6s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
