<!-- src/MainGenerator/ui/KujibikiPanel/layouts/tarot.vue -->
<template>
  <div class="relative flex items-center justify-center">
    <div class="tarot-card relative w-xs h-[420px] rounded-xl p-6 flex flex-col items-center gap-4 overflow-hidden">
      <!-- 背景グロー -->
      <div
        class="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full pointer-events-none"
        style="background: radial-gradient(circle, rgba(120, 60, 200, 0.15) 0%, transparent 70%)"
      />

      <!-- タロットシンボル（背景レイヤー） -->
      <div
        class="tarot-symbol-bg absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div class="relative flex items-center justify-center w-32 h-32">
          <div class="tarot-orbit text-[rgba(212,175,55,0.3)] absolute inset-0 flex items-center justify-center">
            <Moon class="absolute" :size="18" style="transform: translateY(-56px)" />
            <Star class="absolute" :size="14" style="transform: rotate(90deg) translateY(-56px)" />
            <Moon class="absolute" :size="18" style="transform: rotate(180deg) translateY(-56px)" />
            <Star class="absolute" :size="14" style="transform: rotate(270deg) translateY(-56px)" />
          </div>
          <Sparkles class="relative text-[rgba(212,175,55,0.18)]" :size="80" />
        </div>
      </div>

      <!-- コーナー装飾 ✦ -->
      <span class="text-xs leading-none text-[rgba(212,175,55,0.5)]">
        <span class="absolute top-2 left-2">✦</span>
        <span class="absolute top-2 right-2">✦</span>
        <span class="absolute bottom-2 left-2">✦</span>
        <span class="absolute bottom-2 right-2">✦</span>
      </span>

      <!-- ヘッダー -->
      <div v-if="label" class="flex items-center gap-2 w-full">
        <div class="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(212,175,55,1)]" />
        <span class="font-serif text-lg tracking-[0.3em] whitespace-nowrap text-[rgba(212,175,55,1)]">{{ label }}</span>
        <div class="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(212,175,55,1)]" />
      </div>

      <!-- カードタイトル: スロット0 -->
      <div v-if="currentSlot0" class="relative flex items-center justify-center px-6 py-2">
        <div class="absolute inset-0 rounded border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.06)]" />
        <span
          class="relative font-serif text-3xl font-bold tracking-wide text-[#d4af37]"
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
        <span class="text-lg font-semibold text-[rgba(212,175,55,1)]">
          {{ currentName }}
        </span>
        <span class="text-[rgba(212,175,55,0.7)]">の運勢</span>
      </div>

      <!-- メッセージ -->
      <div class="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] rounded-lg p-2">
        <p class="font-serif text-xl text-center tracking-wide break-words text-[rgba(255,255,255,0.9)]">
          {{ currentSlot1 }}
        </p>
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
    label: string
  }>()

  const current = computed(() => props.messages[0])
  const currentName = computed(() => current.value?.bubble?.name ?? null)
  const currentSlot0 = computed(() => current.value?.slots?.slot0 ?? null)
  const currentSlot1 = computed(() => current.value?.slots?.slot1 ?? null)
</script>

<style scoped>
  .tarot-card {
    background: linear-gradient(165deg, #0f0c1e 0%, #1a1235 40%, #150e2e 70%, #0a0818 100%);
    border: 1px solid rgba(212, 175, 55, 0.35);
    box-shadow:
      0 0 0 1px rgba(212, 175, 55, 0.12),
      0 0 40px rgba(100, 60, 180, 0.2),
      0 8px 32px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(212, 175, 55, 0.08);
  }

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
