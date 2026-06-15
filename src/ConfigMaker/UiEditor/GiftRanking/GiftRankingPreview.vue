<!-- src/ConfigMaker/UiEditor/GiftRanking/GiftRankingPreview.vue -->
<template>
  <HudPreview>
    <div class="bg-base-100 transparent-bg overflow-hidden" :class="[fontFamily]" :data-theme="giftRanking.color">
      <GiftRankingSelector :messages="previewMessages" :settings="giftRanking" />
    </div>

    <template #hud>
      <div class="space-x-2">
        <div class="badge badge-sm badge-primary">ギフト数: {{ previewMessages.length }}</div>
        <button class="btn btn-xs btn-primary" @click="addPreviewGift">🎁 ギフト追加</button>
        <button class="btn btn-xs btn-warning" @click="resetPreview">🔄 リセット</button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { GiftRankingSchema, useFontFamily } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import GiftRankingSelector from '@main/ui/GiftRanking/parts/GiftRankingSelector.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { OmikenCommentSchema, OmikenCommentType } from '@shared/types'
  import { MOCK_USER_GIVEN_JA_MAP } from '@/common/MockUser/MockUserJaMaps'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))
  const giftRanking = computed(() => GiftRankingSchema.parse(data.value.components?.settings?.GiftRanking ?? {}))

  // ダミーユーザーデータ
  const DUMMY_USERS = Object.values(MOCK_USER_GIVEN_JA_MAP).map((user) => ({
    userName: user.label,
    profileImage: '',
  }))

  // ギフト金額パターン（minimumAmount を考慮しやすいよう幅広く）
  const GIFT_AMOUNTS = [100, 200, 500, 1000, 2000, 5000, 10000]

  let counter = 0
  const previewGifts = ref<OmikenCommentType[]>([])

  function addPreviewGift() {
    counter++
    const user = DUMMY_USERS[(counter - 1) % DUMMY_USERS.length]
    const giftPrice = GIFT_AMOUNTS[(counter - 1) % GIFT_AMOUNTS.length]

    const dummy: OmikenCommentType = OmikenCommentSchema.parse({
      userName: `${user.userName}${Math.ceil(counter / DUMMY_USERS.length) > 1 ? Math.ceil(counter / DUMMY_USERS.length) : ''}`,
      profileImage: user.profileImage,
      comment: `ギフト${counter}`,
      giftPrice,
    })

    previewGifts.value = [...previewGifts.value, dummy]
  }

  function resetPreview() {
    counter = 0
    previewGifts.value = []
  }

  // GiftRanking.vue と同じフィルタ・ソートロジックをプレビューにも適用
  const previewMessages = computed(() => {
    const { rankingLimit, sortOrder, minimumAmount } = giftRanking.value

    return previewGifts.value
      .filter((m) => m.giftPrice !== null && m.giftPrice > 0 && m.giftPrice >= minimumAmount)
      .sort((a, b) => {
        if (sortOrder === 'high') return (b.giftPrice ?? 0) - (a.giftPrice ?? 0)
        return b.timestamp - a.timestamp
      })
      .slice(0, rankingLimit)
  })
</script>
