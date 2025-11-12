// src/ConfigMaker/components/displaySettings/visibility/useVisibilitySettings.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import type { VisibilityKey } from '@/types'
import type { AccessLevelType } from '@shared/types'

export function useVisibilitySettings() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  /** 単一キーの可視性設定をcomputedでラップ */
  const createVisibilityRef = <T = AccessLevelType | string[]>(key: VisibilityKey) =>
    computed<T>({
      get: () => data.value.displaySettings.developer.visibility[key] as T,
      set: (newValue) => {
        console.log(`${key}変更:`, newValue)
        omikujiStore.updateNestedDisplaySettings('developer', {
          visibility: {
            ...data.value.displaySettings.developer.visibility,
            [key]: newValue,
          },
        })
      },
    })

  /** 動的生成 */
  const characterVisible = createVisibilityRef<AccessLevelType>('characterVisible')
  const wordPartyLoading = createVisibilityRef<AccessLevelType>('wordPartyLoading')
  const licenseVisible = createVisibilityRef<AccessLevelType>('licenseVisible')
  const gameScriptSettings = createVisibilityRef<AccessLevelType>('gameScriptSettings')
  const wordPartySettings = createVisibilityRef<AccessLevelType>('wordPartySettings')
  const jsonMergeSettings = createVisibilityRef<AccessLevelType>('jsonMergeSettings')
  const gameScripts = createVisibilityRef<string[]>('gameScripts')

  /** 任意カテゴリを取得できる関数も残す */
  const categoryVisibility = (key: VisibilityKey) => createVisibilityRef(key)

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
      gameScripts: ['GouseiSuika', 'BomberSpin', 'DwarfBomb'] as string[],

      jsonMergeSettings: 'basic' as const,
      wordPartySettings: 'internal' as const,
    }

    omikujiStore.updateNestedDisplaySettings('developer', {
      visibility: fullSettings,
    })
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

    omikujiStore.updateNestedDisplaySettings('developer', {
      visibility: soloSettings,
    })
  }

  return {
    categoryVisibility,
    characterVisible,
    wordPartyLoading,
    licenseVisible,
    gameScriptSettings,
    gameScripts,
    wordPartySettings,
    jsonMergeSettings,
    setFullVisibility,
    setSoloVisibility,
  }
}
