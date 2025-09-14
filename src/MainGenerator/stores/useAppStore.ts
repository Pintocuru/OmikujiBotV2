// src\MainGenerator\stores\useAppStore.ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { OmikujiDataSchema, BotMessage, OmikujiDataType } from '@/types/'
import { ConfigUserSchema, ConfigUserType } from '@shared/types'
import { GameScriptManager } from '@/MainGenerator/scripts/GameScript/GameScriptManager'
import { CharacterCollector } from '@MainScripts/BotCharacter/CharacterCollector'
import { CooldownManager } from '@/MainGenerator/scripts/CooldownManager/CooldownManager'
import { normalizeData } from '@/migrations'

// グローバルデータの初期化
const rawData = window.omikujiData || {}
const migratedData = normalizeData(rawData) // マイグレーション
const omikujiData = OmikujiDataSchema.parse(migratedData)

// わんコメの購読用設定の初期化
const userConfig: ConfigUserType = ConfigUserSchema.parse(window.userConfig)

export const useAppStore = defineStore('app', () => {
  // 基本設定
  // コアデータ
  const data = ref<OmikujiDataType>(omikujiData)

  // 初期化状態
  const isInitialized = ref(true)

  // メッセージ関連
  const botMessages = ref<BotMessage[]>([])

  // 必要な管理オブジェクト
  const scriptManager = computed(() => new GameScriptManager(data.value))
  const cooldownManager = CooldownManager.getInstance()
  const characterCollector = new CharacterCollector(data.value)

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
    data,
    userConfig,
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
