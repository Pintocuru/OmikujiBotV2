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
import { DataSource } from '@/types'

/**
 * おみくじデータの中心的なstore
 */
export const useOmikujiStore = defineStore('omikuji', () => {
  // コアデータ
  const data = ref<OmikujiDataType>(OmikujiDataSchema.parse({}))

  // 変更追跡
  const hasChanged = ref(false)
  const resetChangeState = () => (hasChanged.value = false)

  // 読み込んだデータの種類
  const dataSource = ref<DataSource>('unknown')

  // データIO・マージ
  const dataIO = useDataIO(data, dataSource)
  const dataMerge = useDataMerge(data, hasChanged)

  // レコード操作
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
    dataSource,

    // データIO・マージ
    ...dataIO,
    ...dataMerge,

    // レコード操作
    ...recordCRUD, // CRUD操作
    ...recordProperties, // プロパティ更新
    ...recordSort, // 並び替え
    ...settingsOps, // 設定操作
  }
})
