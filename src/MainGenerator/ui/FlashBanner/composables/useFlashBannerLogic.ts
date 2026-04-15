// src/MainGenerator/ui/FlashBanner/composables/useFlashBannerLogic.ts
import { computed } from 'vue'
import { FlashBannerSchema } from '@/types/OmikujiData/'
import { useAppStore } from '@main/stores/useAppStore'
import { useDelayedBlink } from './useDelayedBlink'
import { usePlaceholderInterval } from '@main/ui/common/usePlaceholderInterval'

export function useFlashBannerLogic() {
  const appStore = useAppStore()

  const settings = computed(() => FlashBannerSchema.parse(appStore.data.components?.settings?.flashBanner ?? {}))

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
