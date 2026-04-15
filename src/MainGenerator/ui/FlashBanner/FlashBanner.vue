<!-- src/MainGenerator/ui/FlashBanner/FlashBanner.vue -->
<template>
  <CenteringWrapper>
    <FlashBannerSelector
      :key="currentMessage.id"
      :settings="settings"
      :message="currentMessage.bubble?.message ?? ''"
      :layers="layers"
      :color="currentCharacterColor"
      :label-class="blinkClass"
    />
  </CenteringWrapper>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { BotMessageBubbleSchema, FlashBannerSchema } from '@/types'
  import FlashBannerSelector from './parts/FlashBannerSelector.vue'
  import { useBotDisplay } from '@main/ui/CommentBubble/composables/useBotDisplay'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import { useFlashBannerDisplay } from './composables/useFlashBannerDisplay'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'
  import CenteringWrapper from '../common/CenteringWrapper.vue'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import { useDelayedBlink } from './composables/useDelayedBlink'
  import { usePlaceholderInterval } from '../common/usePlaceholderInterval'

  const appStore = useAppStore()
  const { getCharacterColor, getCharacterLayers } = useCharacterManager()
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

  const { messages } = useFilteredBotMessages('flashBanner', {
    displaySeconds: settings.value.displaySeconds,
    userIconSize: 12,
  })

  const { displayedComments, start, stop } = useBotDisplay(messages)

  const defaultMessage = computed(() =>
    BotMessageBubbleSchema.parse({
      id: 'flash-default',
      bubble: {
        message: defaultComment.value,
        characterKey: settings.value.defaultCharacterKey,
        displaySeconds: settings.value.displaySeconds,
      },
    })
  )

  // メッセージ切り替え時に blink を発火（watch 不使用）
  const { currentMessage, isShowingDefault } = useFlashBannerDisplay({
    displayedComments,
    defaultMessage,
    onMessageChanged: () => triggerBlink(true),
  })

  // インターバルのタイミングでデフォルト表示中なら pending な defaultComment を反映
  registerIntervalHook(() => {
    commitIfPending(isShowingDefault())
  })

  const layers = computed(() => getCharacterLayers(currentMessage.value))

  const currentCharacterColor = computed(() => getCharacterColor(currentMessage.value.bubble?.characterKey ?? null))

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
