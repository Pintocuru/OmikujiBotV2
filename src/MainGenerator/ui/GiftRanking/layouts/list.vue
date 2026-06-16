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
      <div v-if="show('avatar')" class="avatar flex-shrink-0">
        <div class="rounded-full w-8" :class="rankRingClass(index)">
          <img v-if="message.profileImage" :src="message.profileImage" :alt="message.userName" />
          <div
            v-else
            class="bg-base-300 text-base-content w-full h-full flex items-center justify-center text-sm font-bold"
          >
            {{ message.userName?.charAt(0) ?? '?' }}
          </div>
        </div>
      </div>

      <!-- ユーザー名 -->
      <p v-if="show('name')" class="flex-1 text-sm text-base-content truncate">
        {{ message.userName }}
      </p>

      <!-- 金額 -->
      <p v-if="show('amount')" class="flex-shrink-0 text-sm font-bold text-primary">
        <span class="text-xs opacity-60">¥</span>{{ formatPrice(message.giftPrice) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GiftDisplayOption } from '@/types'
  import { GiftLayoutProps } from '../composables/types'
  import { formatPrice, rankRingClass, rankBadgeClass } from '../composables/useRankStyle'

  const props = defineProps<GiftLayoutProps>()
  const show = (key: GiftDisplayOption) => props.displayOptions.includes(key)
</script>
