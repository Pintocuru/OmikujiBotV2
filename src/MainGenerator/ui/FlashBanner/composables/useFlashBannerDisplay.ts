// src/MainGenerator/ui/FlashBanner/composables/useFlashBannerDisplay.ts
import { computed, ref, type Ref } from 'vue'
import { BotMessageBubbleType } from '@/types'

interface UseFlashBannerDisplayOptions {
  displayedComments: Ref<BotMessageBubbleType[]>
  defaultMessage: Readonly<Ref<BotMessageBubbleType>>
  onMessageChanged?: () => void /** メッセージ切り替え時に呼び出される（blink など副作用用） */
}

export function useFlashBannerDisplay({
  displayedComments,
  defaultMessage,
  onMessageChanged,
}: UseFlashBannerDisplayOptions) {
  // 直前に表示していたメッセージIDを保持（computed の中で副作用を起こさないよう ref で管理）
  const previousId = ref<string | undefined>(undefined)

  // 「visible なコメント」= display?.visible が true のもの
  // removeComment が呼ばれていないゾンビ（visible=false）は除外される
  const visibleComment = computed(() => displayedComments.value.find((m) => m.display?.visible === true) ?? null)

  const currentMessage = computed(() => {
    const msg = visibleComment.value ?? defaultMessage.value

    // ID が変わったときだけ onMessageChanged を呼ぶ
    // computed の中の副作用は技術的には非推奨だが、
    // ここでは「派生値の計算に影響しない通知のみ」なので許容範囲
    if (msg.id !== previousId.value) {
      if (previousId.value !== undefined) {
        onMessageChanged?.()
      }
      previousId.value = msg.id
    }

    return msg
  })

  /** インターバル hook などから呼ぶ：デフォルト表示中かどうか */
  const isShowingDefault = () => visibleComment.value === null

  return {
    currentMessage,
    isShowingDefault,
  }
}
