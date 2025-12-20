// src/ConfigMaker/components/scriptGame/useEnabledGames.ts
import { computed } from 'vue'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { storeToRefs } from 'pinia'
import { gameScriptMap } from './GameScriptsMap'
import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

export function useEnabledGames() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()

  // PRO版は製品で使えるものすべて利用できる
  const PRO_SCRIPTS = ['GouseiSuika', 'BomberSpin', 'DwarfBomb', 'MultiplyBonanza']

  // 開発版も見れるバージョン
  const GOD_EXTRA = ['GoogolClover']

  // gameScripts に入っているゲームをリスト表示
  const enabledGameScriptMap = computed(() => {
    const { gameScripts } = data.value.displaySettings.developer.visibility

    const enabled = isGod.value ? [...PRO_SCRIPTS, ...GOD_EXTRA] : isPro.value ? PRO_SCRIPTS : gameScripts

    return Object.entries(gameScriptMap)
      .filter(([scriptId]) => enabled.includes(scriptId))
      .map(([, scriptPreset]) => scriptPreset)
  })

  return { enabledGameScriptMap }
}
