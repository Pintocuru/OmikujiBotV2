// templates\OmikujiBot\src\MainGenerator\stores\useBotMessageActions.ts
// これstoreじゃないです…
import { ref } from 'vue'
import type { BotMessage } from '@/types/'

/**
 * appストア用の状態とアクション
 */
export const useBotMessageActions = () => {
  // --- 状態 ---
  const isInitialized = ref(true)
  const botMessages = ref<BotMessage[]>([])

  // delaySeconds に合わせてメッセージを botMessages に入れる関数
  const scheduleBotMessages = (processedMessages: BotMessage[]) => {
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
