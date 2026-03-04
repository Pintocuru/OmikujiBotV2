<!-- src/MainGenerator/ui/WinnerGroup/components/ValentineCoupling.vue -->
<template>
  <!-- 枠線（absolute 背景） -->
  <div class="absolute inset-0 rounded-2xl border-2 border-primary/30 pointer-events-none"></div>

  <div class="relative z-10 space-y-3">
    <!-- タイトル -->
    <div v-if="label" class="text-center space-y-1">
      <h2 class="text-2xl font-bold">
        {{ label }}
      </h2>

      <div class="flex items-center justify-center gap-2">
        <div class="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
        <Heart class="w-4 h-4" />
        <div class="h-px w-12 bg-gradient-to-l from-transparent to-secondary"></div>
      </div>
    </div>

    <!-- メインコンテンツ -->
    <ValentineCouplingContent v-if="isVisible" :users="users" :label="label" />

    <!-- プレースホルダー -->
    <ValentineCouplingPlaceholder v-else />
  </div>
</template>

<script setup lang="ts">
  import { UserVisitRecord } from '@/types/MainGenerator/'
  import ValentineCouplingContent from './ValentineCoupling/content.vue'
  import ValentineCouplingPlaceholder from './ValentineCoupling/Placeholder.vue'
  import { Heart } from 'lucide-vue-next'

  defineProps<{
    users: UserVisitRecord[]
    label: string
    isVisible: boolean
  }>()
</script>
