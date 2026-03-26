// src/MainGenerator/ui/FlashBanner/composables/useFlashBannerLogic.ts
import { computed } from 'vue'
import { FlashBannerSchema } from '@/types/OmikujiData/'
import { useAppStore } from '@main/stores/useAppStore'
import { useDelayedBlink } from '../parts/useDelayedBlink'
import { usePlaceholderInterval } from '@main/ui/common/usePlaceholderInterval'

export function useFlashBannerLogic() {
  const appStore = useAppStore()

  const settings = computed(() =>
    FlashBannerSchema.parse(
      appStore.data.components?.settings?.flashBanner ?? {
        label: '速報',
        defaultCharacterKey: null,
        defaultMessage: 'チャンネル登録・高評価、お願いします。視聴数 <<viewer>> / 高評価 <<upVote>>',
        iconSize: 8,
        showItemOnRight: false,
      }
    )
  )

  const { blinkClass, triggerBlink } = useDelayedBlink({
    transitionDuration: 350,
    blinkDuration: 750,
  })

  const {
    message: defaultComment,
    commitIfPending,
    registerIntervalHook,
  } = usePlaceholderInterval(() => settings.value.defaultMessage ?? '')

  return {
    settings,
    blinkClass,
    triggerBlink,
    defaultComment,
    commitIfPending,
    registerIntervalHook,
  }
}
