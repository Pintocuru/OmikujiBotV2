<!-- src/ConfigMaker/UiEditor/CommentSpin/CommentSpinPreview.vue -->
<template>
  <HudPreview :maxHeightClass="isDev ? 'min-h-32' : ''" :isAdminOnly="true">
    <div class="flex justify-center" :class="[fontFamily]">
      <CommentSpinSelector
        :settings="settings"
        :isSpinning="isSpinning"
        :slotMessages="slotMessages"
        :resolvedMessage="resolvedMessage"
        :characters="characterMap"
        @animation-ready="(el, h) => onAnimationReady(el, h)"
      />
    </div>

    <!-- 右下に表示するHUD（スケーリングされない） -->
    <template #hud>
      <div class="flex gap-2">
        <button class="btn btn-primary btn-sm" @click="startSpin(createSlotMessages())">スピン</button>
        <button class="btn btn-secondary btn-sm" @click="startSpin(createLongSlotMessages())">長文スロット</button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageBubbleSchema, isDev, useFontFamily } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import CommentSpinSelector from '@main/ui/CommentSpin/parts/CommentSpinSelector.vue'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import type { CommentSpinType } from '@/types/OmikujiData/'
  import { useCommentSpinAnimation } from '@/MainGenerator/ui/CommentSpin/composables/useCommentSpinAnimation'

  const props = defineProps<{
    settings: CommentSpinType
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const { characterMap } = useCharacterManager()
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))

  const animationType = computed(() => props.settings.animation)

  const { slotMessages, isSpinning, resolvedMessage, startSpin, onAnimationReady } = useCommentSpinAnimation({
    type: animationType,
  })

  const fruits = ['りんご', 'バナナ', 'みかん', 'ぶどう', 'メロン', 'いちご']

  function shuffle<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5)
  }

  function createSlotMessages() {
    const shuffled = shuffle(fruits)

    return shuffled.map((fruit, i) =>
      BotMessageBubbleSchema.parse({
        id: `slot-${i}`,
        bubble: {
          name: null,
          message: fruit,
        },
      })
    )
  }

  const longSweets = [
    '北海道ミルクたっぷり濃厚クリームどら焼き',
    '宇治抹茶と黒蜜を使った贅沢和風ロールケーキ',
    'とろける生チョコ入り濃厚ショコラバウムクーヘン',
    '丹波黒豆をふんだんに使ったしっとり和風パウンド',
    'あまおう苺クリームたっぷり贅沢ショートケーキ風大福',
    '発酵バター香るサクサク食感の極上フィナンシェ',
  ]

  function createLongSlotMessages() {
    const shuffled = shuffle(longSweets)
    const picked = shuffled[Math.floor(Math.random() * shuffled.length)]

    const sequence = [...shuffled, picked]

    return sequence.map((text, i) =>
      BotMessageBubbleSchema.parse({
        id: `long-${i}`,
        bubble: {
          name: null,
          message: text,
        },
      })
    )
  }
</script>
