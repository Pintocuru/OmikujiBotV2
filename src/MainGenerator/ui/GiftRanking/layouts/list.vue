<!-- src/MainGenerator/ui/GiftRanking/layouts/list.vue -->
<template>
  <div class="p-2 w-full flex flex-col gap-1">
    <div
      v-for="(message, index) in messages"
      :key="message.id"
      class="flex items-center gap-3 px-3 py-2 rounded-lg bg-base-100"
    >
      <!-- 順位 -->
      <div
        v-if="show('rank')"
        class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
        :class="rankBadgeClass(index)"
      >
        {{ index + 1 }}
      </div>

      <!-- アバター -->
      <RankingAvatar
        v-if="show('avatar')"
        :user-name="message.userName"
        :profile-image="message.profileImage"
        :size="iconSize"
        :ring-class="show('rank') ? rankRingClass(index) : ''"
      />

      <!-- ユーザー名 -->
      <p v-if="show('name')" class="flex-1 text-xl text-base-content truncate">
        {{ message.userName }}
      </p>

      <!-- 金額 -->
      <p v-if="show('amount')" class="flex-shrink-0 text-xl font-bold text-primary">
        <span class="text-xs opacity-60">¥</span>{{ formatPrice(message.giftPrice) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GiftDisplayOption } from '@/types'
  import { GiftLayoutProps } from '../composables/types'
  import RankingAvatar from './RankingAvatar.vue'
  import { formatPrice, rankRingClass, rankBadgeClass } from '../composables/useRankStyle'

  const props = defineProps<GiftLayoutProps>()
  const show = (key: GiftDisplayOption) => props.displayOptions.includes(key)
</script>
