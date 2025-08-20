import { defineStore } from 'pinia'
import { ref } from 'vue'
import { OmikujiDataSchema, BotMessage } from '@/types/'
import { ConfigUserSchema } from '@shared/types'
import { GameScriptManager } from '@MainScripts/omikujiProcess/GameScriptManager'
import { CharacterCollector } from '@MainScripts/BotCharacter/CharacterCollector'
import { CooldownManager } from '@MainScripts/omikujiProcess/CooldownManager'

export const useAppStore = defineStore('app', () => {
  // 基本設定
  const omikujiData = OmikujiDataSchema.parse(window.omikujiData)
  const config = ConfigUserSchema.parse(window.userConfig)

  // 初期化状態
  const isInitialized = ref(false)

  // メッセージ関連
  const botMessages = ref<BotMessage[]>([])

  // 必要な管理オブジェクト
  const scriptManager = new GameScriptManager(omikujiData)
  const cooldownManager = CooldownManager.getInstance()
  const characterCollector = new CharacterCollector(omikujiData)

  // 状態操作のアクション
  const addBotMessage = (message: BotMessage) => {
    botMessages.value = [...botMessages.value, message]
  }

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

  const clearMessages = () => {
    botMessages.value = []
  }

  const setInitialized = (value: boolean) => {
    isInitialized.value = value
  }

  return {
    // 状態
    omikujiData,
    config,
    isInitialized,
    botMessages,
    scriptManager,
    cooldownManager,
    characterCollector,

    // 状態操作アクション
    addBotMessage,
    scheduleBotMessages,
    clearMessages,
    setInitialized,
  }
})
