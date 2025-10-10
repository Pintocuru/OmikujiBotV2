// src\ConfigMaker\components\displaySettings\visibility\useVisibilitySettings.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { VisibilityKey } from '@/types'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import type { AccessLevelType } from '@shared/types'

export function useVisibilitySettings() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 基本コンポーネントのカテゴリごとの可視性設定
  const categoryVisibility = (category: VisibilityKey) =>
    computed({
      get: () => data.value.displaySettings.developer.visibility[category],
      set: (newValue: AccessLevelType) => {
        console.log('カテゴリ可視性変更:', category, newValue)
        omikujiStore.updateNestedDisplaySettings('developer', {
          visibility: {
            ...data.value.displaySettings.developer.visibility,
            [category]: newValue,
          },
        })
      },
    })

  // characterVisible
  const characterVisible = computed({
    get: () => data.value.displaySettings.developer.visibility.characterVisible,
    set: (newValue: AccessLevelType) => {
      console.log('characterVisible変更:', newValue)
      omikujiStore.updateNestedDisplaySettings('developer', {
        visibility: {
          ...data.value.displaySettings.developer.visibility,
          characterVisible: newValue,
        },
      })
    },
  })

  // wordPartyLoading
  const wordPartyLoading = computed({
    get: () => data.value.displaySettings.developer.visibility.wordPartyLoading,
    set: (newValue: AccessLevelType) => {
      console.log('wordPartyLoading変更:', newValue)
      omikujiStore.updateNestedDisplaySettings('developer', {
        visibility: {
          ...data.value.displaySettings.developer.visibility,
          wordPartyLoading: newValue,
        },
      })
    },
  })

  // licenseVisible
  const licenseVisible = computed({
    get: () => data.value.displaySettings.developer.visibility.licenseVisible,
    set: (newValue: AccessLevelType) => {
      console.log('licenseVisible変更:', newValue)
      omikujiStore.updateNestedDisplaySettings('developer', {
        visibility: {
          ...data.value.displaySettings.developer.visibility,
          licenseVisible: newValue,
        },
      })
    },
  })

  // gameScriptSettings
  const gameScriptSettings = computed({
    get: () => data.value.displaySettings.developer.visibility.gameScriptSettings,
    set: (newValue: AccessLevelType) => {
      console.log('gameScriptSettings変更:', newValue)
      omikujiStore.updateNestedDisplaySettings('developer', {
        visibility: {
          ...data.value.displaySettings.developer.visibility,
          gameScriptSettings: newValue,
        },
      })
    },
  })

  // gameScripts (配列)
  const gameScripts = computed({
    get: () => data.value.displaySettings.developer.visibility.gameScripts,
    set: (newValue: string[]) => {
      console.log('gameScripts変更:', newValue)
      omikujiStore.updateNestedDisplaySettings('developer', {
        visibility: {
          ...data.value.displaySettings.developer.visibility,
          gameScripts: newValue,
        },
      })
    },
  })

  // wordPartySettings
  const wordPartySettings = computed({
    get: () => data.value.displaySettings.developer.visibility.wordPartySettings,
    set: (newValue: AccessLevelType) => {
      console.log('wordPartySettings変更:', newValue)
      omikujiStore.updateNestedDisplaySettings('developer', {
        visibility: {
          ...data.value.displaySettings.developer.visibility,
          wordPartySettings: newValue,
        },
      })
    },
  })

  return {
    categoryVisibility,
    characterVisible,
    wordPartyLoading,
    licenseVisible,
    gameScriptSettings,
    gameScripts,
    wordPartySettings,
  }
}
