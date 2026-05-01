// src/MainGenerator/stores/useAppStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { OmikujiDataType } from '@/types'
import { useAppStatus } from './useAppStatus'
import { useBotMessageActions } from './useBotMessageActions'
import { createAppServices } from './createAppServices'
import { normalizeData } from '@/common/migrations'
import { useOmikensActions } from './useOmikensActions'

// グローバルデータの初期化
const { omikujiData: rawOmikujiData } = window
const omikujiData = normalizeData(rawOmikujiData)

export const useAppStore = defineStore('app', () => {
  // ref
  const data = ref<OmikujiDataType>(omikujiData)

  // データを更新
  const loadData = (newData: OmikujiDataType) => {
    console.log('📥 loadData: データを更新します')
    data.value = normalizeData(newData)
    console.log('✅ loadData: 完了')
  }
  // アプリ状態
  const appStatus = useAppStatus()

  // omiken
  const omikensActions = useOmikensActions()

  // botMessage
  const botMessageActions = useBotMessageActions()

  // 各種Service
  const services = createAppServices()

  return {
    data,
    loadData,

    ...appStatus,
    ...omikensActions,
    ...botMessageActions,
    ...services,
  }
})
