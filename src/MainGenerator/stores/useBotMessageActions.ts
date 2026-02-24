// src/MainGenerator/stores/useBotMessageActions.ts
import { ref } from 'vue'
import type { BotMessageType } from '@/types/'
import { AppStatus } from '@shared/types/core/AppStatus'

export const useBotMessageActions = () => {
  /**
   * 状態
   */
  const status = ref<AppStatus>('initializing')
  const botMessages = ref<BotMessageType[]>([])

  /**
   * delaySeconds に合わせてメッセージを botMessages に入れる関数
   */
  const scheduleBotMessages = (processedMessages: BotMessageType[]) => {
    if (!processedMessages.length) return

    const delayPromises = processedMessages.map((m) => {
      const delay = m.delaySeconds * 1000
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          if (!botMessages.value.some((c) => c.id === m.id)) {
            botMessages.value = [...botMessages.value, m]
          }
          resolve()
        }, delay)
      })
    })
    Promise.all(delayPromises)
  }

  /**
   * BotMessage に関する関数
   */
  const addBotMessage = (message: BotMessageType) => (botMessages.value = [...botMessages.value, message])
  const clearMessages = () => (botMessages.value = [])
  const setStatus = (value: AppStatus) => (status.value = value)

  return {
    // 状態
    status,
    botMessages,

    // アクション
    scheduleBotMessages,
    addBotMessage,
    clearMessages,
    setStatus,
  }
}
