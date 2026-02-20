<!-- src/MainGenerator/ui/FlashBanner/FlashBanner.vue -->
<template>
  <div class="fixed top-0 w-full flex justify-center">
    <Transition name="banner-swap" mode="out-in">
      <FlashBannerRenderer
        :key="transitionKey"
        :settings="settings"
        :message="currentMessage?.bubble?.message ?? ''"
        :layers="layers"
        :color="currentCharacterColor"
        :label-class="blinkClass"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, toRef, watch, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageBubbleSchema, BotMessageBubbleType } from '@/types'
  import FlashBannerRenderer from './parts/FlashBannerRenderer.vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useBotDisplay } from '@main/ui/CommentBubble/composables/useBotDisplay'
  import { transformIconPlaceholders } from '@main/ui/CommentBubble/TransformIconPlaceholders'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import { useFlashBannerLogic } from './composables/useFlashBannerLogic'

  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)
  const { getCharacterColor, getCharacterLayers } = useCharacterManager()

  // Blink + DefaultComment（コンポーザブルに委譲）
  const { settings, blinkClass, triggerBlink, defaultComment } = useFlashBannerLogic()

  // Message Management
  const announceMessages = computed(() => {
    const displaySeconds = settings.value.displaySeconds
    return botMessages.value
      .filter((msg): msg is BotMessageBubbleType => msg.type === 'comment' && !msg.bubble.isToast)
      .map((msg) => {
        if (displaySeconds === null) return msg
        return {
          ...msg,
          bubble: {
            ...msg.bubble,
            displaySeconds: displaySeconds === 0 ? null : displaySeconds,
          },
        }
      })
  })

  const { displayedComments, start, stop } = useBotDisplay(toRef(() => announceMessages.value))

  // Current Display Message
  const currentMessage = computed(() => {
    const visibleMessage = displayedComments.value.find((m) => m.display?.visible)

    if (visibleMessage) {
      return {
        ...visibleMessage,
        bubble: {
          ...visibleMessage.bubble,
          message: transformIconPlaceholders(visibleMessage.bubble.message),
        },
      }
    }

    return BotMessageBubbleSchema.parse({
      bubble: {
        message: defaultComment.value,
        characterKey: settings.value.defaultCharacterKey,
      },
    })
  })

  // Character Display
  const layers = computed(() => {
    if (!currentMessage.value) return []
    return getCharacterLayers(currentMessage.value)
  })

  const currentCharacterColor = computed(() => {
    const key = currentMessage.value?.bubble?.characterKey ?? null
    return getCharacterColor(key)
  })

  // Transition Key
  const transitionKey = computed(() => currentMessage.value?.id ?? 'default')

  // Blink Watch
  const previousMessageId = ref<string | undefined>(undefined)

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

  // Lifecycle（useBotDisplay の start/stop のみ残す）
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
