// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\ConfigMaker\components\componentEditor\useEnabledComponents.ts
import { computed } from 'vue'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { storeToRefs } from 'pinia'
import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
import { componentLabels } from '@/types/OmikujiData/ComponentsSchema'

// bubble / toast は必ず使える
const BASIC_COMPONENTS = ['bubble', 'toast'] as const

// PRO で使えるコンポーネント
const PRO_COMPONENTS = ['ranking', 'counter'] as const

// GOD（開発者）だけが見れる追加コンポーネント
const GOD_COMPONENTS: string[] = []

export function useEnabledComponents() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()

  const enabledComponents = computed(() => {
    const { components } = data.value.featureUsage
    const enabled = getAvailableComponents(components)
    const unique = [...new Set(enabled)] // 重複排除

    // componentLabels に存在するものだけ返す
    return unique
      .filter((id): id is keyof typeof componentLabels => id in componentLabels)
      .map((id) => ({
        id,
        label: componentLabels[id],
      }))
  })

  // ライセンスによる判定
  function getAvailableComponents(fallback: string[] = []) {
    if (isGod.value) return [...BASIC_COMPONENTS, ...PRO_COMPONENTS, ...GOD_COMPONENTS]
    if (isPro.value) return [...BASIC_COMPONENTS, ...PRO_COMPONENTS]
    return [...BASIC_COMPONENTS, ...fallback]
  }

  return { enabledComponents, getAvailableComponents }
}
