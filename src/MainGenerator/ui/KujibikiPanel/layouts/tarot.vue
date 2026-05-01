<!-- src/MainGenerator/ui/KujibikiPanel/layouts/tarot.vue -->
<template>
  <div class="relative flex items-center justify-center p-6">
    <!-- メインカード -->
    <div
      class="tarot-card relative w-[320px] min-h-[420px] rounded-xl p-6 flex flex-col items-center gap-4 overflow-hidden"
    >
      <!-- 背景グロー -->
      <div
        class="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full pointer-events-none"
        style="background: radial-gradient(circle, rgba(120, 60, 200, 0.15) 0%, transparent 70%)"
      />

      <!-- コーナー装飾 ✦ -->
      <span class="text-xs leading-none text-[rgba(212,175,55,0.5)]">
        <span class="absolute top-2 left-2">✦</span>
        <span class="absolute top-2 right-2">✦</span>
        <span class="absolute bottom-2 left-2">✦</span>
        <span class="absolute bottom-2 right-2">✦</span>
      </span>

      <!-- ヘッダー -->
      <div class="flex items-center gap-2 w-full">
        <div class="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(212,175,55,1)]" />
        <span class="font-cinzel text-lg tracking-[0.3em] whitespace-nowrap text-[rgba(212,175,55,1)]">TAROT CARD</span>
        <div class="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(212,175,55,1)]" />
      </div>

      <!-- カードタイトル: スロット0 -->
      <div v-if="currentSlot0" class="relative flex items-center justify-center px-6 py-2">
        <div class="absolute inset-0 rounded border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.06)]" />
        <span
          class="relative font-cinzel text-3xl font-bold tracking-wide text-[#d4af37]"
          style="
            text-shadow:
              0 0 8px rgba(212, 175, 55, 0.5),
              0 0 20px rgba(212, 175, 55, 0.2);
          "
        >
          {{ currentSlot0 }}
        </span>
      </div>

      <!-- ユーザー名 -->
      <div v-if="currentName" class="flex items-center gap-2">
        <span class="text-md font-semibold text-[rgba(212,175,55,1)]">
          {{ currentName }}
        </span>
        <span class="text-sm text-[rgba(212,175,55,0.7)]">の運勢</span>
      </div>

      <!-- メッセージ -->
      <div class="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] rounded-lg p-2">
        <p class="font-cinzel text-lg text-center tracking-wide break-all text-white">
          {{ currentMessage }}
        </p>
      </div>

      <!-- TODO:大きくして背景として使用する -->
      <div class="tarot-symbol relative flex items-center justify-center w-14 h-14">
        <!-- 外周の Moon アイコン（回転リング演出） -->
        <div class="tarot-orbit text-[rgba(212,175,55,0.75)] absolute inset-0 flex items-center justify-center">
          <Moon class="absolute" :size="10" style="transform: translateY(-24px)" />
          <Star class="absolute" :size="8" style="transform: rotate(90deg) translateY(-24px)" />
          <Moon class="absolute" :size="10" style="transform: rotate(180deg) translateY(-24px)" />
          <Star class="absolute" :size="8" style="transform: rotate(270deg) translateY(-24px)" />
        </div>
        <!-- 中心: Sparkles -->
        <Sparkles
          class="relative text-[rgba(212,175,55,0.75)]"
          :size="28"
          style="filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.4))"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Sparkles, Moon, Star } from 'lucide-vue-next'
  import { BotMessageBubbleType } from '@/types'

  const props = defineProps<{
    messages: BotMessageBubbleType[]
  }>()

  const current = computed(() => props.messages[0])
  const currentMessage = computed(() => current.value?.bubble?.message ?? '')
  const currentName = computed(() => current.value?.bubble?.name ?? null)
  const currentSlot0 = computed(() => current.value?.slots?.slot0 ?? null)
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
  /* ── Google Fonts: Cinzel ── */
  .font-cinzel {
    font-family: 'Cinzel', serif;
  }

  /* ── カード: 多段 box-shadow + 斜めグラデ背景 ── */
  .tarot-card {
    background: linear-gradient(165deg, #0f0c1e 0%, #1a1235 40%, #150e2e 70%, #0a0818 100%);
    border: 1px solid rgba(212, 175, 55, 0.35);
    box-shadow:
      0 0 0 1px rgba(212, 175, 55, 0.12),
      0 0 40px rgba(100, 60, 180, 0.2),
      0 8px 32px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(212, 175, 55, 0.08);
  }

  @keyframes starTwinkle {
    from {
      opacity: 0.2;
      transform: scale(0.8);
    }
    to {
      opacity: 0.9;
      transform: scale(1.3);
    }
  }

  /* ── シンボル: Sparkles 中心 + orbit リング回転 ── */
  .tarot-orbit {
    animation: orbitRotate 12s linear infinite;
  }

  @keyframes orbitRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
