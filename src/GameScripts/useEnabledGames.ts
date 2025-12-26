// src/ConfigMaker/components/scriptGame/useEnabledGames.ts
import { computed } from 'vue'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { storeToRefs } from 'pinia'
import { gameScriptMap } from './GameScriptsMap'
import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
import { getAvailableScripts } from './GameScriptsRules'

export function useEnabledGames() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()

  const enabledGameScriptMap = computed(() => {
    const { gameScripts } = data.value.featureUsage

    // 現在の状態からモードを判定
    const mode = isGod.value ? 'godMode' : isPro.value ? 'pro' : 'basic'

    // 分離した共通ロジックを使用
    const enabled = getAvailableScripts(mode, gameScripts)

    return Object.entries(gameScriptMap)
      .filter(([scriptId]) => enabled.includes(scriptId))
      .map(([, scriptPreset]) => scriptPreset)
  })

  return { enabledGameScriptMap }
}
