// src/MainGenerator/ui/GiftRanking/composables/useGiftRanking.ts
import { computed, type Ref } from 'vue'
import type { GiftRankingType } from '@/types'
import { OmikenCommentType } from '@shared/types'

export function useGiftRanking(messages: Ref<OmikenCommentType[]>, settings: Ref<GiftRankingType>) {
  return computed(() => {
    const { rankingLimit, sortOrder, minimumAmount } = settings.value

    return messages.value
      .filter((m) => (m.giftPrice ?? 0) >= minimumAmount && m.giftPrice! > 0)
      .sort((a, b) => (sortOrder === 'high' ? (b.giftPrice ?? 0) - (a.giftPrice ?? 0) : b.timestamp - a.timestamp))
      .slice(0, rankingLimit)
  })
}
