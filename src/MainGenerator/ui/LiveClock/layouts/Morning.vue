<!-- src/MainGenerator/ui/LiveClock/layouts/Morning.vue -->
<template>
  <div
    class="w-80 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    :class="isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75 translate-y-4'"
  >
    <!-- メインフレーム -->
    <div
      class="relative backdrop-blur-sm border-2 border-base-300 rounded-[2.5rem] overflow-hidden h-[120px] bg-base-200"
      :class="`border-${backFrom}`"
    >
      <!-- グラデーションオーブ（第一カラー） -->
      <div class="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-60" :class="`bg-${backFrom}`"></div>

      <!-- グラデーションオーブ（第二カラー） -->
      <div class="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-60 bg-Secondary"></div>

      <div class="relative h-full flex flex-col items-center justify-center pt-2">
        <transition name="magical-pop" mode="out-in">
          <!-- 時計 -->
          <div v-if="!isFlipped" class="-mt-4 flex flex-col items-center">
            <div key="clock">
              <!-- 時刻表示 -->
              <div
                class="flex items-center justify-center font-['Quicksand'] font-bold text-7xl tracking-tighter"
                :class="`text-${backFrom}`"
              >
                <span>{{ hours }}</span>

                <span
                  class="mx-1.5 pb-2 transition-opacity duration-300"
                  :class="{ 'opacity-100': colonVisible, 'opacity-20': !colonVisible }"
                >
                  :
                </span>

                <span>{{ minutes }}</span>

                <!-- 秒表示 -->
                <span v-if="settings.isSecond" class="pl-3 mt-4 text-5xl leading-none">{{ seconds }}</span>
              </div>

              <!-- 日付表示 -->
              <div
                v-if="settings.isDate && !isFlipped"
                class="flex items-center justify-center font-['Quicksand'] text-lg font-bold -mt-3"
                :class="`text-${backFrom}`"
              >
                {{ year }}/{{ month }}/{{ date }} ({{ day }})
              </div>
            </div>

            <!-- 下部メッセージ -->
            <div
              v-if="defaultMessage"
              class="px-3 rounded-full border bg-base-200 shadow-sm"
              :class="`border-${backTo}`"
            >
              <div class="text-sm font-black gap-1 text-base-content/70 line-clamp-1">
                <RotatingMessage :message="defaultMessage" />
              </div>
            </div>
          </div>

          <!-- メッセージ -->
          <div v-else key="msg" class="w-full px-6 flex flex-col items-center">
            <p
              class="text-xl font-bold leading-tight text-center line-clamp-3 drop-shadow-sm text-base-content/70"
              v-html="currentMsg"
            ></p>

            <!-- タイピングドット（第二カラー） -->
            <div class="mt-2 flex gap-1">
              <div
                v-for="i in 3"
                :key="i"
                class="w-1.5 h-1.5 rounded-full animate-bounce"
                :class="`bg-${backTo}`"
                :style="{ animationDelay: `${i * 0.2}s` }"
              ></div>
            </div>
          </div>
        </transition>
      </div>

      <!-- サイドリボン（第一カラー） -->
      <div
        class="absolute top-1/2 -left-1 -translate-y-1/2 w-4 h-10 rounded-r-full shadow-inner"
        :class="ribbonClass"
      ></div>
      <div
        class="absolute top-1/2 -right-1 -translate-y-1/2 w-4 h-10 rounded-l-full shadow-inner"
        :class="ribbonClass"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { LiveClockType } from '@/types/OmikujiData/'
  import { useLiveClockTime } from '../composables/useLiveClockTime'
  import { computed } from 'vue'
  import RotatingMessage from '../common/RotatingMessage.vue'

  const props = defineProps<{
    settings: LiveClockType
    defaultMessage: string
    isMounted: boolean
    isFlipped: boolean
    currentMsg: string
  }>()

  const { hours, minutes, seconds, colonVisible, year, month, date, day } = useLiveClockTime()

  // DaisyUI カラーキー
  const backFrom = computed(() => props.settings.color.backFrom)
  const backTo = computed(() => props.settings.color.backTo)

  // サイドリボンカラー
  const ribbonBgClassMap: Record<string, string> = {
    primary: 'bg-primary/70',
    secondary: 'bg-secondary/70',
    accent: 'bg-accent/70',
    neutral: 'bg-neutral/70',
    info: 'bg-info/70',
    success: 'bg-success/70',
    warning: 'bg-warning/70',
    error: 'bg-error/70',
  }
  const ribbonClass = computed(() => ribbonBgClassMap[backFrom.value] ?? 'bg-primary/70')
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
