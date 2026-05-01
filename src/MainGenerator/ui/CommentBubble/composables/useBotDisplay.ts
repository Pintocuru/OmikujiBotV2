// src/MainGenerator/ui/CommentBubble/composables/useBotDisplay.ts
import { ref, computed, Ref } from 'vue'
import { BotMessageBubbleType } from '@/types'

const DISPLAY_CONFIG = {
  INTERVAL: 250,
  BASE_LIFE_TIME: 10000,
  THRESHOLD: 30,
  EXTRA_TIME_PER_CHAR: 100,
  LEAVE_ANIMATION_DELAY: 200,
  MAX_MESSAGE_LENGTH: 100,
} as const

export const useBotDisplay = (botMessages: Ref<BotMessageBubbleType[]>) => {
  const displayedComments = ref<BotMessageBubbleType[]>([])
  const animationFrameId = ref<number>()

  const comments = computed(() => botMessages.value.filter((m) => !!m.bubble?.message))

  // MotionWrapper の after-leave から呼ばれる（CommentBubble 用途）
  // FlashBanner では MotionWrapper がないため呼ばれないが、
  // hideTimeout コールバック内で visible=false にした後、
  // このメソッドを直接呼ぶことで即座にエントリを除去できる
  const removeComment = (messageId: string) => {
    const index = displayedComments.value.findIndex((item) => item.id === messageId)
    if (index === -1) return
    const comment = displayedComments.value[index]
    if (comment.display?.hideTimeout) {
      clearTimeout(comment.display.hideTimeout)
    }
    displayedComments.value.splice(index, 1)
  }

  // visible を false にして Leave アニメーションを開始する（CommentBubble 用途）
  const hideComment = (messageId: string) => {
    const comment = displayedComments.value.find((item) => item.id === messageId)
    if (comment?.display) {
      comment.display.visible = false
    }
  }

  const useEnhancedDisplayControl = () => {
    let lastTime = 0
    const processedMessages = new Map<string, string>()

    const processNewComments = (now: number) => {
      if (now - lastTime <= DISPLAY_CONFIG.INTERVAL) return

      const newComments = comments.value.filter((comment) => {
        const key = buildMessageKey(comment)
        return processedMessages.get(comment.id) !== key
      })
      if (newComments.length === 0) return

      lastTime = now

      newComments.forEach((nextComment) => {
        // --- 表示時間の解決 ---
        let totalLifeTime: number | null
        const sec = nextComment.bubble?.displaySeconds
        if (sec === null) {
          totalLifeTime = null // null → 無限表示
        } else if (sec !== undefined) {
          totalLifeTime = sec * 1000 // 数値指定
        } else {
          // undefined → 文字数から自動計算
          const rawLength = nextComment.bubble?.message?.length ?? 0
          const commentLength = Math.min(rawLength, DISPLAY_CONFIG.MAX_MESSAGE_LENGTH)
          const extraTime = Math.max(commentLength - DISPLAY_CONFIG.THRESHOLD, 0) * DISPLAY_CONFIG.EXTRA_TIME_PER_CHAR
          totalLifeTime = DISPLAY_CONFIG.BASE_LIFE_TIME + extraTime
        }

        const displayMessage: BotMessageBubbleType = {
          ...nextComment,
          display: {
            visible: true,
            hideTimeout: undefined,
          },
        }

        if (totalLifeTime !== null) {
          const targetId = displayMessage.id
          displayMessage.display!.hideTimeout = setTimeout(() => {
            // visible を false にする（MotionWrapper がある場合は after-leave を待つ）
            const target = displayedComments.value.find((m) => m.id === targetId)
            if (target?.display) {
              target.display.visible = false
            }

            // FlashBanner のように MotionWrapper がない場合はここで即 remove する
            // MotionWrapper がある場合は after-leave イベントから removeComment が呼ばれるため
            // 二重削除にならないよう、removeComment 内で index チェックを行っている
            //
            // ※ FlashBanner 側でこの composable を使う場合は、
            //   onMessageChanged などのタイミングで removeComment を呼ぶか、
            //   visible=false になった時点で currentMessage の computed が
            //   自動的に defaultMessage へフォールバックするため、
            //   エントリが残り続けても UI への影響はない。
            //   ただし配列が肥大化しないよう LEAVE_ANIMATION_DELAY 後に remove する。
            setTimeout(() => {
              removeComment(targetId)
            }, DISPLAY_CONFIG.LEAVE_ANIMATION_DELAY)
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
      displayedComments.value.forEach((comment) => {
        if (comment.display?.hideTimeout) clearTimeout(comment.display.hideTimeout)
      })
      displayedComments.value = []
      update()
    }

    const stop = () => {
      if (animationFrameId.value) cancelAnimationFrame(animationFrameId.value)
      displayedComments.value.forEach((comment) => {
        if (comment.display?.hideTimeout) clearTimeout(comment.display.hideTimeout)
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

const buildMessageKey = (msg: BotMessageBubbleType): string =>
  [msg.bubble?.message ?? '', msg.bubble?.displaySeconds ?? 'auto'].join('|')
