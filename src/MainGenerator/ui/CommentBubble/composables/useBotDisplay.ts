// src/MainGenerator/ui/CommentBubble/composables/useBotDisplay.ts
import { ref, computed, Ref } from 'vue'
import { BotMessageBubbleType } from '@/types/'

const DISPLAY_CONFIG = {
  INTERVAL: 250,
  BASE_LIFE_TIME: 10000,
  THRESHOLD: 30,
  EXTRA_TIME_PER_CHAR: 100,
  LEAVE_ANIMATION_DELAY: 200,
  MAX_MESSAGE_LENGTH: 100,
} as const

// 共通の基底composable
export const useBotDisplay = (botMessages: Ref<BotMessageBubbleType[]>) => {
  const displayedComments = ref<BotMessageBubbleType[]>([])
  const animationFrameId = ref<number>()

  const comments = computed(() =>
    botMessages.value.filter((m) => {
      return !!m.bubble?.message
    })
  )

  // MotionWrapperのafter-leaveイベントから呼ばれる関数
  const removeComment = (messageId: string) => {
    const index = displayedComments.value.findIndex((item) => item.id === messageId)
    if (index > -1) {
      const comment = displayedComments.value[index]
      // hideTimeoutをクリア
      if (comment.display?.hideTimeout) {
        clearTimeout(comment.display?.hideTimeout)
      }
      displayedComments.value.splice(index, 1)
    }
  }

  // コメントのvisibleをfalseにしてLeaveアニメーションを開始
  const hideComment = (messageId: string) => {
    const comment = displayedComments.value.find((item) => item.id === messageId)
    if (comment && comment.display) {
      comment.display.visible = false
    }
  }

  // 表示制御ロジック
  const useEnhancedDisplayControl = () => {
    let lastTime = 0
    const processedMessages = new Map<string, string>()

    const processNewComments = (now: number) => {
      if (now - lastTime <= DISPLAY_CONFIG.INTERVAL) return

      const newComments = comments.value.filter((comment) => {
        const key = buildMessageKey(comment)
        const prev = processedMessages.get(comment.id)
        return prev !== key
      })
      if (newComments.length === 0) return

      lastTime = now

      newComments.forEach((nextComment) => {
        let totalLifeTime: number | null = null

        const sec = nextComment.bubble?.displaySeconds

        if (sec === null) {
          // null → 無限表示
          totalLifeTime = null
        } else if (sec !== undefined) {
          // 数値が入っている → 指定秒数
          totalLifeTime = sec * 1000
        } else {
          // undefined → 自動計算
          const rawLength = nextComment.bubble?.message?.length ?? 0
          const commentLength = Math.min(rawLength, DISPLAY_CONFIG.MAX_MESSAGE_LENGTH)
          const extraTime = Math.max(commentLength - DISPLAY_CONFIG.THRESHOLD, 0) * DISPLAY_CONFIG.EXTRA_TIME_PER_CHAR
          totalLifeTime = DISPLAY_CONFIG.BASE_LIFE_TIME + extraTime
        }

        // DisplayBotMessageとして作成
        const displayMessage: BotMessageBubbleType = {
          ...nextComment,
          display: { visible: true },
        }

        // Enterアニメーション用に少し遅延してvisibleをtrueに
        setTimeout(() => {
          if (displayMessage.display) displayMessage.display.visible = true
        }, 50)

        // 指定時間後にLeaveアニメーションを開始
        if (displayMessage.display && totalLifeTime !== null) {
          displayMessage.display.hideTimeout = setTimeout(() => {
            hideComment(nextComment.id)
          }, totalLifeTime - DISPLAY_CONFIG.LEAVE_ANIMATION_DELAY) as unknown as number
        }

        displayedComments.value.unshift(displayMessage)
        processedMessages.set(nextComment.id, buildMessageKey(nextComment))
      })
    }

    const update = () => {
      const now = Date.now()
      processNewComments(now)
      animationFrameId.value = requestAnimationFrame(update)
    }

    const start = () => {
      processedMessages.clear()
      // 既存のタイムアウトをすべてクリア
      displayedComments.value.forEach((comment) => {
        if (comment.display?.hideTimeout) {
          clearTimeout(comment.display?.hideTimeout)
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
        if (comment.display?.hideTimeout) {
          clearTimeout(comment.display?.hideTimeout)
        }
      })
      processedMessages.clear()
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
const buildMessageKey = (msg: BotMessageBubbleType) => {
  return [msg.bubble?.message ?? '', msg.bubble?.displaySeconds ?? 'auto'].join('|')
}
