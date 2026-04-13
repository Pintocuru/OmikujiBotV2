// src/MainGenerator/ui/CommentSpin/composables/useCommentSpinMessages.ts
import { computed, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type { BotMessageBubbleType } from '@/types'
import { OmikujiProcessor } from '@/MainGenerator/scripts/OmikujiProcess/OmikujiProcessor'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { storeToRefs } from 'pinia'

interface UseCommentSpinMessagesOptions {
  messages: ComputedRef<BotMessageBubbleType[]> /** フィルタ済みメッセージ */
  startSpin: (msgs: BotMessageBubbleType[]) => void /** スピン開始を通知するコールバック */
}

const DUMMY_COUNT = 5

export function useCommentSpinMessages({ messages, startSpin }: UseCommentSpinMessagesOptions) {
  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const processor = new OmikujiProcessor()

  const lastMessage = computed(() => {
    const arr = messages.value.filter((m) => m.source)
    return arr[arr.length - 1] ?? null
  })

  async function buildSlotMessages(msg: BotMessageBubbleType): Promise<BotMessageBubbleType[]> {
    if (!msg.source?.eventKey || !msg.source?.category || !msg.source?.omikujiKey) return []

    const { eventKey, category } = msg.source

    const categoryData = data.value[category]
    if (!categoryData) return []

    const eventData = categoryData[eventKey]
    if (!eventData?.omikuji) return []

    const results: BotMessageBubbleType[] = []

    for (let i = 0; i < DUMMY_COUNT; i++) {
      const res = await processor.executeDummyOmikuji(eventKey, eventData.omikuji, category, msg.origin)
      const bubble = res.find((m): m is BotMessageBubbleType => m.type === 'comment')
      if (bubble) results.push(bubble)
    }

    results.push(msg)
    return results
  }

  watch(
    lastMessage,
    async (msg) => {
      if (!msg) return
      const results = await buildSlotMessages(msg)
      if (results.length) startSpin(results)
    },
    { immediate: true }
  )

  return { lastMessage }
}
