<!-- src/MainGenerator/ui/GiftRanking/GiftRanking.vue -->
<template>
  <CenteringWrapper>
    <GiftRankingSelector :settings="settings" :messages="rankedGifts" />
  </CenteringWrapper>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { GiftRankingSchema } from '@/types'
  import GiftRankingSelector from './parts/GiftRankingSelector.vue'
  import CenteringWrapper from '../common/CenteringWrapper.vue'
  import { useAppStore } from '@main/stores/useAppStore'

  const appStore = useAppStore()

  const { omikens } = storeToRefs(appStore)
  const settings = computed(() => GiftRankingSchema.parse(appStore.data.components?.settings?.GiftRanking ?? {}))

  const rankedGifts = computed(() => {
    const { rankingLimit, sortOrder, minimumAmount } = settings.value

    return omikens.value
      .filter((m) => m.giftPrice !== null && m.giftPrice > 0 && m.giftPrice >= minimumAmount)
      .sort((a, b) => {
        if (sortOrder === 'high') {
          return (b.giftPrice ?? 0) - (a.giftPrice ?? 0)
        }
        return b.timestamp - a.timestamp
      })
      .slice(0, rankingLimit)
  })
</script>
