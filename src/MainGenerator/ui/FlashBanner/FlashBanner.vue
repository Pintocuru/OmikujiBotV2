<!-- src/MainGenerator/ui/FlashBanner/FlashBanner.vue -->
<template>
  <div class="fixed top-0 w-full flex justify-center">
    <FlashBannerRenderer
      :key="currentMessage?.id ?? 'default'"
      :settings="settings"
      :message="currentMessage?.bubble?.message ?? ''"
      :layers="layers"
      :color="currentCharacterColor"
      :label-class="blinkClass"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, toRef, watch, onMounted, onUnmounted } from 'vue'
  import { BotMessageBubbleSchema } from '@/types'
  import FlashBannerRenderer from './parts/FlashBannerRenderer.vue'
  import { useBotDisplay } from '@main/ui/CommentBubble/composables/useBotDisplay'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import { useFlashBannerLogic } from './composables/useFlashBannerLogic'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'

  const { getCharacterColor, getCharacterLayers } = useCharacterManager()

  const { settings, blinkClass, triggerBlink, defaultComment, commitIfPending, registerIntervalHook } =
    useFlashBannerLogic()

  const { messages } = useFilteredBotMessages('flashBanner', settings.value.displaySeconds, 12)
  const { displayedComments, start, stop } = useBotDisplay(toRef(() => messages.value))

  // 現在デフォルト表示中かを返すヘルパー
  const isShowingDefault = () => !displayedComments.value.find((m) => m.display?.visible)

  // インターバルのタイミングでデフォルト表示中なら即反映
  registerIntervalHook(() => {
    commitIfPending(isShowingDefault())
  })

  const defaultMessage = computed(() =>
    BotMessageBubbleSchema.parse({
      id: 'flash-default',
      bubble: {
        message: defaultComment.value,
        characterKey: settings.value.defaultCharacterKey,
      },
    })
  )

  const currentMessage = computed(() => {
    const visibleMessage = displayedComments.value.find((m) => m.display?.visible)
    return visibleMessage ?? defaultMessage.value
  })

  const layers = computed(() => {
    if (!currentMessage.value) return []
    return getCharacterLayers(currentMessage.value)
  })

  const currentCharacterColor = computed(() => {
    const key = currentMessage.value?.bubble?.characterKey ?? null
    return getCharacterColor(key)
  })

  const previousMessageId = ref<string | undefined>(undefined)

  // 既存のid watchはそのまま維持（コメント←→デフォルト切り替え用）
  watch(
    () => currentMessage.value?.id,
    async (newId) => {
      if (!newId) {
        previousMessageId.value = newId
        return
      }
      if (newId !== previousMessageId.value && previousMessageId.value !== undefined) {
        await triggerBlink(true)
      }
      previousMessageId.value = newId
    }
  )

  // ★ 追加: デフォルト表示中のメッセージ内容変化を検知してblink
  watch(
    () => defaultComment.value,
    async (newVal, oldVal) => {
      if (newVal === oldVal) return
      // デフォルト表示中のときだけ発火
      if (isShowingDefault()) {
        await triggerBlink(true)
      }
    }
  )

  onMounted(() => start())
  onUnmounted(() => stop())
</script>

<style scoped>
  .banner-swap-enter-active {
    animation: banner-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .banner-swap-leave-active {
    animation: banner-out 0.2s ease-in both;
  }
  @keyframes banner-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes banner-out {
    to {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
</style>
