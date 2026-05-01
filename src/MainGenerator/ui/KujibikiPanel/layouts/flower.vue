<!-- src/MainGenerator/ui/KujibikiPanel/layouts/flower.vue -->
<template>
  <div class="relative flex items-center justify-center py-8 px-6">
    <!-- 花びらパーティクル -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-full" aria-hidden="true">
      <div v-for="i in 8" :key="i" class="petal absolute top-1/2 left-1/2 opacity-50" :style="getPetalStyle(i)">🌸</div>
    </div>

    <!-- メインカード -->
    <div class="flower-card relative z-10 w-[300px] flex flex-col gap-3 rounded-4xl p-4">
      <!-- カードヘッダー -->
      <div class="flex items-center gap-3">
        <!-- アイコンリング -->
        <div class="flower-icon-ring w-11 h-11 rounded-full flex items-center justify-center shrink-0">
          <span class="text-xl" style="filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))">🌸</span>
        </div>
        <!-- タイトルブロック -->
        <div class="flex flex-col gap-0.5">
          <p class="flower-subtitle m-0 text-[0.55rem] tracking-[0.2em] italic uppercase text-[#c084fc]">
            flower fortune
          </p>
          <h2 class="m-0 text-sm font-bold tracking-wide text-[#7c3aed]">フラワー占い</h2>
        </div>
      </div>

      <!-- 区切り -->
      <div class="flex items-center gap-1.5">
        <span class="flower-dot w-1 h-1 rounded-full shrink-0" />
        <span
          class="flex-1 h-px bg-gradient-to-r from-[rgba(249,168,212,0.6)] via-[rgba(192,132,252,0.3)] to-transparent"
        />
        <span class="flower-dot w-1 h-1 rounded-full shrink-0" />
      </div>

      <!-- 結果スロット0: 占い結果タイトル -->
      <div v-if="currentSlot0" class="flower-badge self-start inline-flex px-3 py-1 rounded-full">
        <span class="text-xs font-bold tracking-wide text-white" style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15)">{{
          currentSlot0
        }}</span>
      </div>

      <!-- メッセージ -->
      <div class="flower-message-block rounded-xl px-3.5 py-2.5 border border-[rgba(249,168,212,0.3)]">
        <p class="m-0 text-xs leading-[1.8] text-[#4a3060] break-all">{{ currentMessage }}</p>
      </div>

      <!-- ユーザー名 -->
      <div
        v-if="currentName"
        class="flex items-center gap-1.5 pt-1 border-t border-dashed border-[rgba(192,132,252,0.25)]"
      >
        <span class="text-xs opacity-70">🌷</span>
        <span class="text-xs font-semibold text-[#7c3aed]">{{ currentName }}</span>
        <span class="text-[0.65rem] text-[#a78bca]">さんへ</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageBubbleType } from '@/types/'

  const props = defineProps<{
    messages: BotMessageBubbleType[]
  }>()

  const current = computed(() => props.messages[0])
  const currentMessage = computed(() => current.value?.bubble?.message ?? '')
  const currentName = computed(() => current.value?.bubble?.name ?? null)
  const currentSlot0 = computed(() => current.value?.slots?.slot0 ?? null)

  const getPetalStyle = (i: number) => {
    const angles = [10, 45, 80, 135, 200, 260, 310, 355]
    const distances = [60, 80, 55, 75, 65, 85, 70, 60]
    const delays = [0, 0.4, 0.8, 1.2, 0.2, 0.6, 1.0, 1.5]
    const sizes = [0.7, 0.9, 0.6, 0.8, 0.75, 0.65, 0.85, 0.7]
    const rad = (angles[i - 1] * Math.PI) / 180
    const d = distances[i - 1]
    return {
      '--petal-x': `${Math.cos(rad) * d}px`,
      '--petal-y': `${Math.sin(rad) * d}px`,
      '--petal-delay': `${delays[i - 1]}s`,
      '--petal-size': sizes[i - 1],
      fontSize: `calc(1rem * ${sizes[i - 1]})`,
      animationDelay: `${delays[i - 1]}s`,
    }
  }
</script>

<style scoped>
  /* ── 花びらアニメーション（CSS変数依存のため scoped 必須） ── */
  .petal {
    transform: translate(-50%, -50%);
    animation: petalFloat 3s ease-in-out infinite alternate;
  }

  @keyframes petalFloat {
    from {
      transform: translate(calc(-50% + var(--petal-x) * 0.6), calc(-50% + var(--petal-y) * 0.6)) rotate(0deg);
      opacity: 0.3;
    }
    to {
      transform: translate(calc(-50% + var(--petal-x)), calc(-50% + var(--petal-y))) rotate(30deg);
      opacity: 0.6;
    }
  }

  /* ── カード: 多段 box-shadow + 斜めグラデ背景 ── */
  .flower-card {
    background: linear-gradient(145deg, #fff5fa 0%, #fde8f3 35%, #f3dff5 70%, #ead8f7 100%);
    border: 1px solid rgba(230, 150, 200, 0.4);
    box-shadow:
      0 2px 0 rgba(230, 150, 200, 0.3),
      0 8px 32px rgba(200, 100, 180, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }

  /* ── アイコンリング: 斜めグラデ ── */
  .flower-icon-ring {
    background: linear-gradient(135deg, #f9a8d4, #c084fc);
    box-shadow: 0 2px 8px rgba(192, 132, 252, 0.35);
  }

  /* ── 区切りドット: グラデ ── */
  .flower-dot {
    background: linear-gradient(135deg, #f9a8d4, #c084fc);
  }

  /* ── 結果バッジ: グラデ + shadow ── */
  .flower-badge {
    background: linear-gradient(90deg, #f9a8d4, #c084fc);
    box-shadow: 0 2px 8px rgba(192, 132, 252, 0.3);
  }

  /* ── メッセージブロック: 半透明白背景 ── */
  .flower-message-block {
    background: rgba(255, 255, 255, 0.55);
  }

  /* ── サブタイトル: Georgia ── */
  .flower-subtitle {
    font-family: 'Georgia', 'Times New Roman', serif;
  }
</style>
