// templates\OmikujiBot\src\MainGenerator\stores\useBotMessageActions.ts
import { ref } from 'vue'
import type { BotMessage } from '@/types/'

/**
 * appストア用の状態とアクション
 */
export const useBotMessageActions = () => {
  // --- 状態 ---
  const isInitialized = ref(true)
  const botMessages = ref<BotMessage[]>([])

  const scheduleBotMessages = (processedMessages: BotMessage[]) => {
    if (!processedMessages.length) return
    Promise.all(
      processedMessages.map((message) => {
        const delay = message.delaySeconds * 1000
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            if (!botMessages.value.some((c) => c.id === message.id)) {
              botMessages.value = [...botMessages.value, message]
            }
            resolve()
          }, delay)
        })
      })
    )
  }
  const addBotMessage = (message: BotMessage) => (botMessages.value = [...botMessages.value, message])
  const clearMessages = () => (botMessages.value = [])
  const setInitialized = (value: boolean) => (isInitialized.value = value)

  return {
    // 状態
    isInitialized,
    botMessages,

    // アクション
    scheduleBotMessages,
    addBotMessage,
    clearMessages,
    setInitialized,
  }
}
