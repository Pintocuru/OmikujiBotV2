// composables/useTimerProcessor.ts
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { TimerProcessor } from '@MainScripts/omikujiProcess/timerProcessor'

export function useTimerProcessor() {
  let timerProcessor: TimerProcessor | null = null

  const initializeProcessor = (omikujiData: OmikujiDataType) => {
    timerProcessor = new TimerProcessor(omikujiData)
  }

  const startTimers = (callback: (messages: BotMessage[]) => void) => {
    if (timerProcessor) timerProcessor.startTimers(callback)
  }

  const stopTimers = () => {
    if (timerProcessor) timerProcessor.stopTimers()
  }

  return {
    initializeProcessor,
    startTimers,
    stopTimers,
  }
}
