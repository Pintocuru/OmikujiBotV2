// src/MainGenerator/scripts/BotMessage/addToastMessage.ts
import { BotMessageBubbleSchema } from '@/types'
import { useAppStore } from '@main/stores/useAppStore'
import { useVisibilityAccess } from '../FeatureAccess/useAccessCheckerMain'

export const useAddToastMessage = () => {
  const appStore = useAppStore()
  const { isSecondarySlot } = useVisibilityAccess()

  const addToastMessage = (name: string | null, message: string) => {
    const msg = BotMessageBubbleSchema.parse({
      bubble: { name, message, isToast: isSecondarySlot.value },
    })
    appStore.addBotMessage(msg)
  }

  return {
    addToastMessage,
  }
}
