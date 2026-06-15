<!-- src/MainGenerator/ui/GiftRanking/layouts/grid.vue -->
<template>
  <div class="p-3 w-full">
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
      <div
        v-for="(message, index) in messages"
        :key="message.id"
        class="card bg-base-100 shadow-md border border-base-200 relative overflow-hidden"
        :class="rankCardClass(index)"
      >
        <!-- 順位バッジ -->
        <div
          class="absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10"
          :class="rankBadgeClass(index)"
        >
          {{ index + 1 }}
        </div>

        <div class="card-body items-center text-center p-3 pt-5 gap-1">
          <!-- プロフィールアイコン -->
          <div class="avatar">
            <div class="rounded-full ring-2 w-12" :class="rankRingClass(index)">
              <img v-if="message.profileImage" :src="message.profileImage" :alt="message.userName" />
              <div
                v-else
                class="bg-neutral text-neutral-content w-full h-full flex items-center justify-center text-lg font-bold"
              >
                {{ message.userName?.charAt(0) ?? '?' }}
              </div>
            </div>
          </div>

          <!-- ユーザー名 -->
          <p class="text-xs font-medium text-base-content truncate w-full leading-tight">
            {{ message.userName }}
          </p>

          <!-- 金額 -->
          <p class="font-bold leading-none" :class="rankAmountClass(index)">
            <span class="text-xs opacity-70">¥</span>{{ formatPrice(message.giftPrice) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GiftRankingType } from '@/types'
  import { OmikenCommentType } from '@shared/types'

  defineProps<{
    messages: OmikenCommentType[]
    settings: GiftRankingType
  }>()

  const rankCardClass = (index: number): string => {
    if (index === 0) return 'ring-2 ring-yellow-400'
    if (index === 1) return 'ring-2 ring-gray-400'
    if (index === 2) return 'ring-2 ring-amber-600'
    return ''
  }

  const rankBadgeClass = (index: number): string => {
    if (index === 0) return 'bg-yellow-400 text-yellow-900'
    if (index === 1) return 'bg-gray-400 text-gray-900'
    if (index === 2) return 'bg-amber-600 text-white'
    return 'bg-base-300 text-base-content'
  }

  const rankRingClass = (index: number): string => {
    if (index === 0) return 'ring-yellow-400'
    if (index === 1) return 'ring-gray-400'
    if (index === 2) return 'ring-amber-600'
    return 'ring-base-300'
  }

  const rankAmountClass = (index: number): string => {
    if (index === 0) return 'text-base text-yellow-500'
    if (index === 1) return 'text-base text-gray-400'
    if (index === 2) return 'text-base text-amber-600'
    return 'text-sm text-base-content'
  }

  const formatPrice = (price: number | null): string => {
    if (price === null) return '0'
    return price.toLocaleString()
  }
</script>
