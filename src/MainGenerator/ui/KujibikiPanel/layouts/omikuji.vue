<!-- src/MainGenerator/ui/KujibikiPanel/layouts/omikuji.vue -->
<template>
  <div class="flex items-center justify-center overflow-visible">
    <!-- 家紋風 -->
    <div aria-hidden="true" class="absolute z-10 inset-0 w-xs m-auto text-[rgba(180,130,60,0.18)]">
      <svg viewBox="0 0 100 100" fill="none" class="w-full h-full">
        <circle cx="50" cy="50" r="38" stroke="currentColor" stroke-width="0.5" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" stroke-width="1" stroke-dasharray="2 4" />
      </svg>
    </div>

    <!-- メイン -->
    <div class="omikuji-paper relative w-[280px] min-h-[380px] flex flex-col items-center gap-y-5 pb-6">
      <!-- 上部 -->
      <div v-if="label" class="w-full py-2 text-center bg-gradient-to-r from-[#8b1a1a] via-[#c0392b] to-[#8b1a1a]">
        <span class="font-serif text-lg font-bold tracking-[0.5em] text-[#fdf8ef]">
          {{ label }}
        </span>
      </div>

      <!-- 運勢 -->
      <div v-if="currentSlot0" class="flex flex-col items-center">
        <span
          class="font-serif text-5xl font-black leading-none tracking-wider text-[#c0392b]"
          style="
            text-shadow:
              0 0 1px rgba(192, 57, 43, 0.5),
              2px 2px 0 rgba(120, 30, 20, 0.3);
          "
        >
          {{ currentSlot0 }}
        </span>
      </div>

      <!-- 本文 -->
      <div class="flex-1 px-4 w-full min-h-[120px]">
        <p class="text-xl text-justify text-black">
          {{ currentSlot1 }}
        </p>
      </div>

      <!-- ユーザー -->
      <div v-if="currentName" class="flex items-center gap-1.5 px-5">
        <span class="text-xl opacity-70">⛩</span>
        <span class="text-xl font-semibold text-black">
          {{ currentName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageBubbleType } from '@/types'

  const props = defineProps<{
    messages: BotMessageBubbleType[]
    label: string
  }>()

  const current = computed(() => props.messages[0])
  const currentName = computed(() => current.value?.bubble?.name ?? null)
  const currentSlot0 = computed(() => current.value?.slots?.slot0 ?? null)
  const currentSlot1 = computed(() => current.value?.slots?.slot1 ?? null)
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
