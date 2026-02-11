<!-- src/MainGenerator/ui/WinnerGroup/components/ValentineCoupling.vue -->
<template>
  <div class="relative w-full max-w-3xl mx-auto p-4">
    <!-- 背景グラデーション -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-red-500/20 rounded-xl blur-xl"
    ></div>
    <div class="absolute inset-0 bg-base-100/95 backdrop-blur-sm rounded-xl border-2 border-primary/30"></div>

    <!-- メインコンテンツ -->
    <div class="relative space-y-4 z-10">
      <!-- タイトル -->
      <div
        v-if="label"
        v-motion
        :initial="{ opacity: 0, y: -30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }"
        class="text-center"
      >
        <h2
          class="text-3xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 bg-clip-text text-transparent"
        >
          {{ label }}
        </h2>
        <div class="flex items-center justify-center gap-3">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-pink-500"></div>
          <Heart class="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" />
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-purple-500"></div>
        </div>
      </div>

      <!-- ユーザーカード表示 -->
      <div v-if="users.length >= 2" class="relative">
        <!-- 中央のハートと矢印 -->
        <div
          v-motion
          :initial="{ scale: 0, rotate: -180 }"
          :enter="{ scale: 1, rotate: 0, transition: { duration: 1000, delay: 800, type: 'spring', stiffness: 100 } }"
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div class="relative">
            <!-- 光るハート背景 -->
            <div class="absolute inset-0 blur-xl">
              <Heart class="w-16 h-16 text-pink-500 fill-pink-500 animate-pulse" />
            </div>
            <!-- メインハート -->
            <Heart class="w-16 h-16 text-pink-500 fill-pink-500 relative animate-heartbeat" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-12 sm:gap-18 items-center">
          <!-- 左側のユーザー -->
          <div
            v-motion
            :initial="{ opacity: 0, x: -100, rotateY: -45 }"
            :enter="{ opacity: 1, x: 0, rotateY: 0, transition: { duration: 1000, delay: 400 } }"
            class="flex justify-end"
          >
            <div
              class="card-3d bg-gradient-to-br from-pink-500/10 to-pink-600/10 backdrop-blur-sm shadow-2xl w-56 border-2 border-pink-500/40 rounded-2xl overflow-hidden"
              style="transform-style: preserve-3d; transform: perspective(1000px) rotateY(20deg)"
            >
              <!-- カードの光沢効果 -->
              <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

              <figure class="px-6 pt-6 relative">
                <!-- キラキラエフェクト -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <Sparkles class="w-8 h-8 text-pink-300 animate-ping absolute top-2 right-8" />
                  <Sparkles
                    class="w-6 h-6 text-pink-400 animate-ping absolute top-8 right-4"
                    style="animation-delay: 0.5s"
                  />
                </div>

                <div class="avatar relative z-10 flex justify-center">
                  <div class="w-28 rounded-full ring-4 ring-pink-500 ring-offset-base-100 ring-offset-4 shadow-xl">
                    <img :src="users[0].profileImage" :alt="users[0].userName" class="object-cover" />
                  </div>
                </div>
              </figure>
              <div class="card-body items-center text-center p-5">
                <h3 class="card-title text-xl font-bold text-pink-600">{{ users[0].userName }}</h3>
                <div class="flex gap-1 mt-2">
                  <Heart class="w-4 h-4 text-pink-500 fill-pink-500 animate-bounce" />
                  <Heart class="w-4 h-4 text-pink-500 fill-pink-500 animate-bounce" style="animation-delay: 0.1s" />
                  <Heart class="w-4 h-4 text-pink-500 fill-pink-500 animate-bounce" style="animation-delay: 0.2s" />
                </div>
              </div>
            </div>
          </div>

          <!-- 右側のユーザー -->
          <div
            v-motion
            :initial="{ opacity: 0, x: 100, rotateY: 45 }"
            :enter="{ opacity: 1, x: 0, rotateY: 0, transition: { duration: 1000, delay: 400 } }"
            class="flex justify-start"
          >
            <div
              class="card-3d bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm shadow-2xl w-56 border-2 border-purple-500/40 rounded-2xl overflow-hidden"
              style="transform-style: preserve-3d; transform: perspective(1000px) rotateY(-20deg)"
            >
              <!-- カードの光沢効果 -->
              <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

              <figure class="px-6 pt-6 relative">
                <!-- キラキラエフェクト -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <Sparkles class="w-8 h-8 text-purple-300 animate-ping absolute top-2 left-8" />
                  <Sparkles
                    class="w-6 h-6 text-purple-400 animate-ping absolute top-8 left-4"
                    style="animation-delay: 0.5s"
                  />
                </div>

                <div class="avatar relative z-10 flex justify-center">
                  <div class="w-28 rounded-full ring-4 ring-purple-500 ring-offset-base-100 ring-offset-4 shadow-xl">
                    <img :src="users[1].profileImage" :alt="users[1].userName" class="object-cover" />
                  </div>
                </div>
              </figure>
              <div class="card-body items-center text-center p-5">
                <h3 class="card-title text-xl font-bold text-purple-600">{{ users[1].userName }}</h3>
                <div class="flex gap-1 mt-2">
                  <Heart class="w-4 h-4 text-purple-500 fill-purple-500 animate-bounce" />
                  <Heart class="w-4 h-4 text-purple-500 fill-purple-500 animate-bounce" style="animation-delay: 0.1s" />
                  <Heart class="w-4 h-4 text-purple-500 fill-purple-500 animate-bounce" style="animation-delay: 0.2s" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 浮遊するハート装飾 -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <Heart
            v-for="i in 6"
            :key="i"
            class="absolute text-pink-400/30 fill-pink-400/30"
            :class="getRandomHeartSize()"
            :style="getRandomHeartPosition(i)"
          />
        </div>
      </div>

      <!-- ユーザーが不足している場合 -->
      <div v-else class="text-center py-12 opacity-60">
        <HeartCrack class="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p class="text-lg">カップリングには2名のユーザーが必要です</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import { Heart, Sparkles, HeartCrack } from 'lucide-vue-next'

  defineProps<{
    users: UserVisitRecord[]
    label: string
  }>()

  // ランダムなハートサイズを取得
  const getRandomHeartSize = () => {
    const sizes = ['w-6 h-6', 'w-8 h-8', 'w-10 h-10']
    return sizes[Math.floor(Math.random() * sizes.length)]
  }

  // ランダムなハートの位置とアニメーションを取得
  const getRandomHeartPosition = (index: number) => {
    const positions = [
      { top: '10%', left: '15%', animationDelay: '0s' },
      { top: '20%', right: '10%', animationDelay: '0.5s' },
      { bottom: '15%', left: '10%', animationDelay: '1s' },
      { bottom: '20%', right: '15%', animationDelay: '1.5s' },
      { top: '50%', left: '5%', animationDelay: '2s' },
      { top: '50%', right: '5%', animationDelay: '2.5s' },
    ]
    return {
      ...positions[index % positions.length],
      animation: 'floatHeart 4s ease-in-out infinite',
    }
  }
</script>

<style scoped>
  @keyframes heartbeat {
    0%,
    100% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.1);
    }
    50% {
      transform: scale(1);
    }
    75% {
      transform: scale(1.15);
    }
  }

  @keyframes slideLeft {
    0%,
    100% {
      transform: translateX(0) translateY(-50%);
      opacity: 1;
    }
    50% {
      transform: translateX(-10px) translateY(-50%);
      opacity: 0.5;
    }
  }

  @keyframes slideRight {
    0%,
    100% {
      transform: translateX(0) translateY(-50%);
      opacity: 1;
    }
    50% {
      transform: translateX(10px) translateY(-50%);
      opacity: 0.5;
    }
  }

  @keyframes floatHeart {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
      opacity: 0.3;
    }
    25% {
      transform: translateY(-15px) rotate(5deg);
      opacity: 0.5;
    }
    50% {
      transform: translateY(-20px) rotate(-5deg);
      opacity: 0.3;
    }
    75% {
      transform: translateY(-10px) rotate(3deg);
      opacity: 0.4;
    }
  }

  .animate-heartbeat {
    animation: heartbeat 1.5s ease-in-out infinite;
  }

  .card-3d {
    transition: transform 0.3s ease;
  }
</style>
