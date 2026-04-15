// src/MainGenerator/ui/CommentSpin/composables/useCommentSpinMessages.ts
import { computed, watch, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { BotMessageBubbleType } from '@/types'
import { OmikujiProcessor } from '@/MainGenerator/scripts/OmikujiProcess/OmikujiProcessor'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { storeToRefs } from 'pinia'

interface UseCommentSpinMessagesOptions {
  messages: ComputedRef<BotMessageBubbleType[]>
  startSpin: (msgs: BotMessageBubbleType[]) => void
  isSpinning: Ref<boolean> // ← 追加
}

const DUMMY_COUNT = 5
const QUEUE_LIMIT = 0 // 最大積み数（お好みで）

export function useCommentSpinMessages({ messages, startSpin, isSpinning }: UseCommentSpinMessagesOptions) {
  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const processor = new OmikujiProcessor()

  const queue = ref<BotMessageBubbleType[]>([])

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

  // スピン終了を監視して次を流す
  watch(isSpinning, async (spinning) => {
    if (spinning) return
    const next = queue.value.shift()
    if (!next) return
    const results = await buildSlotMessages(next)
    if (results.length) startSpin(results)
  })

  watch(
    lastMessage,
    async (msg) => {
      if (!msg) return
      if (!isSpinning.value) {
        // 空きがあればすぐ回す
        const results = await buildSlotMessages(msg)
        if (results.length) startSpin(results)
      } else {
        // 回転中ならキューに積む（上限超えは捨てる）
        if (queue.value.length < QUEUE_LIMIT) {
          queue.value.push(msg)
        }
      }
    },
    { immediate: true }
  )

  return { lastMessage, queue }
}
