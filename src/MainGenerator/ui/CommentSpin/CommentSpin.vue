<!-- src/MainGenerator/ui/CommentSpin/CommentSpin.vue -->
<template>
  <!-- TODO:h方向に対しても中央揃えにしたい -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 flex justify-center pointer-events-none z-10">
    <CommentSpinSelector
      :settings="spinSettings"
      :is-spinning="isSpinning"
      :slot-messages="slotMessages"
      :resolved-message="resolvedMessage"
      @animation-ready="onAnimationReady"
      @animation-end="onAnimationEnd"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, nextTick } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'
  import { OmikujiProcessor } from '@/MainGenerator/scripts/OmikujiProcess/OmikujiProcessor'
  import { CommentSpinSchema } from '@/types/OmikujiData/UiSettings/CommentSpinSchema'
  import type { BotMessageBubbleType } from '@/types'
  import CommentSpinSelector from './parts/CommentSpinSelector.vue'

  const ITEM_HEIGHT = 96

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  // 設定
  const spinSettings = computed(() => data.value.components.settings.commentSpin ?? CommentSpinSchema.parse({}))
  const characters = computed(() => data.value.characters)

  const { messages } = useFilteredBotMessages('commentSpin')

  const lastMessage = computed(() => {
    const arr = messages.value.filter((m) => m.source)
    return arr[arr.length - 1] ?? null
  })

  const slotMessages = ref<BotMessageBubbleType[]>([])
  const isSpinning = ref(false)
  const resolvedMessage = ref<BotMessageBubbleType | null>(null)

  // --- ロジック関数 ---

  const processor = new OmikujiProcessor()

  async function buildSlotMessages(msg: BotMessageBubbleType): Promise<BotMessageBubbleType[]> {
    // 1. 必要なプロパティが存在するか厳密にチェック（型ガード）
    // これにより、以降の処理で eventKey などの undefined 警告が消えます
    if (!msg.source?.eventKey || !msg.source?.category || !msg.source?.omikujiKey) {
      return []
    }

    // 型が確定したので、扱いやすいように定数化
    const { eventKey, category } = msg.source
    const categoryData = data.value[category]
    if (!categoryData) return []

    const eventData = categoryData[eventKey]
    if (!eventData?.omikuji) return []

    const results: BotMessageBubbleType[] = []

    // 2. 演出用のダミー（ハズレ目）を生成（5つ）
    // TODO:ハードコートしてるので定数化
    for (let i = 0; i < 5; i++) {
      const res = await processor.executeOmikuji(eventKey, eventData.omikuji, category, msg.origin, false)
      const bubble = res.find((m): m is BotMessageBubbleType => m.type === 'comment')
      if (bubble) results.push(bubble)
    }

    // 3. 【最重要】最後に「トリガーとなったメッセージそのもの」を追加
    // これで lastMessage と表示結果が 100% 一致します
    results.push(msg)

    return results
  }

  async function startSpin(msg: BotMessageBubbleType) {
    if (isSpinning.value) return

    const results = await buildSlotMessages(msg)
    if (!results.length) return

    isSpinning.value = false
    slotMessages.value = []
    await nextTick()

    slotMessages.value = results
    isSpinning.value = true
  }

  // Selector側のrefが準備できたタイミングでアニメーション実行
  async function onAnimationReady(el: HTMLElement) {
    const targetY = -((slotMessages.value.length - 1) * ITEM_HEIGHT)
    const anim = el.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${targetY}px)` }], {
      duration: 1400,
      easing: 'cubic-bezier(0.25, 0.1, 0.1, 1)',
      fill: 'forwards',
    })
    anim.onfinish = () => {
      isSpinning.value = false
      const last = slotMessages.value[slotMessages.value.length - 1]
      if (last) resolvedMessage.value = last
    }
  }

  function onAnimationEnd() {
    // 将来の拡張用（現在はonAnimationReadyのonfinishで処理）
  }

  // --- Watch ---

  watch(
    lastMessage,
    (msg) => {
      if (!msg) return
      startSpin(msg)
    },
    { immediate: true }
  )
</script>
