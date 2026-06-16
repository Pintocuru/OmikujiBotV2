<!-- src/MainGenerator/ui/GiftRanking/layouts/PodiumItem.vue -->
<template>
  <div v-if="message" class="flex flex-col items-center gap-1">
    <RankingAvatar
      :user-name="message.userName"
      :profile-image="message.profileImage"
      :size="iconSize"
      :ring-class="rankRingClass(index)"
    />
    <p
      v-if="show('name')"
      class="text-xl text-base-content truncate text-center"
      :style="{ maxWidth: `${iconSize + 8}px` }"
    >
      {{ message.userName }}
    </p>
    <p v-if="show('amount')" class="text-xl font-bold" :class="amountClass">
      <span class="opacity-60">¥</span>{{ formatPrice(message.giftPrice) }}
    </p>
    <!-- 台座 -->
    <div
      class="rounded-t-md w-16 flex items-center justify-center font-bold"
      :class="[pedColor, textSize]"
      :style="{ height: `${pedHeight}px` }"
    >
      {{ index + 1 }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { GiftDisplayOption } from '@/types'
  import { OmikenCommentType } from '@shared/types'
  import RankingAvatar from './RankingAvatar.vue'
  import { formatPrice, rankRingClass } from '../composables/useRankStyle'

  const props = defineProps<{
    message: OmikenCommentType | undefined
    index: number // 0=1位, 1=2位, 2=3位
    show: (key: GiftDisplayOption) => boolean
    iconSize: number
  }>()

  // 順位ごとの設定テーブル
  const CONFIG = [
    {
      pedHeight: 64,
      pedColor: 'bg-primary   text-primary-content',
      amountClass: 'text-xl text-primary',
      textSize: 'text-xl',
    }, // 1位
    {
      pedHeight: 40,
      pedColor: 'bg-secondary text-secondary-content',
      amountClass: 'text-xl text-secondary',
      textSize: 'text-xl',
    }, // 2位
    {
      pedHeight: 28,
      pedColor: 'bg-accent    text-accent-content',
      amountClass: 'text-xl text-accent',
      textSize: 'text-xl',
    }, // 3位
  ] as const

  const cfg = computed(() => CONFIG[props.index] ?? CONFIG[2])
  const pedHeight = computed(() => cfg.value.pedHeight)
  const pedColor = computed(() => cfg.value.pedColor)
  const amountClass = computed(() => cfg.value.amountClass)
  const textSize = computed(() => cfg.value.textSize)
</script>
