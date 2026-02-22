// src/MainGenerator/ui/FlashBanner/composables/useFlashBannerLogic.ts
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@main/stores/useAppStore'
import { useDelayedBlink } from '../parts/useDelayedBlink'
import { SettingsFlashBannerSchema } from '@/types/OmikujiData/'
import { usePlaceholderResolver } from '../../common/usePlaceholderResolver'

const DEFAULT_MESSAGE_REFRESH_INTERVAL = 30000

export function useFlashBannerLogic() {
  const appStore = useAppStore()
  const { resolveComment } = usePlaceholderResolver()

  const settings = computed(() =>
    SettingsFlashBannerSchema.parse(
      appStore.data.components?.settings?.flashBanner ?? {
        label: '速報',
        defaultCharacterKey: null,
        defaultMessage: 'チャンネル登録・高評価、お願いします。視聴数 <<viewer>> / 高評価 <<upVote>>',
        iconSize: 8,
        showItemOnRight: false,
      }
    )
  )

  // Blink
  const { blinkClass, triggerBlink } = useDelayedBlink({
    transitionDuration: 350,
    blinkDuration: 750,
  })

  // Default Comment
  const refreshKey = ref(0)

  const defaultComment = computed(() => {
    void refreshKey.value
    return resolveComment(settings.value.defaultMessage ?? '')
  })

  let refreshInterval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    refreshInterval = setInterval(() => {
      refreshKey.value++
    }, DEFAULT_MESSAGE_REFRESH_INTERVAL)
  })

  onUnmounted(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  })

  return {
    settings,
    blinkClass,
    triggerBlink,
    defaultComment,
  }
}
