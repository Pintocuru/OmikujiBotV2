<!-- src/MainGenerator/ui/WinnerGroup/components/ValentineCoupling/content.vue -->
<template>
  <!-- ユーザーカード表示 -->
  <div v-if="users.length >= 2" class="relative">
    <!-- 中央のハートと矢印 -->
    <div
      :key="`heart-${animationKey}`"
      v-motion
      :initial="{ scale: 0, rotate: -180 }"
      :enter="{ scale: 1, rotate: 0, transition: { duration: 1000, delay: 800, type: 'spring', stiffness: 100 } }"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
    >
      <div class="relative">
        <!-- 光るハート背景 -->
        <div class="absolute inset-0 blur-lg">
          <Heart class="w-5 h-5 text-accent fill-accent animate-pulse" />
        </div>
        <!-- メインハート -->
        <Heart class="w-12 h-12 text-accent fill-accent relative animate-heartbeat" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-8 sm:gap-12 items-center">
      <!-- 左側のユーザー -->
      <ValentineUserCard :key="`left-${animationKey}`" :user="users[0]" position="left" color-scheme="primary" />

      <!-- 右側のユーザー -->
      <ValentineUserCard :key="`right-${animationKey}`" :user="users[1]" position="right" color-scheme="secondary" />
    </div>

    <!-- 浮遊するハート装飾 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <Heart
        v-for="i in 6"
        :key="i"
        :class="[getRandomHeartSize(), getHeartColor(i)]"
        :style="getRandomHeartPosition(i)"
        class="absolute"
      />
    </div>
  </div>

  <!-- ユーザーが不足している場合 -->
  <div v-else class="text-center py-8 opacity-60 cursor-pointer hover:opacity-80 transition">
    <HeartCrack class="w-12 h-12 mx-auto mb-3 text-gray-400" />
    <p class="text-base">
      カップリングには2名のユーザーが必要です<br />
      クリックして更新する
    </p>
  </div>
</template>

<script setup lang="ts">
  import { watch, ref } from 'vue'
  import { UserVisitRecord } from '@/types/MainGenerator/'
  import ValentineUserCard from './ValentineUserCard.vue'
  import { Heart, HeartCrack } from 'lucide-vue-next'

  const props = defineProps<{
    users: UserVisitRecord[]
    label: string
  }>()

  // アニメーションキーを管理（propsが変更されたら再アニメーション）
  const animationKey = ref(0)

  // usersが変更されたらアニメーションキーを更新
  watch(
    () => props.users,
    () => {
      animationKey.value++
    },
    { deep: true }
  )

  // ランダムなハートサイズを取得
  const getRandomHeartSize = () => {
    const sizes = ['w-4 h-4', 'w-5 h-5', 'w-6 h-6']
    return sizes[Math.floor(Math.random() * sizes.length)]
  }

  // ハートの色をテーマカラーから選択
  const getHeartColor = (index: number) => {
    const colors = ['text-primary/30 fill-primary/30', 'text-secondary/30 fill-secondary/30']
    return colors[index % colors.length]
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
</style>
