// src/MainGenerator/ui/FlashBanner/composables/useFlashBannerLogic.ts
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '@main/stores/useAppStore'
import { useDelayedBlink } from '../parts/useDelayedBlink'
import { SettingsBannerSchema } from '@/types/OmikujiData/'
import { usePlaceholderResolver } from '@main/ui/common/usePlaceholderResolver'

const DEFAULT_MESSAGE_REFRESH_INTERVAL = 30000

export function useFlashBannerLogic() {
  const appStore = useAppStore()
  const { resolveComment } = usePlaceholderResolver()

  const settings = computed(() =>
    SettingsBannerSchema.parse(
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

  // 生成側：30秒ごとに新しい候補を作る
  const refreshKey = ref(0)
  const pendingComment = ref<string | null>(null)

  const generateComment = () => resolveComment(settings.value.defaultMessage ?? '')

  // 表示側：安定した参照
  const stableDefaultComment = ref(generateComment())

  // refreshKey が上がったら候補を保存するだけ（即表示しない）
  watch(refreshKey, () => {
    pendingComment.value = generateComment()
  })

  // 外部から「今切り替えていい」と通知する関数
  // isShowingDefault: 現在デフォルト表示中かどうか
  function commitIfPending(isShowingDefault: boolean) {
    if (pendingComment.value !== null && isShowingDefault) {
      stableDefaultComment.value = pendingComment.value
      pendingComment.value = null
    }
  }

  let refreshInterval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    refreshInterval = setInterval(() => {
      refreshKey.value++
      // インターバル時点でデフォルト表示中かは外から渡せないため、
      // isShowingDefault フラグを外部から登録する方式にする
      _onInterval()
    }, DEFAULT_MESSAGE_REFRESH_INTERVAL)
  })

  onUnmounted(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  })

  // インターバル時の処理を外部から登録できるようにする
  let _onInterval: () => void = () => undefined
  function registerIntervalHook(fn: () => void) {
    _onInterval = fn
  }

  return {
    settings,
    blinkClass,
    triggerBlink,
    defaultComment: stableDefaultComment,
    commitIfPending,
    registerIntervalHook,
  }
}
