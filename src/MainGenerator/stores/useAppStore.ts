// src\MainGenerator\stores\useAppStore.ts
import { computed, readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { OmikujiDataType } from '@/types/'
import { useBotMessageActions } from './useBotMessageActions'
import { CooldownManager } from '@main/stores/CooldownManager/CooldownManager'
import { UserVisitManager } from '@main/stores/UserVisitManager/UserVisitManager'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { normalizeData } from '@/common/migrations'
import { MetaStateService } from '../scripts/MetaState/MetaStateService'

// グローバルデータの初期化
const { omikujiData: rawOmikujiData } = window
const omikujiData = normalizeData(rawOmikujiData)

export const useAppStore = defineStore('app', () => {
  // ref
  const data = ref<OmikujiDataType>(omikujiData)

  const loadData = (newData: OmikujiDataType) => {
    data.value = normalizeData(newData)
  }

  // botMessage
  const botMessageActions = useBotMessageActions()

  // 管理オブジェクト
  const cooldownManager = CooldownManager.getInstance() // 時間管理(連続投稿と重複を監視)
  const userVisitManager = new UserVisitManager() // ユーザー訪問管理
  const scriptManager = GameScriptManager.getInstance() // ゲームスクリプト管理
  const metaState = MetaStateService.getInstance() // メタデータ取得

  return {
    // 状態
    data,
    loadData,
    ...botMessageActions,
    cooldownManager,
    userVisitManager,
    scriptManager,
    metaState,
  }
})
