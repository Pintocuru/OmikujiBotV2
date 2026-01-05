// src/ConfigMaker/stores/useOmikujiStore.ts
import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { isDev } from '@/types/env'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { useDataIO } from './composables/useDataIO'
import { useDataMerge } from './composables/useDataMerge'
import { useNavigationManager } from './composables/useNavigationManager'
import { useItemManager } from './composables/useItemManager'
import { useRecordCRUD } from './composables/useRecordCRUD'
import { useRecordDataAccess } from './composables/useRecordDataAccess'
import { useRecordProperties } from './composables/useRecordProperties'
import { useRecordSort } from './composables/useRecordSort'

import { useSettingsOperations } from './composables/useSettingsOperations'
import { normalizeData } from '@/common/migrations'

// グローバルデータの初期化
const rawData = window.omikujiData || {}
const omikujiData = normalizeData(rawData) // マイグレーション（バージョン更新を含む）

export const useOmikujiStore = defineStore('omikuji', () => {
  // コアデータ
  const data = ref<OmikujiDataType>(!isDev ? omikujiData : OmikujiDataSchema.parse({}))

  // 変更追跡
  const hasChanged = ref(false)
  const resetChangeState = () => (hasChanged.value = false)

  // 各機能モジュール
  const dataIO = useDataIO(data)
  const dataMerge = useDataMerge(data, hasChanged)

  const recordDataAccess = useRecordDataAccess(data)
  const recordCRUD = useRecordCRUD(data, hasChanged)
  const recordProperties = useRecordProperties(data, recordCRUD, recordDataAccess)
  const recordSort = useRecordSort(data, hasChanged, recordDataAccess)

  const settingsOps = useSettingsOperations(data, hasChanged)
  const navigation = useNavigationManager(recordDataAccess)
  const itemManager = useItemManager(recordDataAccess, recordCRUD, recordProperties, recordSort, navigation)

  return {
    // コアデータ
    // data: readonly(data), // readonlyにして直接編集を防ぐが、厳格すぎるのでチェック時のみ
    data,
    hasChanged,
    resetChangeState,

    // 各機能モジュールを展開

    ...dataIO, // データ入出力
    ...dataMerge, // データマージ

    ...recordDataAccess, // データアクセス
    ...recordCRUD, // CRUD操作
    ...recordProperties, // プロパティ更新
    ...recordSort, // 並び替え

    ...settingsOps,
    ...navigation,
    ...itemManager,
  }
})
