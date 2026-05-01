<!-- src/MainGenerator/ui/KujibikiPanel/layouts/omikuji.vue -->
<template>
  <div class="relative flex items-center justify-center p-8 overflow-visible">
    <!-- 背景装飾: グラデーション光輪 -->
    <div
      aria-hidden="true"
      class="absolute inset-0 w-[340px] h-[340px] m-auto rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(180,30,30,0.08)_0%,transparent_70%)]"
    />

    <!-- 背景装飾: 家紋風サークル -->
    <div
      aria-hidden="true"
      class="absolute z-10 inset-0 w-[320px] h-[320px] m-auto pointer-events-none text-[rgba(180,130,60,0.18)]"
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <circle cx="50" cy="50" r="38" stroke="currentColor" stroke-width="0.5" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" stroke-width="1" stroke-dasharray="2 4" />
      </svg>
    </div>

    <!-- メイン紙 -->
    <div
      class="omikuji-paper relative w-[280px] min-h-[380px] flex flex-col items-center rounded-t-sm rounded-b-md pb-6"
    >
      <!-- 上部: おみくじ帯 -->
      <div class="w-full py-2 text-center mb-6 bg-gradient-to-r from-[#8b1a1a] via-[#c0392b] to-[#8b1a1a]">
        <span
          class="font-serif text-sm font-bold tracking-[0.5em] text-[#fdf8ef]"
          style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4)"
          >おみくじ</span
        >
      </div>

      <!-- 結果テキスト: スロット0 が運勢（大吉など） -->
      <div v-if="currentSlot0" class="flex flex-col items-center gap-2 mb-5 px-4">
        <span
          class="text-5xl font-black leading-none tracking-wider text-[#c0392b]"
          style="
            text-shadow:
              0 0 1px rgba(192, 57, 43, 0.5),
              2px 2px 0 rgba(120, 30, 20, 0.3);
          "
          >{{ currentSlot0 }}</span
        >
        <div class="w-24 h-px bg-gradient-to-r from-transparent via-[rgba(180,130,60,0.6)] to-transparent" />
      </div>

      <!-- メッセージ本文 -->
      <div class="flex-1 px-6 w-full">
        <p class="text-sm leading-relaxed text-justify tracking-wide text-[#3d2b1f] m-0 break-all">
          {{ currentMessage }}
        </p>
      </div>

      <!-- ユーザー名 -->
      <div v-if="currentName" class="mt-5 flex items-center gap-1.5 px-5">
        <span class="text-base opacity-70">⛩</span>
        <span class="text-sm font-semibold text-[#5a3e28]">{{ currentName }}</span>
        <span class="text-xs text-[#8a6a50]">さん</span>
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
</script>

<style scoped>
  /* Tailwindで表現しきれない和紙テクスチャ・多段shadowのみ残す */
  .omikuji-paper {
    background: linear-gradient(175deg, #fdf8ef 0%, #f9f0d8 40%, #f5e8c4 100%);
    border: 1px solid rgba(180, 130, 60, 0.35);
    border-top: 3px solid #c0392b;
    box-shadow:
      0 0 0 1px rgba(180, 130, 60, 0.12),
      4px 4px 16px rgba(0, 0, 0, 0.25),
      inset 0 0 30px rgba(220, 190, 120, 0.15);
  }

  /* 和紙ノイズ感ライン（擬似要素のみ） */
  .omikuji-paper::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 3px,
      rgba(180, 140, 60, 0.04) 3px,
      rgba(180, 140, 60, 0.04) 4px
    );
    pointer-events: none;
  }
</style>
