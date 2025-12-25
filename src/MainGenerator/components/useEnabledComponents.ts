// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\MainGenerator\components\useEnabledComponents.ts
import { computed } from 'vue'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { storeToRefs } from 'pinia'
import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
import { componentLabels, settingsComponentsCondition } from '@/types/OmikujiData/ComponentsSchema'

export function useEnabledComponents() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()

  // bubble / toast は必ず使える
  const BASE_ALWAYS = ['bubble', 'toast'] as const

  // PRO で使えるコンポーネント
  const PRO_SCRIPTS = ['ranking', 'counter'] as const

  // GOD（開発者）だけが見れる追加コンポーネント
  const GOD_EXTRA: string[] = []

  const enabledComponents = computed(() => {
    const { components } = data.value.featureUsage

    let enabled: string[]

    if (isGod.value) {
      enabled = [...BASE_ALWAYS, ...PRO_SCRIPTS, ...GOD_EXTRA]
    } else if (isPro.value) {
      enabled = [...BASE_ALWAYS, ...PRO_SCRIPTS]
    } else {
      enabled = [...BASE_ALWAYS, ...components]
    }

    // 重複排除
    const unique = [...new Set(enabled)]

    // componentLabels に存在するものだけ返す
    return unique
      .filter((id): id is keyof typeof componentLabels => id in componentLabels)
      .map((id) => ({
        id,
        label: componentLabels[id],
      }))
  })

  return { enabledComponents }
}
