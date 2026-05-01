// src/ConfigMaker/components/appInfo/FlagsSettings/useFlagsSettings.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { FlagsDeveloperType, FlagsUsageType, RecordCategoryType } from '@/types'

export function useFlagsSettings() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // usage
  const createUsageRef = <K extends keyof FlagsUsageType>(key: K) =>
    computed<FlagsUsageType[K]>({
      get: () => data.value.featureUsage.usage[key],
      set: (newValue) => {
        omikujiStore.updateFlagsNested('usage', {
          ...data.value.featureUsage.usage,
          [key]: newValue,
        })
      },
    })
  const comments = createUsageRef('comments')
  const timers = createUsageRef('timers')
  const actionSets = createUsageRef('actionSets')
  const placeholders = createUsageRef('placeholders')
  const characters = createUsageRef('characters')

  const categoryVisibility = (category: RecordCategoryType) => createUsageRef(category as keyof FlagsUsageType)

  // string[] 直下プロパティ用（gameScripts / components）
  const createArrayRef = <K extends 'gameScripts' | 'components'>(key: K) =>
    computed<string[]>({
      get: () => data.value.featureUsage[key],
      set: (newValue) => {
        omikujiStore.updateFlags({
          [key]: newValue,
        })
      },
    })
  const components = createArrayRef('components')
  const gameScripts = createArrayRef('gameScripts')

  // developer
  const createDeveloperRef = <K extends keyof FlagsDeveloperType>(key: K) =>
    computed<FlagsDeveloperType[K]>({
      get: () => data.value.featureUsage.developer[key],
      set: (newValue) => {
        omikujiStore.updateFlagsNested('developer', {
          ...data.value.featureUsage.developer,
          [key]: newValue,
        })
      },
    })
  const licenseVisible = createDeveloperRef('licenseVisible')
  const jsonMergeSettings = createDeveloperRef('jsonMergeSettings')
  const itemSlotEnabled = createDeveloperRef('itemSlotEnabled')

  return {
    // 基本
    comments,
    timers,
    actionSets,
    placeholders,
    characters,
    categoryVisibility,
    //
    components,
    gameScripts,
    //
    licenseVisible,
    jsonMergeSettings,
    itemSlotEnabled,
  }
}
