// src/ConfigMaker/components/scriptGame/useEnabledGames.ts
import { computed } from 'vue'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { storeToRefs } from 'pinia'
import { gameScriptMap } from './GameScriptsMap'

// コンポーザブル関数として定義
export function useEnabledGames() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const enabledGameScriptMap = computed(() => {
    const { gameScripts } = data.value.displaySettings.developer.visibility
    return Object.entries(gameScriptMap)
      .filter(([scriptId]) => gameScripts.includes(scriptId))
      .map(([, scriptPreset]) => scriptPreset)
  })

  return { enabledGameScriptMap }
}
