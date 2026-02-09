// src/MainGenerator/stores/useAppStore.ts
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

  // ⭐ データ更新カウンター（リアクティブな更新検知用）
  const dataVersion = ref(0)

  const loadData = (newData: OmikujiDataType) => {
    console.log('📥 loadData: データを更新します')
    data.value = normalizeData(newData)

    // ⭐ バージョンをインクリメント（これでwatchが反応する）
    dataVersion.value++

    console.log('✅ loadData: 完了 (version:', dataVersion.value, ')')
  }

  // botMessage
  const botMessageActions = useBotMessageActions()

  // 管理オブジェクト
  const cooldownManager = CooldownManager.getInstance()
  const userVisitManager = new UserVisitManager()
  const scriptManager = GameScriptManager.getInstance()
  const metaState = MetaStateService.getInstance()

  return {
    // 状態
    data,
    dataVersion, // ⭐ 追加
    loadData,
    ...botMessageActions,
    cooldownManager,
    userVisitManager,
    scriptManager,
    metaState,
  }
})
