<!-- src/MainGenerator/ui/WinnerGroup/components/TopStars.vue -->
<template>
  <div class="top-stars-container p-8 relative" :data-theme="theme">
    <!-- 背景グラデーション -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl blur-xl"
    ></div>
    <div class="absolute inset-0 bg-base-100/95 backdrop-blur-sm rounded-3xl border-2 border-warning/30"></div>

    <div v-if="users.length > 0" class="relative z-10">
      <!-- タイトル -->
      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.5, rotateZ: -10 }"
        :enter="{ opacity: 1, scale: 1, rotateZ: 0, transition: { duration: 800, type: 'spring', stiffness: 100 } }"
        class="text-center mb-10"
      >
        <div class="flex items-center justify-center gap-3 mb-2">
          <Star class="w-10 h-10 text-yellow-400 fill-yellow-400 animate-pulse" />
          <h2
            class="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-600 bg-clip-text text-transparent"
          >
            TOP STARS
          </h2>
          <Star class="w-10 h-10 text-yellow-400 fill-yellow-400 animate-pulse" style="animation-delay: 0.5s" />
        </div>
        <p class="text-sm opacity-70 flex items-center justify-center gap-2">
          <Sparkles class="w-4 h-4 text-yellow-500" />
          Today's Shining Members
          <Sparkles class="w-4 h-4 text-yellow-500" />
        </p>
      </div>

      <!-- 浮遊する星の装飾 -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <Star
          v-for="i in 8"
          :key="i"
          class="absolute text-yellow-400/20 fill-yellow-400/20"
          :class="getRandomStarSize()"
          :style="getRandomStarPosition(i)"
        />
      </div>

      <!-- 1位（中央・大きく） -->
      <div v-if="users.length >= 1" class="flex justify-center mb-12">
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
              class="absolute -top-12 left-1/2 transform -translate-x-1/2"
              style="animation: bounceCrown 2s ease-in-out infinite"
            >
              <div class="relative">
                <!-- 光るエフェクト -->
                <div class="absolute inset-0 blur-lg">
                  <Crown class="w-14 h-14 text-yellow-400 fill-yellow-400" />
                </div>
                <Crown class="w-14 h-14 text-yellow-400 fill-yellow-400 relative" />
              </div>
            </div>

            <!-- スポットライト効果 -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-48 h-48 bg-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <!-- アバター -->
            <div class="avatar relative z-10">
              <div class="w-44 rounded-full ring-8 ring-yellow-400 ring-offset-base-100 ring-offset-8 shadow-2xl">
                <img :src="users[0].profileImage" :alt="users[0].userName" class="object-cover" />
              </div>
            </div>

            <!-- 順位バッジ -->
            <div
              class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 rounded-full shadow-lg"
            >
              <Trophy class="w-5 h-5 text-white" />
              <span class="text-white font-bold text-xl">1st</span>
            </div>

            <!-- キラキラエフェクト -->
            <Sparkles class="absolute top-4 -right-4 w-8 h-8 text-yellow-300 animate-ping" />
            <Sparkles
              class="absolute top-8 -left-4 w-6 h-6 text-orange-300 animate-ping"
              style="animation-delay: 0.5s"
            />
            <Sparkles
              class="absolute bottom-16 right-2 w-7 h-7 text-yellow-400 animate-ping"
              style="animation-delay: 1s"
            />
          </div>

          <div class="mt-8 text-center">
            <div
              class="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            >
              {{ users[0].userName }}
            </div>
            <div class="flex items-center justify-center gap-2 mt-2 text-yellow-600">
              <Star class="w-5 h-5 fill-yellow-500 text-yellow-500" />
              <span class="text-lg font-semibold">{{ users[0].visitCount }} visits</span>
              <Star class="w-5 h-5 fill-yellow-500 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      <!-- 2位以降（横並び） -->
      <div
        v-if="users.length > 1"
        class="grid gap-8"
        :class="{
          'grid-cols-1': users.length === 2,
          'grid-cols-2': users.length === 3,
          'grid-cols-2 md:grid-cols-3': users.length === 4,
          'grid-cols-2 md:grid-cols-4': users.length >= 5,
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
            <div class="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <Medal
                :class="getRankMedalClass(index + 2)"
                class="w-8 h-8"
                style="animation: swing 2s ease-in-out infinite"
                :style="{ animationDelay: `${index * 0.2}s` }"
              />
            </div>

            <!-- アバター -->
            <div class="avatar">
              <div
                class="w-32 rounded-full ring-6 ring-offset-base-100 ring-offset-4 shadow-xl"
                :class="getRankRingClass(index + 2)"
              >
                <img :src="user.profileImage" :alt="user.userName" class="object-cover" />
              </div>
            </div>

            <!-- 順位バッジ -->
            <div
              class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full shadow-lg font-bold"
              :class="getRankBadgeClass(index + 2)"
            >
              <span class="text-sm">{{ getRankSuffix(index + 2) }}</span>
            </div>

            <!-- 小さなキラキラ -->
            <Sparkles
              class="absolute top-2 -right-2 w-5 h-5 animate-ping"
              :class="getRankSparkleClass(index + 2)"
              :style="{ animationDelay: `${index * 0.3}s` }"
            />
          </div>

          <div class="mt-6 text-center">
            <div class="text-xl font-bold">{{ user.userName }}</div>
            <div class="flex items-center justify-center gap-1 text-xs opacity-70 mt-1">
              <Star class="w-3 h-3 fill-current" />
              <span>{{ user.visitCount }} visits</span>
            </div>
          </div>
        </div>
      </div>

      <!-- フッターメッセージ -->
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 1000, delay: 1200 } }"
        class="text-center mt-10"
      >
        <div
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full border-2 border-yellow-400/30"
        >
          <Zap class="w-5 h-5 text-yellow-500 animate-pulse" />
          <p
            class="text-lg font-semibold italic bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"
          >
            Keep shining bright!
          </p>
          <Sparkles class="w-5 h-5 text-orange-500 animate-pulse" />
        </div>
      </div>
    </div>

    <div v-else class="relative z-10 text-center py-12 opacity-60">
      <Users class="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <p class="text-lg">表示するユーザーがいません</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Star, Crown, Trophy, Medal, Sparkles, Zap, Users } from 'lucide-vue-next'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'

  const props = defineProps<{
    users: UserVisitRecord[]
    theme?: string
  }>()

  // ランダムな星のサイズを取得
  const getRandomStarSize = () => {
    const sizes = ['w-6 h-6', 'w-8 h-8', 'w-10 h-10', 'w-12 h-12']
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
    if (rank === 2) return 'text-gray-400 fill-gray-400'
    if (rank === 3) return 'text-amber-700 fill-amber-700'
    return 'text-blue-400 fill-blue-400'
  }

  // ランクに応じたリングのクラス
  const getRankRingClass = (rank: number) => {
    if (rank === 2) return 'ring-gray-400'
    if (rank === 3) return 'ring-amber-700'
    return 'ring-blue-400'
  }

  // ランクに応じたバッジのクラス
  const getRankBadgeClass = (rank: number) => {
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
    return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
  }

  // ランクに応じたキラキラのクラス
  const getRankSparkleClass = (rank: number) => {
    if (rank === 2) return 'text-gray-300'
    if (rank === 3) return 'text-amber-600'
    return 'text-blue-400'
  }

  // 順位の接尾辞を取得
  const getRankSuffix = (rank: number): string => {
    if (rank === 2) return '2nd'
    if (rank === 3) return '3rd'
    return `${rank}th`
  }
</script>

<style scoped>
  .top-stars-container {
    min-height: 500px;
  }

  @keyframes bounceCrown {
    0%,
    100% {
      transform: translateY(0) translateX(-50%) rotate(-10deg);
    }
    50% {
      transform: translateY(-15px) translateX(-50%) rotate(10deg);
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
