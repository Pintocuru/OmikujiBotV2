// src\MainGenerator\ui\OmikujiBot\composables\useBotDisplay.ts
// TODO:toastを削除し、isToastに統一したい
import { ref, computed, Ref } from 'vue'
import { BotMessageType } from '@/types/'

const DISPLAY_CONFIG = {
  INTERVAL: 250,
  BASE_LIFE_TIME: 10000,
  THRESHOLD: 30,
  EXTRA_TIME_PER_CHAR: 100,
  LEAVE_ANIMATION_DELAY: 200,
} as const

export type DisplayMode = 'comment' | 'toast'

// 表示用の拡張BotMessage型
export type DisplayBotMessage = BotMessageType & {
  visible: boolean
  hideTimeout?: number
}

// 共通の基底composable
export const useBotDisplay = (botMessages: Ref<BotMessageType[]>, mode: DisplayMode) => {
  const displayedComments = ref<DisplayBotMessage[]>([])
  const animationFrameId = ref<number>()

  const comments = computed(() =>
    botMessages.value.filter((m) => {
      if (mode === 'toast') return !!m.bubble?.message
      return !!m.bubble?.message
    })
  )

  // MotionWrapperのafter-leaveイベントから呼ばれる関数
  const removeComment = (messageId: string) => {
    const index = displayedComments.value.findIndex((item) => item.id === messageId)
    if (index > -1) {
      const comment = displayedComments.value[index]
      // hideTimeoutをクリア
      if (comment.hideTimeout) {
        clearTimeout(comment.hideTimeout)
      }
      displayedComments.value.splice(index, 1)
    }
  }

  // コメントのvisibleをfalseにしてLeaveアニメーションを開始
  const hideComment = (messageId: string) => {
    const comment = displayedComments.value.find((item) => item.id === messageId)
    if (comment) {
      comment.visible = false
    }
  }

  // 表示制御ロジック
  const useEnhancedDisplayControl = () => {
    let lastTime = 0
    const processedMessageIds = new Set<string>()

    const processNewComments = (now: number) => {
      if (now - lastTime <= DISPLAY_CONFIG.INTERVAL) return

      const newComments = comments.value.filter((comment) => !processedMessageIds.has(comment.id))
      if (newComments.length === 0) return

      lastTime = now

      newComments.forEach((nextComment) => {
        let totalLifeTime: number

        if (nextComment.bubble?.displaySeconds !== undefined) {
          totalLifeTime = nextComment.bubble?.displaySeconds * 1000
        } else {
          const commentLength =
            mode === 'comment' ? (nextComment.bubble?.message?.length ?? 0) : (nextComment.bubble?.message?.length ?? 0)
          const extraTime = Math.max(commentLength - DISPLAY_CONFIG.THRESHOLD, 0) * DISPLAY_CONFIG.EXTRA_TIME_PER_CHAR
          totalLifeTime = DISPLAY_CONFIG.BASE_LIFE_TIME + extraTime
        }

        // DisplayBotMessageとして作成
        const displayMessage: DisplayBotMessage = {
          ...nextComment,
          visible: true,
        }

        // Enterアニメーション用に少し遅延してvisibleをtrueに
        setTimeout(() => {
          displayMessage.visible = true
        }, 50)

        // 指定時間後にLeaveアニメーションを開始
        displayMessage.hideTimeout = setTimeout(() => {
          hideComment(nextComment.id)
        }, totalLifeTime - DISPLAY_CONFIG.LEAVE_ANIMATION_DELAY) as unknown as number

        displayedComments.value.unshift(displayMessage)
        processedMessageIds.add(nextComment.id)
      })
    }

    const update = () => {
      const now = Date.now()
      processNewComments(now)
      animationFrameId.value = requestAnimationFrame(update)
    }

    const start = () => {
      processedMessageIds.clear()
      // 既存のタイムアウトをすべてクリア
      displayedComments.value.forEach((comment) => {
        if (comment.hideTimeout) {
          clearTimeout(comment.hideTimeout)
        }
      })
      displayedComments.value = []
      update()
    }

    const stop = () => {
      if (animationFrameId.value) {
        cancelAnimationFrame(animationFrameId.value)
      }
      // すべてのタイムアウトをクリア
      displayedComments.value.forEach((comment) => {
        if (comment.hideTimeout) {
          clearTimeout(comment.hideTimeout)
        }
      })
      processedMessageIds.clear()
      displayedComments.value = []
    }

    return { start, stop }
  }

  const displayControl = useEnhancedDisplayControl()

  return {
    displayedComments,
    removeComment,
    hideComment,
    start: displayControl.start,
    stop: displayControl.stop,
  }
}
