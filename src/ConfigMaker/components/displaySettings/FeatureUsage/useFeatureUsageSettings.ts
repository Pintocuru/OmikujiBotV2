// src/ConfigMaker/components/displaySettings/visibility/useVisibilitySettings.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { FeatureUsageDeveloperType, FeatureUsageUsageType, RecordCategoryType } from '@/types'

export function useFeatureUsageSettings() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // developer
  const createFeatureDeveloperRef = <K extends keyof FeatureUsageDeveloperType>(key: K) =>
    computed<FeatureUsageDeveloperType[K]>({
      get: () => data.value.featureUsage.developer[key],
      set: (newValue) => {
        omikujiStore.updateNestedFeatureUsage('developer', {
          ...data.value.featureUsage.developer,
          [key]: newValue,
        })
      },
    })
  const licenseVisible = createFeatureDeveloperRef('licenseVisible')
  const jsonMergeSettings = createFeatureDeveloperRef('jsonMergeSettings')

  // usage
  const createFeatureUsageRef = <K extends keyof FeatureUsageUsageType>(key: K) =>
    computed<FeatureUsageUsageType[K]>({
      get: () => data.value.featureUsage.usage[key],
      set: (newValue) => {
        omikujiStore.updateNestedFeatureUsage('usage', {
          ...data.value.featureUsage.usage,
          [key]: newValue,
        })
      },
    })

  const comments = createFeatureUsageRef('comments')
  const timers = createFeatureUsageRef('timers')
  const actionSets = createFeatureUsageRef('actionSets')
  const placeholders = createFeatureUsageRef('placeholders')
  const characters = createFeatureUsageRef('characters')

  const categoryToUsageKey: Record<RecordCategoryType, keyof FeatureUsageUsageType> = {
    comments: 'comments',
    timers: 'timers',
    actionSets: 'actionSets',
    placeholders: 'placeholders',
    characters: 'characters',
  }
  const categoryVisibility = (category: RecordCategoryType) => createFeatureUsageRef(categoryToUsageKey[category])

  // string[] 直下プロパティ用（gameScripts / components）
  const createStringArrayRef = <K extends 'gameScripts' | 'components'>(key: K) =>
    computed<string[]>({
      get: () => data.value.featureUsage[key],
      set: (newValue) => {
        omikujiStore.updateFeatureUsage({
          [key]: newValue,
        })
      },
    })
  const components = createStringArrayRef('components')
  const gameScripts = createStringArrayRef('gameScripts')

  /**
   * 「full」プリセット
   */
  const setFullVisibility = () => {
    const fullSettings = {
      comments: 'basic' as const,
      timers: 'basic' as const,
      actionSets: 'basic' as const,
      placeholders: 'basic' as const,
      characters: 'basic' as const,

      characterVisible: 'basic' as const,
      wordPartyLoading: 'internal' as const,
      licenseVisible: 'basic' as const,

      gameScriptSettings: 'pro' as const,
      gameScripts: [] as string[],

      jsonMergeSettings: 'basic' as const,
      wordPartySettings: 'internal' as const,
    }

    omikujiStore.updateFeatureUsage(fullSettings)
  }

  /**
   * 「solo」プリセット
   */
  const setSoloVisibility = () => {
    const soloSettings = {
      comments: 'basic' as const,
      timers: 'experimental' as const,
      actionSets: 'basic' as const,
      placeholders: 'basic' as const,
      characters: 'basic' as const,

      characterVisible: 'experimental' as const,
      wordPartyLoading: 'experimental' as const,
      licenseVisible: 'experimental' as const,

      gameScriptSettings: 'experimental' as const,
      gameScripts: [] as string[],

      jsonMergeSettings: 'experimental' as const,
      wordPartySettings: 'experimental' as const,
    }

    omikujiStore.updateFeatureUsage(soloSettings)
  }

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
    // プリセット
    setFullVisibility,
    setSoloVisibility,
  }
}
