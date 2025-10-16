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

  return {
    categoryVisibility,
    characterVisible,
    wordPartyLoading,
    licenseVisible,
    gameScriptSettings,
    gameScripts,
    wordPartySettings,
    jsonMergeSettings,
  }
}
