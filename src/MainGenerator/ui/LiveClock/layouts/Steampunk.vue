<!-- src/MainGenerator/ui/LiveClock/layouts/Steampunk.vue -->
<template>
  <div
    class="w-xs transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    :class="isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75 translate-y-4'"
  >
    <!-- メインフレーム -->
    <div class="relative border-4 rounded-[1.5rem] overflow-hidden h-[130px] bg-base-300" :class="borderColorClass">
      <!-- リベット（四隅） -->
      <div
        v-for="position in rivetPositions"
        :key="position"
        class="absolute w-3 h-3 rounded-full border-2 bg-base-200 shadow-inner z-10"
        :class="[borderColorClass, position]"
      ></div>

      <!-- 背景の歯車 (装飾) -->
      <Cog
        class="absolute -right-4 -top-4 w-24 h-24 opacity-30 animate-spin-slow"
        :class="textColorClass"
        :stroke-width="2"
      />
      <Cog
        class="absolute -left-6 -bottom-6 w-24 h-24 opacity-30 animate-spin-reverse"
        :class="textColorClass"
        :stroke-width="2"
      />

      <!-- 蒸気パイプ（上部） -->
      <div class="absolute top-0 left-10 right-10 h-1.5 opacity-50 rounded-b-full" :class="`bg-${backFrom}`"></div>

      <div class="relative h-full flex flex-col items-center justify-center">
        <transition :name="transitionName" mode="out-in">
          <!-- 時計表示 -->
          <div v-if="!isFlipped" key="clock" class="flex flex-col items-center -mt-1">
            <!-- 圧力計風フレーム -->
            <div class="flex items-center gap-1">
              <!-- 時間ブロック -->
              <div class="flex items-baseline gap-0.5">
                <div class="bg-base-200 border-2 rounded-md px-1 shadow-inner" :class="borderColorClass">
                  <span class="countdown font-mono font-black text-5xl text-base-content">
                    <span :style="{ '--value': hours, '--digits': 2 }">
                      {{ hours }}
                    </span>
                  </span>
                </div>
              </div>

              <!-- コロン（ネジ風） -->
              <div class="flex flex-col gap-1.5 px-0.5 pb-1">
                <div
                  v-for="i in 2"
                  :key="i"
                  class="w-2 h-2 rounded-full border-2 transition-all duration-300"
                  :class="[borderColorClass, colonVisible ? borderColorClass : 'bg-transparent']"
                ></div>
              </div>

              <!-- 分ブロック -->
              <div class="flex items-baseline gap-0.5">
                <div class="bg-base-200 border-2 rounded-md px-1 shadow-inner" :class="borderColorClass">
                  <span class="countdown font-mono font-black text-5xl text-base-content">
                    <span :style="{ '--value': minutes, '--digits': 2 }">
                      {{ minutes }}
                    </span>
                  </span>
                </div>
              </div>

              <!-- 秒（オプション） -->
              <div v-if="settings.isSecond" class="flex items-end pb-0.5 pl-1">
                <div class="bg-base-200 border rounded px-1 py-0.5 shadow-inner" :class="textColorClass">
                  <span class="countdown font-mono font-bold text-3xl text-base-content leading-none">
                    <span :style="{ '--value': seconds, '--digits': 2 }">
                      {{ seconds }}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <!-- 日付表示 -->
            <div
              v-if="settings.isDate"
              class="flex items-center justify-center text-base font-mono font-bold"
              :class="`text-${backFrom}`"
            >
              <span class="text-lg text-base-content" :class="borderColorClass">
                {{ year }}/{{ month }}/{{ date }} ({{ day }})
              </span>
            </div>

            <!-- ゲージバー風メッセージ -->
            <div v-if="defaultMessage" class="w-full">
              <div class="relative rounded bg-base-100 px-3 py-0.5 overflow-hidden" :class="borderColorClass">
                <!-- 装飾ライン -->
                <div class="absolute left-0 top-0 bottom-0 w-1 opacity-70" :class="`bg-${backFrom}`"></div>
                <div class="absolute right-0 top-0 bottom-0 w-1 opacity-70" :class="`bg-${backFrom}`"></div>
                <div class="text-base font-bold text-center line-clamp-1 text-base-content/70 pl-1">
                  <RotatingMessage :message="defaultMessage" />
                </div>
              </div>
            </div>
          </div>

          <!-- メッセージ表示 -->
          <div v-else key="msg" class="w-full px-6 flex flex-col items-center gap-2">
            <!-- スチームパンク風テキストフレーム -->
            <div class="relative border rounded-lg bg-base-200/70 p-1 w-full" :class="borderColorClass">
              <p
                class="text-xl font-bold leading-tight text-center line-clamp-3 text-base-content/80"
                v-html="currentMsg"
              ></p>
            </div>
            <!-- 圧力インジケーター風ドット -->
            <div class="flex gap-2 items-center">
              <div class="w-1 h-1 rounded-full" :class="`bg-${backFrom}`"></div>
              <div
                v-for="i in 3"
                :key="i"
                class="w-2 h-2 rounded-full border animate-bounce"
                :class="borderColorClass"
                :style="{ animationDelay: `${i * 0.25}s` }"
              ></div>
              <div class="w-1 h-1 rounded-full" :class="`bg-${backFrom}`"></div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 蒸気パイプ（下部） -->
      <div class="absolute bottom-0 left-16 right-16 h-1.5 opacity-50 rounded-t-full" :class="`bg-${backFrom}`"></div>

      <!-- サイドバルブ（左右共通） -->
      <div
        v-for="side in sidePositions"
        :key="side.side"
        class="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
        :class="side.class"
      >
        <div class="w-4 h-2 rounded-r-sm opacity-70" :class="`bg-${backFrom}`"></div>
        <div class="w-5 h-3 rounded-r-md shadow opacity-70" :class="`bg-${backFrom}`"></div>
        <div class="w-4 h-2 rounded-r-sm opacity-70" :class="`bg-${backFrom}`"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { Cog } from 'lucide-vue-next'
  import type { LiveClockType } from '@/types/OmikujiData/'
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

  // 動的クラスの一元管理
  const borderColorClass = computed(() => `border-${props.settings.color.backFrom}`)
  const textColorClass = computed(() => `text-${props.settings.color.backTo}`)

  // リベットの位置クラス
  const rivetPositions = ['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2']

  // サイドバルブの位置設定
  const sidePositions = [
    { side: 'left', class: '-left-2' },
    { side: 'right', class: '-right-2' },
  ]

  // トランジション名
  const transitionName = ref('steam-up')
  watch(
    () => props.isFlipped,
    (next) => {
      transitionName.value = next ? 'steam-up' : 'piston-down'
    }
  )
