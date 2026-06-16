<!-- src/ConfigMaker/UiEditor/GiftRanking/GiftRankingPreview.vue -->
<template>
  <HudPreview>
    <div class="bg-base-100 transparent-bg overflow-hidden" :class="[fontFamily]" :data-theme="giftRanking.color">
      <div v-if="previewMessages.length === 0">表示できるアイテムがありません</div>
      <!-- ランキングプレビュー -->
      <GiftRankingSelector :messages="previewMessages" :settings="giftRanking" />
    </div>

    <template #hud>
      <div class="space-x-2">
        <div class="badge badge-sm badge-primary">ギフト数: {{ previewGifts.length }}</div>
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
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'
  import { useGiftRanking } from '@/MainGenerator/ui/GiftRanking/composables/useGiftRanking'

  // モジュールスコープで一度だけ生成
  const DUMMY_USERS = Object.values(MOCK_USER_GIVEN_JA_MAP).map(({ label }) => label)
  const GIFT_AMOUNTS = [100, 200, 500, 1000, 2000, 5000, 10000]

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))
  const giftRanking = computed(() => GiftRankingSchema.parse(data.value.components?.settings?.GiftRanking ?? {}))

  let counter = 0
  const previewGifts = ref<OmikenCommentType[]>([])

  function addPreviewGift() {
    const idx = counter % DUMMY_USERS.length
    const userName = DUMMY_USERS[idx]
    const giftPrice = GIFT_AMOUNTS[counter % GIFT_AMOUNTS.length]
    counter++

    previewGifts.value.push(
      OmikenCommentSchema.parse({
        userName,
        profileImage: getAvatarUrl(userName),
        comment: `ギフト${counter}`,
        giftPrice,
      })
    )
  }

  function resetPreview() {
    counter = 0
    previewGifts.value = []
  }

  const previewMessages = useGiftRanking(previewGifts, giftRanking)
</script>
