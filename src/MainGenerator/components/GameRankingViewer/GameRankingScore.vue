<!-- src/MainGenerator/components/GameRankingViewer/CommentBubbleItem.vue -->
<template>
  <Transition name="bubble-fade" @after-leave="$emit('hidden')">
    <div v-if="isVisible && topMessage && settings" :data-theme="settings.color" class="inline-block">
      <!-- 浮遊専用 -->
      <div class="bubble-float z-9999">
        <!-- 見た目専用 -->
        <div
          class="relative w-[280px] h-[280px] rounded-full flex items-center justify-center bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/25 backdrop-blur-sm shadow-2xl shadow-primary/30"
          style="
            box-shadow:
              inset 0 0 80px hsl(var(--b1) / 0.4),
              inset -10px -10px 30px hsl(var(--p) / 0.2),
              inset 10px 10px 30px hsl(var(--s) / 0.1);
          "
        >
          <!-- 背景アイコン -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 text-content">
            <Trophy :size="100" :stroke-width="1.5" />
          </div>

          <div class="relative z-10 text-center p-8 text-content">
            <h3 class="text-xl font-bold mb-2">
              {{ topMessage.comment?.rankingName || topMessage.name }}
            </h3>

            <p class="text-sm opacity-80 mb-1">スコア</p>

            <div class="text-5xl font-bold mb-3">
              {{ formatScore(Number(topMessage.comment?.rankingDisplayScore) || 0) }}
            </div>

            <div v-if="topMessage.comment?.rankingRank" class="mt-2">
              <div class="badge badge-warning badge-lg font-bold rounded-full">
                #{{ topMessage.comment.rankingRank }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { computed, watch, ref } from 'vue'
  import { Trophy } from 'lucide-vue-next'
  import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
  import { SettingsRankingType } from '@/types/OmikujiData/DisplaySettingsSchema'

  const DISPLAY_DURATION_MS = 8000 // 表示時間（ミリ秒）

  interface Props {
    botMessages: BotMessage[]
    settings: SettingsRankingType
  }

  const props = defineProps<Props>()

  const isVisible = ref(false)
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  // トップメッセージ（最高スコア）を取得
  const topMessage = computed(() => {
    if (props.botMessages.length === 0) return null

    const sorted = [...props.botMessages].sort(
      (a, b) => (Number(b.comment?.rankingPoint) || 0) - (Number(a.comment?.rankingPoint) || 0)
    )

    return sorted[0]
  })

  // スコアのフォーマット
  const formatScore = (score: number): string => {
    return score.toLocaleString()
  }

  // topMessageが変更されたら表示を再開
  watch(
    topMessage,
    (newMessage) => {
      if (newMessage) {
        if (hideTimer) clearTimeout(hideTimer)

        isVisible.value = true

        hideTimer = setTimeout(() => {
          isVisible.value = false
        }, DISPLAY_DURATION_MS)
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
  /* 浮遊アニメーション専用 */
  .bubble-float {
    animation: bubble-float 3s ease-in-out infinite;
  }

  /* 浮遊 */
  @keyframes bubble-float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  /* Transition */
  .bubble-fade-enter-active {
    animation: bubble-appear 0.5s ease-out;
  }

  .bubble-fade-leave-active {
    animation: bubble-disappear 0.3s ease-in;
  }

  @keyframes bubble-appear {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
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
