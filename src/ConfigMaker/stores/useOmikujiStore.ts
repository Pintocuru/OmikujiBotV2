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
  let isInitializing = true
  watch(
    () => data.value,
    () => {
      if (!isInitializing) hasChanged.value = true
    },
    { deep: true }
  )
  nextTick(() => (isInitializing = false))

  // === 各機能モジュール ===
  const dataOps = useDataOperations(data)
  const recordOps = useRecordOperations(data)
  const settingsOps = useSettingsOperations(data)
  const navigation = useNavigationManager(recordOps)
  const itemManager = useItemManager(recordOps, navigation)

  return {
    // コアデータ
    data,
    hasChanged,

    // 各機能モジュールを展開
    ...dataOps,
    ...recordOps,
    ...settingsOps,
    ...navigation,
    ...itemManager,
  }
})
