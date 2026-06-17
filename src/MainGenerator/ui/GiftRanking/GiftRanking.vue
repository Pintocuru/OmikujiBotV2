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
  import { useGiftRanking } from './composables/useGiftRanking'
  import GiftRankingSelector from './parts/GiftRankingSelector.vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import CenteringWrapper from '../common/CenteringWrapper.vue'

  const appStore = useAppStore()
  const { omikens } = storeToRefs(appStore)
  const settings = computed(() => GiftRankingSchema.parse(appStore.data.components?.settings?.GiftRanking ?? {}))

  const rankedGifts = useGiftRanking(omikens, settings)
</script>
