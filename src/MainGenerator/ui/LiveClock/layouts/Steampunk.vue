<!-- src/MainGenerator/ui/LiveClock/layouts/Steampunk.vue -->
<template>
  <div
    class="w-full max-w-xs transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    :class="isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75 translate-y-4'"
  >
    <!-- メインフレーム -->
    <div
      class="relative border-4 rounded-[1.5rem] overflow-hidden h-[130px] border-primary bg-base-300"
      style="
        box-shadow:
          inset 0 2px 8px rgba(0, 0, 0, 0.5),
          0 0 20px rgba(0, 0, 0, 0.4);
      "
    >
      <!-- リベット（四隅） -->
      <div
        class="absolute top-2 left-2 w-3 h-3 rounded-full border-2 border-primary bg-base-200 shadow-inner z-10"
      ></div>
      <div
        class="absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-primary bg-base-200 shadow-inner z-10"
      ></div>
      <div
        class="absolute bottom-2 left-2 w-3 h-3 rounded-full border-2 border-primary bg-base-200 shadow-inner z-10"
      ></div>
      <div
        class="absolute bottom-2 right-2 w-3 h-3 rounded-full border-2 border-primary bg-base-200 shadow-inner z-10"
      ></div>

      <!-- 背景の歯車 (装飾) -->
      <Cog class="absolute -right-4 -top-4 w-24 h-24 opacity-30 text-accent animate-spin-slow" :stroke-width="2" />
      <Cog
        class="absolute -left-6 -bottom-6 w-24 h-24 opacity-30 text-neutral animate-spin-reverse"
        :stroke-width="2"
      />

      <!-- 蒸気パイプ（上部） -->
      <div class="absolute top-0 left-10 right-10 h-1.5 bg-primary opacity-60 rounded-b-full"></div>

      <div class="relative h-full flex flex-col items-center justify-center">
        <transition :name="transitionName" mode="out-in">
          <!-- 時計表示 -->
          <div v-if="!isFlipped" key="clock" class="flex flex-col items-center -mt-1">
            <!-- 圧力計風フレーム -->
            <div class="flex items-center gap-1">
              <!-- 時間ブロック -->
              <div class="flex items-baseline gap-0.5">
                <div class="clock-digit bg-base-200 border-2 border-primary/60 rounded-md px-1.5 py-0.5 shadow-inner">
                  <span class="font-mono font-black text-5xl leading-none text-primary tracking-tight">{{
                    hours
                  }}</span>
                </div>
              </div>

              <!-- コロン（ネジ風） -->
              <div class="flex flex-col gap-1.5 px-0.5 pb-1">
                <div
                  class="w-2 h-2 rounded-full border-2 border-primary transition-all duration-300"
                  :class="colonVisible ? 'bg-primary shadow-[0_0_6px_currentColor]' : 'bg-transparent'"
                ></div>
                <div
                  class="w-2 h-2 rounded-full border-2 border-primary transition-all duration-300"
                  :class="colonVisible ? 'bg-primary shadow-[0_0_6px_currentColor]' : 'bg-transparent'"
                ></div>
              </div>

              <!-- 分ブロック -->
              <div class="flex items-baseline gap-0.5">
                <div class="clock-digit bg-base-200 border-2 border-primary/60 rounded-md px-1.5 py-0.5 shadow-inner">
                  <span class="font-mono font-black text-5xl leading-none text-primary tracking-tight">{{
                    minutes
                  }}</span>
                </div>
              </div>

              <!-- 秒（オプション） -->
              <div v-if="settings.isSecond" class="flex items-end pb-0.5 pl-1">
                <div class="bg-base-200 border border-primary/40 rounded px-1 py-0.5 shadow-inner">
                  <span class="font-mono font-bold text-3xl leading-none text-secondary">{{ seconds }}</span>
                </div>
              </div>
            </div>

            <!-- ゲージバー風メッセージ -->
            <div v-if="defaultMessage" class="mt-2 w-full">
              <div class="relative border border-primary/50 rounded bg-base-100 px-3 py-0.5 overflow-hidden">
                <!-- 装飾ライン -->
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-70"></div>
                <div class="absolute right-0 top-0 bottom-0 w-1 bg-primary opacity-70"></div>
                <div
                  class="text-base font-bold text-center line-clamp-1 text-base-content/70 pl-1"
                  v-html="defaultMessage"
                ></div>
              </div>
            </div>
          </div>

          <!-- メッセージ表示 -->
          <div v-else key="msg" class="w-full px-6 flex flex-col items-center gap-2">
            <!-- スチームパンク風テキストフレーム -->
            <div class="relative border border-primary/50 rounded-lg bg-base-100 p-1 w-full">
              <div class="absolute top-0 left-4 right-4 h-px bg-primary opacity-40"></div>
              <div class="absolute bottom-0 left-4 right-4 h-px bg-primary opacity-40"></div>
              <p
                class="text-xl font-bold leading-tight text-center line-clamp-3 text-base-content/80"
                v-html="currentMsg"
              ></p>
            </div>
            <!-- 圧力インジケーター風ドット -->
            <div class="flex gap-2 items-center">
              <div class="w-1 h-1 rounded-full bg-primary/40"></div>
              <div
                v-for="i in 3"
                :key="i"
                class="w-2 h-2 rounded-full border border-primary animate-bounce"
                :class="i === 2 ? 'bg-primary' : 'bg-primary/40'"
                :style="{ animationDelay: `${i * 0.25}s` }"
              ></div>
              <div class="w-1 h-1 rounded-full bg-primary/40"></div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 蒸気パイプ（下部） -->
      <div class="absolute bottom-0 left-16 right-16 h-1.5 bg-secondary opacity-50 rounded-t-full"></div>

      <!-- サイドバルブ -->
      <div class="absolute top-1/2 -left-2 -translate-y-1/2 flex flex-col items-center gap-0.5">
        <div class="w-4 h-2 bg-primary/80 rounded-r-sm"></div>
        <div class="w-5 h-3 bg-primary rounded-r-md shadow"></div>
        <div class="w-4 h-2 bg-primary/80 rounded-r-sm"></div>
      </div>
      <div class="absolute top-1/2 -right-2 -translate-y-1/2 flex flex-col items-center gap-0.5">
        <div class="w-4 h-2 bg-secondary/80 rounded-l-sm"></div>
        <div class="w-5 h-3 bg-secondary rounded-l-md shadow"></div>
        <div class="w-4 h-2 bg-secondary/80 rounded-l-sm"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { Cog } from 'lucide-vue-next'
  import type { SettingsClockType } from '@/types/OmikujiData/'
  import { useLiveClockTime } from '../composables/useLiveClockTime'

  const props = defineProps<{
    settings: SettingsClockType
    defaultMessage: string
    isMounted: boolean
    isFlipped: boolean
    currentMsg: string
  }>()

  const { hours, minutes, seconds, colonVisible } = useLiveClockTime()

  /**
   * isFlipped の変化方向によってトランジション名を切り替える。
   *
   * false → true（時計 → メッセージ）: "steam-up"
   *   退場: 上へ飛び出す（蒸気が抜けるイメージ）
   *   登場: 下から押し上がる（ピストンが上がるイメージ）
   *
   * true → false（メッセージ → 時計）: "piston-down"
   *   退場: 下に沈む（ピストンが下がるイメージ）
   *   登場: 上から降りてくる（歯車が噛み合うイメージ）
   */
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

  /* 数字ブロックの内側シャドウ強調 */
  .clock-digit {
    box-shadow:
      inset 0 2px 6px rgba(0, 0, 0, 0.4),
      inset 0 -1px 2px rgba(255, 255, 255, 0.05);
  }
</style>
