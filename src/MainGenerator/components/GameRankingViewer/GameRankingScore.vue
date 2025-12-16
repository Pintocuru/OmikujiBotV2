<!-- src/MainGenerator/components/GameRankingViewer/GameRankingScore.vue -->
<template>
  <div v-if="topMessage && settings" :data-theme="settings.color" class="card bg-base-100 shadow-xl animate-bounce-in">
    <div class="card-body p-6 text-center">
      <!-- アイコン（オプション） -->
      <div class="flex justify-center mb-2">
        <div class="avatar placeholder">
          <div class="bg-primary text-primary-content rounded-full w-16">
            <span class="text-2xl">🏆</span>
          </div>
        </div>
      </div>

      <!-- プレイヤー名 -->
      <h3 class="text-xl font-bold text-base-content">
        {{ topMessage.comment?.rankingName || topMessage.name }}
      </h3>

      <!-- スコアラベル -->
      <p class="text-sm text-base-content/60 mb-1">スコア</p>

      <!-- スコア値 -->
      <div class="text-5xl font-bold text-primary">
        {{ formatScore(Number(topMessage.comment?.rankingPoint) || 0) }}
      </div>

      <!-- ランク表示（オプション） -->
      <div v-if="topMessage.comment?.rankingRank" class="mt-2">
        <div class="badge badge-lg badge-warning font-bold">#{{ topMessage.comment.rankingRank }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
  import { SettingsRankingType } from '@/types/OmikujiData/DisplaySettingsSchema'

  interface Props {
    botMessages: BotMessage[]
    settings: SettingsRankingType
  }

  const props = defineProps<Props>()

  // トップメッセージ（最高スコア）を取得
  const topMessage = computed(() => {
    if (props.botMessages.length === 0) return null

    // スコアでソートして最高得点を取得
    const sorted = [...props.botMessages].sort(
      (a, b) => (Number(b.comment?.rankingPoint) || 0) - (Number(a.comment?.rankingPoint) || 0)
    )

    return sorted[0]
  })

  // スコアのフォーマット
  const formatScore = (score: number): string => {
    return score.toLocaleString()
  }
</script>

<style scoped>
  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-bounce-in {
    animation: bounce-in 0.6s ease-out;
  }

  .card {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
