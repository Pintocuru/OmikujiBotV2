// src/ConfigMaker/stores/useOmikujiStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/'
import { useDataIO } from './composables/useDataIO'
import { useDataMerge } from './composables/useDataMerge'
import { useRecordCRUD } from './composables/useRecordCRUD'
import { useRecordProperties } from './composables/useRecordProperties'
import { useRecordSort } from './composables/useRecordSort'
import { useSettingsOperations } from './composables/useSettingsOperations'

/**
 * おみくじデータの中心的なstore
 */
export const useOmikujiStore = defineStore('omikuji', () => {
  // コアデータ
  const data = ref<OmikujiDataType>(OmikujiDataSchema.parse({}))

  // 変更追跡
  const hasChanged = ref(false)
  const resetChangeState = () => (hasChanged.value = false)

  // データIO・マージ
  const dataIO = useDataIO(data)
  const dataMerge = useDataMerge(data, hasChanged)

  // レコード操作（基本版・ナビゲーション連携なし）
  const recordCRUD = useRecordCRUD(data, hasChanged)
  const recordProperties = useRecordProperties(data, recordCRUD)
  const recordSort = useRecordSort(data, hasChanged)

  // 設定操作
  const settingsOps = useSettingsOperations(data, hasChanged)

  return {
    // コアデータ
    data,
    hasChanged,
    resetChangeState,

    // データIO・マージ
    loadData: dataIO.loadData,
    safeValidateData: dataIO.safeValidateData,
    exportData: dataIO.exportData,
    mergeDataSets: dataMerge.mergeDataSets,

    // レコード操作（基本版）
    // カテゴリとkeyを明示的に指定する必要がある
    // 💡 UI連携版は useRecordStore を使用

    // CRUD操作（低レベルAPI）
    addItem: recordCRUD.addItem,
    updateItem: recordCRUD.updateItem,
    removeItem: recordCRUD.removeItem,
    duplicateItem: recordCRUD.duplicateItem,
    updateItemKey: recordCRUD.updateItemKey,

    // 直接CRUD（選択更新なし）
    addItemDirect: recordCRUD.addItem,
    updateItemDirect: recordCRUD.updateItem,
    removeItemDirect: recordCRUD.removeItem,
    duplicateItemDirect: recordCRUD.duplicateItem,

    // プロパティ更新
    updateRecordProperty: recordProperties.updateRecordProperty,
    updateOmikujiByIndex: recordProperties.updateOmikujiByIndex,
    updateOmikujiPostActions: recordProperties.updateOmikujiPostActions,
    updatePlaceholderValues: recordProperties.updatePlaceholderValues,

    // 並び替え
    batchUpdateOrder: recordSort.batchUpdateOrder,
    reorderItem: recordSort.reorderItem,

    // 設定操作

    updateJsonMerge: settingsOps.updateJsonMerge,
    updateComponentsConditions: settingsOps.updateComponentsConditions,
    updateNestedComponents: settingsOps.updateNestedComponents,
    updateFeatureUsage: settingsOps.updateFeatureUsage,
    updateNestedFeatureUsage: settingsOps.updateNestedFeatureUsage,
    updateSettings: settingsOps.updateSettings,
  }
})
