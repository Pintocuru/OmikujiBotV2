// src\MainGenerator\components\OmikujiBot\useBotMessage.ts
import { ref, computed, Ref } from 'vue'
import { BotMessage, getImagePath } from '@/types/'

const DISPLAY_CONFIG = {
  INTERVAL: 250,
  BASE_LIFE_TIME: 10000,
  THRESHOLD: 30,
  EXTRA_TIME_PER_CHAR: 100,
} as const

export type DisplayMode = 'comment' | 'toast'

export const useBotCommentDisplay = (botMessages: Ref<BotMessage[]>, mode: DisplayMode = 'comment') => {
  const displayedComments = ref<BotMessage[]>([])
  const animationFrameId = ref<number>()

  const comments = computed(() =>
    botMessages.value.filter((message) => (mode === 'comment' ? !message.isToast : message.isToast))
  )

  const handleImageError = (message: BotMessage) => {
    console.error(`画像が読み込めません: ${message.profileImage}`, {
      name: message.name,
      id: message.id,
      originalPath: message.profileImage,
      processedPath: getImagePath(message.profileImage ?? ''),
    })
  }

  const removeItem = (messageId: number) => {
    const index = displayedComments.value.findIndex((item) => item.id === messageId)
    if (index > -1) displayedComments.value.splice(index, 1)
  }

  // 表示制御ロジック
  const useCommentDisplayControl = () => {
    let lastTime = 0
    const processedMessageIds = new Set<number>()
    const commentTimers = new Map<number, number>()

    const processNewComments = (now: number) => {
      if (now - lastTime <= DISPLAY_CONFIG.INTERVAL) return

      const newComments = comments.value.filter((comment) => !processedMessageIds.has(comment.id))
      if (newComments.length === 0) return

      lastTime = now

      newComments.forEach((nextComment) => {
        let totalLifeTime: number

        // displaySecondsが設定されている場合はそれを使用、そうでなければDISPLAY_CONFIGを使用
        if (nextComment.displaySeconds !== undefined) {
          // displaySecondsは0-60秒の範囲でミリ秒に変換
          totalLifeTime = nextComment.displaySeconds * 1000
        } else {
          // 従来の計算方法
          const commentLength = nextComment.comment?.length ?? 0
          const extraTime = Math.max(commentLength - DISPLAY_CONFIG.THRESHOLD, 0) * DISPLAY_CONFIG.EXTRA_TIME_PER_CHAR
          totalLifeTime = DISPLAY_CONFIG.BASE_LIFE_TIME + extraTime
        }

        displayedComments.value.unshift(nextComment)
        commentTimers.set(nextComment.id, Date.now() + totalLifeTime)
        processedMessageIds.add(nextComment.id)
      })
    }

    const removeExpiredComments = (now: number) => {
      displayedComments.value = displayedComments.value.filter((comment) => {
        const expireTime = commentTimers.get(comment.id)
        if (expireTime && now > expireTime) {
          commentTimers.delete(comment.id)
          return false
        }
        return true
      })
    }

    const update = () => {
      const now = Date.now()
      processNewComments(now)
      removeExpiredComments(now)
      animationFrameId.value = requestAnimationFrame(update)
    }

    const start = () => {
      processedMessageIds.clear()
      commentTimers.clear()
      displayedComments.value = []
      update()
    }

    const stop = () => {
      if (animationFrameId.value) {
        cancelAnimationFrame(animationFrameId.value)
      }
      commentTimers.clear()
      processedMessageIds.clear()
    }

    return { start, stop }
  }

  const displayControl = useCommentDisplayControl()

  return {
    displayedComments,
    handleImageError,
    removeItem,
    start: displayControl.start,
    stop: displayControl.stop,
  }
}
