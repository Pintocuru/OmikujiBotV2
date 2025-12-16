<!-- src/MainGenerator/components/GameRankingViewer/CommentBubbleItem.vue -->
<template>
  <Transition name="bubble-fade" @after-leave="$emit('hidden')">
    <div v-if="isVisible && latestMessage && settings" :data-theme="settings.color" class="inline-block">
      <div class="bubble-float">
        <div
          class="relative w-[280px] h-[280px] rounded-full flex items-center justify-center bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/25 backdrop-blur-sm shadow-2xl"
        >
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 text-content">
            <Trophy :size="100" :stroke-width="1.5" />
          </div>

          <div class="relative text-center text-content">
            <h3 class="text-2xl font-bold mb-3">
              {{ latestMessage.comment?.rankingName || latestMessage.name }}
            </h3>

            <p class="text-base opacity-80">スコア</p>

            <div class="text-6xl font-bold">
              {{ formatScore(Number(latestMessage.comment?.rankingDisplayScore) || 0) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { computed, watch, ref } from 'vue'
  import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
  import { SettingsRankingType } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { Trophy } from 'lucide-vue-next'

  const DISPLAY_DURATION_MS = 8000 // 表示時間（ミリ秒）

  interface Props {
    botMessages: BotMessage[]
    settings: SettingsRankingType
  }

  const props = defineProps<Props>()

  const isVisible = ref(false)
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  // 1. 新しい computed プロパティを作成し、ここでフィルタリングを安全に行う
  const localFilteredMessages = computed(() => {
    const scriptKey = props.settings.scriptKey // ランキングキーを取得

    if (!props.botMessages || !scriptKey) {
      return []
    }

    // props を変更せずに、新しい配列を生成して返す
    return props.botMessages.filter((message) => message.comment?.rankingKey === scriptKey)
  })

  // 2. フィルタリングされたリストから最新メッセージ（末尾）を取得
  const latestMessage = computed(() => {
    if (localFilteredMessages.value.length === 0) return null

    // フィルタリングされた配列の末尾の要素（最新のメッセージ）を返す
    return localFilteredMessages.value[localFilteredMessages.value.length - 1]
  })

  // スコアのフォーマット
  const formatScore = (score: number): string => {
    return score.toLocaleString()
  }

  // 3. watch の監視対象を、フィルタリングされたリストの長さにする
  watch(
    () => localFilteredMessages.value.length,
    (newLength) => {
      // メッセージが1つ以上あり、最新メッセージが取得できた場合
      if (newLength > 0 && latestMessage.value) {
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
