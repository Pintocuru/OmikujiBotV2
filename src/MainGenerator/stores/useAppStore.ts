// src\MainGenerator\stores\useAppStore.ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/'
import { ConfigUserSchema, ConfigUserType } from '@shared/types'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { CooldownManager } from '@main/stores/CooldownManager/CooldownManager'
import { UserVisitManager } from '@main/stores/UserVisitManager/UserVisitManager'

import { normalizeData } from '@/common/migrations'
import { useBotMessageActions } from './useBotMessageActions'

// グローバルデータの初期化
const { omikujiData: rawOmikujiData } = window
const migratedData = normalizeData(rawOmikujiData)
const omikujiData = OmikujiDataSchema.parse(migratedData)

export const useAppStore = defineStore('app', () => {
  // ref
  const data = ref<OmikujiDataType>(omikujiData)

  // botMessage
  const botMessageActions = useBotMessageActions()

  // 管理オブジェクト
  const cooldownManager = CooldownManager.getInstance() // 時間管理(連続投稿と重複を監視)
  const userVisitManager = UserVisitManager.getInstance() // ユーザー訪問管理
  const scriptManager = computed(() => new GameScriptManager()) // ゲームスクリプト管理

  return {
    // 状態
    data,
    ...botMessageActions,
    cooldownManager,
    userVisitManager,
    scriptManager,
  }
})
