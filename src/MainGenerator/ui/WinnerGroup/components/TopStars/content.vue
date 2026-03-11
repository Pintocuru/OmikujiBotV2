<!-- src/MainGenerator/ui/WinnerGroup/components/TopStars/content.vue -->
<template>
  <!-- 浮遊する星の装飾 -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden">
    <Star
      v-for="i in 8"
      :key="i"
      class="absolute text-warning/20 fill-warning/20"
      :class="getRandomStarSize()"
      :style="getRandomStarPosition(i)"
    />
  </div>

  <!-- 1位（中央・大きく） -->
  <div v-if="users.length >= 1" class="flex justify-center mb-4">
    <div
      v-motion
      :initial="{ opacity: 0, y: -50, scale: 0.8 }"
      :enter="{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 1000, delay: 300, type: 'spring', stiffness: 80 },
      }"
      class="flex flex-col items-center"
    >
      <div class="relative">
        <!-- 王冠アイコン -->
        <div
          class="absolute -top-8 left-1/2 transform -translate-x-1/2"
          style="animation: bounceCrown 2s ease-in-out infinite"
        >
          <div class="relative">
            <!-- 光るエフェクト -->
            <div class="absolute inset-0 blur-md">
              <Crown class="w-9 h-9 text-warning fill-warning" />
            </div>
            <Crown class="w-9 h-9 text-warning fill-warning relative" />
          </div>
        </div>

        <!-- スポットライト効果 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-32 h-32 bg-warning/30 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <!-- アバター -->
        <div class="avatar relative z-10">
          <div class="w-18 rounded-full ring-4 ring-warning ring-offset-base-100 ring-offset-4 shadow-xl">
            <img
              :src="users[0].profileImage || getAvatarUrl(users[0].userName || 'Anonymous')"
              :alt="users[0].userName"
              class="object-cover w-full h-full"
            />
          </div>
        </div>

        <!-- 順位バッジ -->
        <div
          class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-gradient-to-r from-warning to-primary px-4 py-1 rounded-full shadow-lg"
        >
          <Trophy class="w-4 h-4 text-white" />
          <span class="text-white font-bold text-sm">1st</span>
        </div>

        <!-- キラキラエフェクト -->
        <Sparkles class="absolute top-2 -right-2 w-5 h-5 text-warning animate-ping" />
        <Sparkles class="absolute top-4 -left-2 w-4 h-4 text-primary animate-ping" style="animation-delay: 0.5s" />
        <Sparkles class="absolute bottom-10 right-1 w-5 h-5 text-secondary animate-ping" style="animation-delay: 1s" />
      </div>

      <div class="mt-5 text-center">
        <div class="text-xl font-bold bg-gradient-to-r from-warning to-primary bg-clip-text text-transparent">
          {{ users[0].userName }}
        </div>
      </div>
    </div>
  </div>

  <!-- 2位以降（横並び） -->
  <div
    v-if="users.length > 1"
    class="grid gap-6"
    :class="{
      'grid-cols-1': users.length === 2,
      'grid-cols-2': users.length === 3,
      'grid-cols-2 sm:grid-cols-3': users.length === 4,
      'grid-cols-2 sm:grid-cols-4': users.length >= 5,
    }"
  >
    <div
      v-for="(user, index) in users.slice(1)"
      :key="user.userId"
      v-motion
      :initial="{ opacity: 0, y: 30, rotateY: 45 }"
      :enter="{
        opacity: 1,
        y: 0,
        rotateY: 0,
        transition: { duration: 800, delay: 500 + index * 100 },
      }"
      class="flex flex-col items-center"
    >
      <div class="relative">
        <!-- ランクに応じたメダル -->
        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Medal
            :class="getRankMedalClass(index + 2)"
            class="w-6 h-6"
            style="animation: swing 2s ease-in-out infinite"
            :style="{ animationDelay: `${index * 0.2}s` }"
          />
        </div>

        <!-- アバター -->
        <div class="avatar">
          <div
            class="w-14 rounded-full ring-3 ring-offset-base-100 ring-offset-2 shadow-lg"
            :class="getRankRingClass(index + 2)"
          >
            <img
              :src="user.profileImage || getAvatarUrl(user.userName || 'Anonymous')"
              :alt="user.userName"
              class="object-cover w-full h-full"
            />
          </div>
        </div>

        <!-- 順位バッジ -->
        <div
          class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1 px-3 py-0.5 rounded-full shadow-md font-bold"
          :class="getRankBadgeClass(index + 2)"
        >
          <span class="text-xs">{{ getRankSuffix(index + 2) }}</span>
        </div>
      </div>

      <div class="mt-2 text-center">
        <div class="text-base font-bold">{{ user.userName }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'
  import { UserVisitRecord } from '@/types/MainGenerator/'
  import { Star, Crown, Trophy, Medal, Sparkles } from 'lucide-vue-next'

  defineProps<{
    users: UserVisitRecord[]
    label: string
  }>()

  // ランダムな星のサイズを取得
  const getRandomStarSize = () => {
    const sizes = ['w-4 h-4', 'w-5 h-5', 'w-6 h-6', 'w-8 h-8']
    return sizes[Math.floor(Math.random() * sizes.length)]
  }

  // ランダムな星の位置とアニメーションを取得
  const getRandomStarPosition = (index: number) => {
    const positions = [
      { top: '5%', left: '10%', animationDelay: '0s' },
      { top: '10%', right: '8%', animationDelay: '0.5s' },
      { top: '40%', left: '5%', animationDelay: '1s' },
      { top: '45%', right: '5%', animationDelay: '1.5s' },
      { bottom: '20%', left: '12%', animationDelay: '2s' },
      { bottom: '15%', right: '10%', animationDelay: '2.5s' },
      { top: '25%', left: '20%', animationDelay: '3s' },
      { top: '30%', right: '18%', animationDelay: '3.5s' },
    ]
    return {
      ...positions[index % positions.length],
      animation: 'floatStar 5s ease-in-out infinite',
    }
  }

  // ランクに応じたメダルのクラス
  const getRankMedalClass = (rank: number) => {
    if (rank === 2) return 'text-base-content/60 fill-base-content/60' // シルバー的な表現
    if (rank === 3) return 'text-accent fill-accent' // ブロンズ的な表現
    return 'text-info fill-info'
  }

  // ランクに応じたリングのクラス
  const getRankRingClass = (rank: number) => {
    if (rank === 2) return 'ring-base-content/60'
    if (rank === 3) return 'ring-accent'
    return 'ring-info'
  }

  // ランクに応じたバッジのクラス
  const getRankBadgeClass = (rank: number) => {
    if (rank === 2) return 'bg-base-content/60 text-base-100'
    if (rank === 3) return 'bg-accent text-accent-content'
    return 'bg-info text-info-content'
  }

  // 順位の接尾辞を取得
  const getRankSuffix = (rank: number): string => {
    if (rank === 2) return '2nd'
    if (rank === 3) return '3rd'
    return `${rank}th`
  }
</script>

<style scoped>
  @keyframes bounceCrown {
    0%,
    100% {
      transform: translateY(0) translateX(-50%) rotate(-10deg);
    }
    50% {
      transform: translateY(-10px) translateX(-50%) rotate(10deg);
    }
  }

  @keyframes swing {
    0%,
    100% {
      transform: rotate(-10deg);
    }
    50% {
      transform: rotate(10deg);
    }
  }

  @keyframes floatStar {
    0%,
    100% {
      transform: translateY(0) rotate(0deg) scale(1);
      opacity: 0.2;
    }
    25% {
      transform: translateY(-20px) rotate(90deg) scale(1.2);
      opacity: 0.4;
    }
    50% {
      transform: translateY(-30px) rotate(180deg) scale(1);
      opacity: 0.2;
    }
    75% {
      transform: translateY(-15px) rotate(270deg) scale(1.1);
      opacity: 0.3;
    }
  }
</style>
