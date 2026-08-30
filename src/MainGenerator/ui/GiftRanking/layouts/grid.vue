<!-- src/MainGenerator/ui/GiftRanking/layouts/grid.vue -->
<template>
  <div class="flex flex-row gap-4 justify-center">
    <div v-for="(message, index) in messages" :key="message.id" class="flex flex-col items-center gap-1 py-2">
      <MotionWrapper :key="message.id" :visible="true" motion="bounce">
        <div class="relative">
          <RankingAvatar
            v-if="show('avatar')"
            :user-name="message.userName"
            :profile-image="message.profileImage"
            :size="iconSize"
            :ring-class="show('rank') ? rankRingClass(index) : ''"
          />
          <div
            v-if="show('rank')"
            class="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-lg font-bold"
            :class="rankBadgeClass(index)"
          >
            {{ index + 1 }}
          </div>
        </div>

        <p v-if="show('name')" class="text-xl text-base-content truncate w-full text-center leading-tight">
          {{ message.userName }}
        </p>

        <p v-if="show('amount')" class="text-xl font-bold text-primary text-center leading-none">
          <span class="opacity-60">¥</span>{{ formatPrice(message.giftPrice) }}
        </p>
      </MotionWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { GiftDisplayOption } from '@/types'
  import { GiftLayoutProps } from '../composables/types'
  import RankingAvatar from './RankingAvatar.vue'
  import { formatPrice, rankRingClass, rankBadgeClass } from '../composables/useRankStyle'
  import MotionWrapper from '@main/ui/CommentBubble/MotionVariants/MotionWrapper.vue'

  const props = defineProps<GiftLayoutProps>()
  const show = (key: GiftDisplayOption) => props.displayOptions.includes(key)
  const iconSize = computed(() => props.iconSize ?? 80)
</script>
