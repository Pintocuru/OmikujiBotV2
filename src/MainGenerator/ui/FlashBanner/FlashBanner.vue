<!-- src/MainGenerator/ui/FlashBanner/FlashBanner.vue -->
<template>
  <div class="fixed top-0 w-full flex justify-center">
    <Transition name="banner-swap" mode="out-in">
      <FlashBannerItem
        :key="transitionKey"
        :label="settings.label"
        :message="currentMessage?.bubble?.message ?? ''"
        :layers="layers"
        :icon-size="settings.iconSize"
        :color="currentCharacterColor"
        :show-character-on-right="settings.showCharacterOnRight"
        :label-class="blinkClass"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageBubbleSchema, BotMessageBubbleType } from '@/types'
  import { SettingsFlashBannerSchema } from '@/types/OmikujiData/'
  import FlashBannerItem from './parts/FlashBannerItem.vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useBotDisplay } from '@main/ui/CommentBubble/composables/useBotDisplay'
  import { transformIconPlaceholders } from '@main/ui/CommentBubble/TransformIconPlaceholders'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import { ContentPlaceholder } from '@/MainGenerator/scripts/ContentPlaceholder/processor'
  import { useDelayedBlink } from './parts/useDelayedBlink'

  // Store & Managers

  const appStore = useAppStore()
  const { botMessages, data } = storeToRefs(appStore)
  const { getCharacterColor, getCharacterLayers } = useCharacterManager()

  // Settings
  const settings = computed(() => {
    const raw = appStore.data.components?.settings?.flashBanner
    return SettingsFlashBannerSchema.parse(
      raw ?? {
        label: '速報',
        defaultCharacterKey: null,
        defaultMessage: 'チャンネル登録・高評価、お願いします。視聴数 <<viewer>> / 高評価 <<upVote>>',
        iconSize: 8,
        showCharacterOnRight: false,
      }
    )
  })

  // Message Management

  /** アナウンス対象のコメントをフィルタリング */
  const announceMessages = computed(() =>
    botMessages.value.filter((msg): msg is BotMessageBubbleType => msg.type === 'comment' && !msg.bubble.isToast)
  )

  /** 表示コメントの制御 */
  const { displayedComments, start, stop } = useBotDisplay(toRef(() => announceMessages.value))

  // Default Message with Placeholders
  const defaultMessageRefreshKey = ref(0)

  /** プレースホルダーを解決したデフォルトメッセージ */
  const defaultComment = computed(() => {
    void defaultMessageRefreshKey.value // 再計算トリガー

    const defaultMessage = settings.value.defaultMessage
    const metaData = appStore.metaState.getCurrent()
    const drawWinners = appStore.userSession.stats.drawWinners()

    const placeholderValues: Record<string, string | number> = {
      upVote: metaData?.upVote ?? 0,
      viewer: metaData?.viewer ?? 0,
      commenter: drawWinners.commenter ?? 0,
      winner: drawWinners.winners[0].userName ?? '名無し',
    }

    const contentPlaceholder = new ContentPlaceholder(data.value.placeholders)
    contentPlaceholder.updateResolvedValues(placeholderValues)
    return contentPlaceholder.processText(defaultMessage)
  })

  /** 30秒ごとにデフォルトメッセージを更新 */
  const DEFAULT_MESSAGE_REFRESH_INTERVAL = 30000
  let refreshInterval: ReturnType<typeof setInterval> | null = null

  // Current Display Message

  /** 現在表示中のメッセージ（visible なコメント or デフォルト） */
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

    // デフォルトメッセージを返す
    return BotMessageBubbleSchema.parse({
      bubble: {
        message: defaultComment.value,
        characterKey: settings.value.defaultCharacterKey,
      },
    })
  })

  // Character Display

  /** キャラクターの画像レイヤー */
  const layers = computed(() => {
    const messageData = currentMessage.value
    if (!messageData) return []
    return getCharacterLayers(messageData)
  })

  /** キャラクターのカラー設定 */
  const currentCharacterColor = computed(() => {
    const key = currentMessage.value?.bubble?.characterKey ?? null
    return getCharacterColor(key)
  })

  // Transition & Blink Control

  /** Transition用のキー（デフォルト or コメントID） */
  const transitionKey = computed(() => {
    return currentMessage.value?.id ?? 'default'
  })

  /** ブリンク制御（コンポーザブル使用） */
  const { blinkClass, triggerBlink } = useDelayedBlink({
    transitionDuration: 350,
    blinkDuration: 750,
  })

  const previousMessageId = ref<string | undefined>(undefined)

  /** 新しいコメント表示時にブリンクアニメーションを実行 */
  watch(
    () => currentMessage.value?.id,
    async (newId) => {
      // デフォルトメッセージへの切り替えはブリンクしない
      if (!newId) {
        previousMessageId.value = newId
        return
      }

      // 新しいコメントへの切り替え時のみブリンク
      if (newId !== previousMessageId.value && previousMessageId.value !== undefined) {
        await triggerBlink(true) // Transition完了後にブリンク
      }

      previousMessageId.value = newId
    }
  )

  // Lifecycle

  onMounted(() => {
    start()

    refreshInterval = setInterval(() => {
      defaultMessageRefreshKey.value++
    }, DEFAULT_MESSAGE_REFRESH_INTERVAL)
  })

  onUnmounted(() => {
    stop()

    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  })
</script>

<style scoped>
  /* バナー切り替えアニメーション */
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
