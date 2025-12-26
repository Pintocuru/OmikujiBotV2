// src\ConfigMaker\components\componentEditor\useEnabledComponents.ts
import { computed } from 'vue'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { storeToRefs } from 'pinia'
import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
import { componentLabels } from '@/types/OmikujiData/ComponentsSchema'
// 新しいロジックファイルをインポート
import { getAvailableComponents } from './componentRules'

export function useEnabledComponents() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()

  const enabledComponents = computed(() => {
    const { components } = data.value.featureUsage

    // 現在の状態からモードを判定
    const mode = isGod.value ? 'godMode' : isPro.value ? 'pro' : 'basic'

    // 共通ロジックを使用
    const enabled = getAvailableComponents(mode, components)
    const unique = [...new Set(enabled)]

    return unique
      .filter((id): id is keyof typeof componentLabels => id in componentLabels)
      .map((id) => ({
        id,
        label: componentLabels[id],
      }))
  })

  return { enabledComponents }
}
