<!-- src/MainGenerator/ui/GiftRanking/layouts/ScrollItem.vue -->
<template>
  <div
    class="flex flex-col items-center gap-1 py-2 px-3 rounded-xl bg-base-100 flex-shrink-0 relative"
    :style="{ width: `${iconSize + 24}px` }"
  >
    <div v-if="show('avatar')" class="relative">
      <RankingAvatar
        :user-name="message.userName"
        :profile-image="message.profileImage"
        :size="iconSize"
        :ring-class="show('rank') ? rankRingClass(index) : ''"
      />
      <div
        v-if="show('rank')"
        class="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xl font-bold"
        :class="rankBadgeClass(index)"
      >
        {{ index + 1 }}
      </div>
    </div>

    <div v-else-if="show('rank')" class="badge badge-xl font-bold" :class="rankBadgeClass(index)">
      {{ index + 1 }}
    </div>

    <p v-if="show('name')" class="text-xl text-base-content truncate w-full text-center leading-tight">
      {{ message.userName }}
    </p>

    <p v-if="show('amount')" class="text-xl font-bold text-primary leading-none">
      <span class="opacity-60">¥</span>{{ formatPrice(message.giftPrice) }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import { GiftDisplayOption } from '@/types'
  import RankingAvatar from './RankingAvatar.vue'
  import { formatPrice, rankRingClass, rankBadgeClass } from '../composables/useRankStyle'
  import { OmikenCommentType } from '@shared/types'

  defineProps<{
    message: OmikenCommentType
    index: number
    iconSize: number
    show: (key: GiftDisplayOption) => boolean
  }>()
</script>
