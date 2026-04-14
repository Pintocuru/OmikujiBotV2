<!-- src/MainGenerator/ui/LiveClock/LiveClock.vue -->
<template>
  <CenteringWrapper>
    <LiveClockSelector
      :settings="settings"
      :default-message="defaultMessage"
      :is-mounted="isMounted"
      :is-flipped="isFlipped"
      :current-msg="currentMsg"
    />
  </CenteringWrapper>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'
  import { useBotDisplay } from '../CommentBubble/composables/useBotDisplay'
  import { LiveClockSchema } from '@/types/OmikujiData/UiSettings/LiveClockSchema'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import { usePlaceholderInterval } from '../common/usePlaceholderInterval'
  import LiveClockSelector from './parts/LiveClockSelector.vue'
  import CenteringWrapper from '../common/CenteringWrapper.vue'

  const appStore = useAppStore()

  const settings = computed(() => LiveClockSchema.parse(appStore.data.components?.settings?.liveClock ?? {}))

  const { messages } = useFilteredBotMessages('liveClock', {
    userIconSize: 6,
  })
  const { displayedComments, start, stop } = useBotDisplay(messages)

  const {
    message: defaultMessage,
    commitIfPending,
    registerIntervalHook,
  } = usePlaceholderInterval(() => settings.value.defaultMessage ?? '')

  registerIntervalHook(() => {
    commitIfPending(!isFlipped.value)
  })

  // 時計
  const isMounted = ref(false)

  // フリップ制御
  const isFlipped = ref(false)
  const currentMsg = ref('')

  let flipBackTimer: ReturnType<typeof setTimeout> | null = null

  function calcLifeTime(displaySeconds: number | null | undefined): number {
    if (displaySeconds === null) return Infinity
    if (displaySeconds !== undefined) return displaySeconds * 1000

    const rawLength = currentMsg.value.length
    const commentLength = Math.min(rawLength, 100)
    const extraTime = Math.max(commentLength - 30, 0) * 100
    return 10_000 + extraTime
  }

  function flipToMessage(msg: string, displaySeconds: number | null | undefined) {
    if (flipBackTimer !== null) {
      clearTimeout(flipBackTimer)
      flipBackTimer = null
    }

    currentMsg.value = msg
    isFlipped.value = true

    const lifeTime = calcLifeTime(displaySeconds)

    if (lifeTime === Infinity) return

    flipBackTimer = setTimeout(() => {
      isFlipped.value = false
      flipBackTimer = null
    }, lifeTime)
  }

  // コメント監視
  watch(
    () => displayedComments.value[0],
    (latest) => {
      if (!latest?.bubble?.message) return
      flipToMessage(latest.bubble.message, latest.bubble.displaySeconds)
    }
  )

  watch(
    () => displayedComments.value.length,
    (len) => {
      if (len === 0) {
        if (flipBackTimer !== null) {
          clearTimeout(flipBackTimer)
          flipBackTimer = null
        }
        isFlipped.value = false
      }
    }
  )

  // ライフサイクル

  onMounted(() => {
    //startLiveClock()
    start()

    requestAnimationFrame(() => {
      isMounted.value = true
    })
  })

  onUnmounted(() => {
    // stopLiveClock()
    stop()
  })
</script>
