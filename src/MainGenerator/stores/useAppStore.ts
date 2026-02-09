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

  /**
   * データを更新
   *
   * data.valueを更新すると、Vueのリアクティブシステムが自動的に
   * それを参照しているwatchEffectやcomputedを再実行します。
   * そのため、dataVersionのような手動カウンターは不要です。
   */
  const loadData = (newData: OmikujiDataType) => {
    console.log('📥 loadData: データを更新します')
    data.value = normalizeData(newData)
    console.log('✅ loadData: 完了')
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
    loadData,
    ...botMessageActions,
    cooldownManager,
    userVisitManager,
    scriptManager,
    metaState,
  }
})
