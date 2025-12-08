// src\MainGenerator\stores\useAppStore.ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/'
import { ConfigUserSchema, ConfigUserType } from '@shared/types'
import { GameScriptManager } from '@/MainGenerator/scripts/GameScript/GameScriptManager'
import { CharacterCollector } from '@MainScripts/BotCharacter/CharacterCollector'
import { CooldownManager } from '@/MainGenerator/scripts/CooldownManager/CooldownManager'
import { normalizeData } from '@/Toolkit/migrations'
import { useBotMessageActions } from './useBotMessageActions'

// グローバルデータの初期化
const { omikujiData: rawOmikujiData, userConfig: rawUserConfig } = window
const migratedData = normalizeData(rawOmikujiData)
const omikujiData = OmikujiDataSchema.parse(migratedData)

// わんコメの購読用設定の初期化
const userConfig: ConfigUserType = ConfigUserSchema.parse(rawUserConfig)

export const useAppStore = defineStore('app', () => {
  // ref
  const data = ref<OmikujiDataType>(omikujiData)

  // 管理オブジェクト
  const cooldownManager = CooldownManager.getInstance() // 時間管理(連続投稿などを監視)
  const scriptManager = computed(() => new GameScriptManager(data.value)) // ゲームスクリプト管理
  const characterCollector = computed(() => new CharacterCollector(data.value)) // キャラクター管理

  // 状態とアクションを外部から利用
  const botMessageActions = useBotMessageActions()

  return {
    // 状態
    data,
    ...botMessageActions,
    userConfig,
    scriptManager,
    cooldownManager,
    characterCollector,
  }
})
