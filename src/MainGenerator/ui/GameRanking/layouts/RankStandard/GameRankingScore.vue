<!-- src/MainGenerator/ui/GameRanking/layouts/RankStandard/GameRankingScore.vue -->
<template>
  <Transition name="bubble-fade" @after-leave="$emit('hidden')">
    <div v-if="isVisible && latestMessage" ref="bubbleRef" class="inline-block relative z-10">
      <div class="bubble-float">
        <!-- 円マスク -->
        <div
          class="relative w-[200px] h-[200px] rounded-full overflow-hidden flex items-center justify-center shadow-2xl"
        >
          <!-- シャボン玉背景 -->
          <div
            class="absolute inset-0 rounded-full backdrop-blur-sm"
            style="
              background: radial-gradient(
                circle at 30% 30%,
                rgba(255, 255, 255, 0.65),
                rgba(255, 255, 255, 0.25) 35%,
                rgba(255, 255, 255, 0.1) 55%,
                rgba(255, 255, 255, 0) 70%
              );
            "
          />

          <!-- 輪郭 -->
          <div class="absolute inset-0 rounded-full ring-1 ring-white/30" />

          <!-- 背景アイコン -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 text-white">
            <Trophy :size="100" :stroke-width="1.5" />
          </div>

          <!-- コンテンツ -->
          <div class="relative z-10 text-center text-white">
            <h3 class="text-2xl font-bold mb-3">
              {{ latestMessage.lists?.listName || latestMessage.user?.userName }}
            </h3>
            <p class="text-base opacity-80">スコア</p>
            <div class="text-6xl font-bold">
              {{ formatScore(latestMessage.lists?.order || 0) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { computed, watch, ref } from 'vue'
  import { GameRankingType } from '@/types'
  import { BotMessageExtraType } from '@/types/MainGenerator/BotMessageSchema'
  import { Trophy } from 'lucide-vue-next'
  import { useMotion } from '@vueuse/motion'

  const DISPLAY_DURATION_MS = 8000

  const props = defineProps<{
    scoreMessages: BotMessageExtraType[]
    settings: GameRankingType
  }>()

  const isVisible = ref(false)
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  const localFilteredMessages = computed(() =>
    props.scoreMessages.filter((m) => {
      return m.lists && props.settings.targetScriptKeys.includes(m.scriptKey)
    })
  )

  const latestMessage = computed(() =>
    localFilteredMessages.value.length ? localFilteredMessages.value[localFilteredMessages.value.length - 1] : null
  )

  const formatScore = (score: number) => score.toLocaleString()

  /* motion */
  const bubbleRef = ref<HTMLElement | null>(null)

  const { apply } = useMotion(bubbleRef, {
    initial: {
      scale: 0,
      opacity: 0,
      x: 0,
    },
    enter: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 160,
        damping: 18,
      },
    },
  })

  watch(
    () => isVisible.value,
    (v) => {
      if (v) apply('enter')
    }
  )

  /* 表示制御 */
  watch(
    () => localFilteredMessages.value.length,
    (len) => {
      if (len > 0 && latestMessage.value) {
        if (hideTimer) clearTimeout(hideTimer)
        isVisible.value = true
        hideTimer = setTimeout(() => (isVisible.value = false), DISPLAY_DURATION_MS)
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
  /* 浮遊＋左右揺れ */
  .bubble-float {
    animation: bubble-float 4s ease-in-out infinite;
  }

  @keyframes bubble-float {
    0% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(3px, -12px);
    }
    50% {
      transform: translate(0, -20px);
    }
    75% {
      transform: translate(-3px, -12px);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  /* 出入り */
  .bubble-fade-enter-active {
    animation: bubble-appear 0.4s ease-out;
  }

  .bubble-fade-leave-active {
    animation: bubble-disappear 0.3s ease-in;
  }

  @keyframes bubble-appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes bubble-disappear {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.5);
    }
  }
</style>
