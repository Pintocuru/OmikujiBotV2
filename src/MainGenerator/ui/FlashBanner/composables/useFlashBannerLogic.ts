// src/MainGenerator/ui/FlashBanner/composables/useFlashBannerLogic.ts
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@main/stores/useAppStore'
import { ContentPlaceholder } from '@/MainGenerator/scripts/ContentPlaceholder/processor'
import { useDelayedBlink } from '../parts/useDelayedBlink'
import { SettingsFlashBannerSchema } from '@/types/OmikujiData/'

const DEFAULT_MESSAGE_REFRESH_INTERVAL = 30000

export function useFlashBannerLogic() {
  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

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

    const metaData = appStore.metaState.getCurrent()
    const drawWinners = appStore.userSession.stats.drawWinners()

    const placeholderValues: Record<string, string | number> = {
      upVote: metaData?.upVote ?? 0,
      viewer: metaData?.viewer ?? 0,
      commenter: drawWinners.commenter ?? 0,
      winner: drawWinners.winners[0]?.userName ?? '名無し',
    }

    const contentPlaceholder = new ContentPlaceholder(data.value.placeholders)
    contentPlaceholder.updateResolvedValues(placeholderValues)

    return contentPlaceholder.processText(settings.value.defaultMessage ?? '')
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
