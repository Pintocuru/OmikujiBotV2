// src/ConfigMaker/script/stores/useOmikujiStore.ts (メインストア - 大幅簡素化)
import { nextTick, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { isDev } from '@/types/env'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { useDataOperations } from './composables/useDataOperations'
import { useNavigationManager } from './composables/useNavigationManager'
import { useItemManager } from './composables/useItemManager'
import { useRecordOperations } from './composables/useRecordOperations'
import { useSettingsOperations } from './composables/useSettingsOperations'

// グローバルデータの初期化
const omikujiData = OmikujiDataSchema.parse(window.omikujiData)

export const useOmikujiStore = defineStore('omikuji', () => {
  // === コアデータ ===
  const data = ref<OmikujiDataType>(!isDev ? omikujiData : OmikujiDataSchema.parse({}))

  // 変更追跡
  const hasChanged = ref(false)
  const resetChangeState = () => (hasChanged.value = false)

  // === 各機能モジュール ===
  const dataOps = useDataOperations(data, hasChanged)
  const recordOps = useRecordOperations(data, hasChanged)
  const settingsOps = useSettingsOperations(data, hasChanged)
  const navigation = useNavigationManager(recordOps)
  const itemManager = useItemManager(recordOps, navigation)

  return {
    // コアデータ
    data,
    hasChanged,
    resetChangeState,

    // 各機能モジュールを展開
    ...dataOps,
    ...recordOps,
    ...settingsOps,
    ...navigation,
    ...itemManager,
  }
})