</script>

<style scoped>
  /* 歯車回転アニメーション */
  .animate-spin-slow {
    animation: spin 8s linear infinite;
  }
  .animate-spin-reverse {
    animation: spin 10s linear infinite reverse;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* ─── steam-up: 時計 → メッセージ ─────────────────────────
     退場: 上へスケールアップしながら蒸気のようにフェードアウト
     登場: 下から圧力で押し上げられるようにバウンス登場          */
  .steam-up-leave-active {
    transition: all 0.28s cubic-bezier(0.4, 0, 1, 1);
  }
  .steam-up-leave-to {
    opacity: 0;
    transform: translateY(-18px) scaleY(0.7) scaleX(1.1);
    filter: blur(6px);
  }

  .steam-up-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .steam-up-enter-from {
    opacity: 0;
    transform: translateY(24px) scale(0.85);
    filter: blur(4px);
  }

  /* ─── piston-down: メッセージ → 時計 ──────────────────────
     退場: 下に沈んでスケールダウン（ピストンが戻る）
     登場: 上からガコンと降りてくる（歯車が噛み合う衝撃）      */
  .piston-down-leave-active {
    transition: all 0.28s cubic-bezier(0.4, 0, 0.6, 1);
  }
  .piston-down-leave-to {
    opacity: 0;
    transform: translateY(18px) scaleY(0.75) scaleX(1.05);
    filter: blur(4px);
  }

  .piston-down-enter-active {
    /* 少し硬めのバウンスで「重い歯車が落ちてくる」質感 */
    transition: all 0.48s cubic-bezier(0.22, 1.8, 0.36, 1);
  }
  .piston-down-enter-from {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
    filter: blur(3px);
  }
</style>
