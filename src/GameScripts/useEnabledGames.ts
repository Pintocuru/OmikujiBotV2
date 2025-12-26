// src/ConfigMaker/components/scriptGame/useEnabledGames.ts
import { computed } from 'vue'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { storeToRefs } from 'pinia'
import { gameScriptMap } from './GameScriptsMap'
import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

// PRO版は製品で使えるものすべて利用できる
const PRO_SCRIPTS = ['GouseiSuika', 'BomberSpin', 'DwarfBomb', 'MultiplyBonanza']

// 開発版も見れるバージョン
const GOD_SCRIPTS = ['GoogolClover']

export function useEnabledGames() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()

  // gameScripts に入っているゲームをリスト表示
  const enabledGameScriptMap = computed(() => {
    const { gameScripts } = data.value.featureUsage
    const enabled = getAvailableScripts(gameScripts)

    return Object.entries(gameScriptMap)
      .filter(([scriptId]) => enabled.includes(scriptId))
      .map(([, scriptPreset]) => scriptPreset)
  })

  // ライセンスによる判定
  function getAvailableScripts(fallback: string[] = []) {
    if (isGod.value) return [...PRO_SCRIPTS, ...GOD_SCRIPTS]
    if (isPro.value) return PRO_SCRIPTS
    return fallback
  }

  return { enabledGameScriptMap, getAvailableScripts }
}
