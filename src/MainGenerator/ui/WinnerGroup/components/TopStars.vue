<!-- src/MainGenerator/ui/WinnerGroup/components/TopStars.vue -->
<template>
  <div class="relative p-4">
    <!-- 背景レイヤー -->
    <div
      class="absolute inset-0 rounded-2xl border-5 border-warning/30 bg-base-200/95 backdrop-blur-sm pointer-events-none"
    ></div>

    <!-- タイトル -->
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.5, rotateZ: -10 }"
      :enter="{
        opacity: 1,
        scale: 1,
        rotateZ: 0,
        transition: { duration: 800, type: 'spring', stiffness: 100 },
      }"
      class="relative z-10 mb-8 text-center"
    >
      <div class="flex items-center justify-center gap-2 mb-1">
        <Star class="w-6 h-6 text-warning fill-warning animate-pulse" />
        <h2
          class="text-2xl font-bold bg-gradient-to-r from-warning via-primary to-secondary bg-clip-text text-transparent"
        >
          {{ label }}
        </h2>
        <Star class="w-6 h-6 text-warning fill-warning animate-pulse" style="animation-delay: 0.5s" />
      </div>
    </div>

    <!-- メインコンテンツ -->
    <TopStarsContent v-if="isVisible && users.length > 0" :users="users" :label="label" />

    <!-- ユーザーがいない場合 -->
    <div v-else-if="isVisible && users.length === 0" class="relative z-10 py-8 text-center opacity-60">
      <Users class="w-12 h-12 mx-auto mb-3 text-gray-400" />
      <p class="text-base">表示するユーザーがいません</p>
    </div>

    <!-- プレースホルダー -->
    <TopStarsPlaceholder v-else />
  </div>
</template>

<script setup lang="ts">
  import { UserVisitRecord } from '@/types/MainGenerator/'
  import TopStarsContent from './TopStars/content.vue'
  import TopStarsPlaceholder from './TopStars/placeholder.vue'
  import { Star, Users } from 'lucide-vue-next'

  defineProps<{
    users: UserVisitRecord[]
    label: string
    isVisible: boolean
  }>()
</script>
