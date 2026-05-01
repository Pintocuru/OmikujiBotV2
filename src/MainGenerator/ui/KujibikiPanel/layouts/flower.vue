<!-- src/MainGenerator/ui/KujibikiPanel/layouts/flower.vue -->
<template>
  <div class="relative flex items-center justify-center py-6 px-6">
    <!-- 最小限の花びら装飾（控えめに） -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-30" aria-hidden="true">
      <div v-for="i in 4" :key="i" class="petal absolute" :style="getPetalStyle(i)">🌸</div>
    </div>

    <!-- レターカード（シンプルに） -->
    <div
      class="letter-card relative z-10 w-[320px] bg-[#fffef7] rounded-lg shadow-md border border-[#e8d5c4] overflow-hidden"
    >
      <!-- 便箋風の横線（控えめな下地） -->
      <div
        class="absolute inset-0 pointer-events-none opacity-5"
        style="background: repeating-linear-gradient(transparent, transparent 28px, #d4c4a8 28px, #d4c4a8 29px)"
      ></div>

      <!-- コンテンツ -->
      <div class="relative p-5 flex flex-col gap-3">
        <!-- タイトル（シンプルに） -->
        <div class="flex items-center gap-2 border-b border-[#e8d5c4] pb-2">
          <span class="text-sm">🌸</span>
          <span class="text-xs font-medium text-[#8b6b55] tracking-wide">FLOWER FORTUNE</span>
        </div>

        <!-- 運勢タイトル（slot0） -->
        <div v-if="currentSlot0" class="text-center py-1">
          <span class="text-xl font-serif font-bold text-[#5d3a28]">{{ currentSlot0 }}</span>
        </div>

        <!-- メインメッセージ -->
        <div class="min-h-[100px] flex items-center justify-center py-2">
          <p class="m-0 text-sm leading-relaxed text-[#4a3525] text-center break-words">
            {{ currentMessage || '--' }}
          </p>
        </div>

        <!-- ユーザー名（シンプルに右寄せ） -->
        <div v-if="currentName" class="text-right pt-2 border-t border-dashed border-[#e8d5c4]">
          <span class="text-xs text-[#8b6b55]">{{ currentName }} 様</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageBubbleType } from '@/types'

  const props = defineProps<{
    messages: BotMessageBubbleType[]
  }>()

  const current = computed(() => props.messages[0])
  const currentMessage = computed(() => current.value?.bubble?.message ?? '')
  const currentName = computed(() => current.value?.bubble?.name ?? null)
  const currentSlot0 = computed(() => current.value?.slots?.slot0 ?? null)

  const getPetalStyle = (i: number) => {
    const positions = [
      { top: '5%', left: '3%' },
      { top: '80%', right: '2%' },
      { top: '15%', right: '5%' },
      { bottom: '10%', left: '8%' },
    ]
    const pos = positions[i - 1]
    return {
      top: pos.top,
      left: pos.left,
      right: pos.right,
      fontSize: '0.75rem',
      opacity: 0.4,
    }
  }
</script>

<style scoped>
  .letter-card {
    background: linear-gradient(135deg, #fffef7 0%, #fffaf0 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .font-serif {
    font-family: 'Georgia', 'Times New Roman', serif;
  }

  /* OBS表示時の視認性確保 */
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.5;
  }
</style>
