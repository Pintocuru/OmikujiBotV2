<!-- src/MainGenerator/ui/FlashBanner/FlashBanner.vue -->
<template>
  <div class="fixed top-0 w-full flex justify-center">
    <Transition name="banner-swap" mode="out-in">
      <FlashBannerItem
        :key="currentMessage?.id ?? 'empty'"
        :message="currentMessage?.bubble?.message ?? ''"
        :layers="layers"
        :icon-size="settings.iconSize"
        :color="currentCharacterColor"
        :show-character-on-right="settings.showCharacterOnRight"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, toRef } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import { useBotDisplay } from '@main/ui/CommentBubble/composables/useBotDisplay'
  import { BotMessageBubbleSchema, BotMessageBubbleType } from '@/types'
  import { SettingsFlashBannerSchema } from '@/types/OmikujiData/'
  import FlashBannerItem from './FlashBannerItem.vue'
  import { ContentPlaceholder } from '@/MainGenerator/scripts/ContentPlaceholder/processor'
  import { transformIconPlaceholders } from '../CommentBubble/TransformIconPlaceholders'

  // Store / Manager
  const appStore = useAppStore()
  const { botMessages, data } = storeToRefs(appStore)
  const { getCharacterColor, getCharacterLayers } = useCharacterManager()

  // 設定
  const settings = computed(() => {
    const raw = appStore.data.components?.settings?.flashBanner
    return SettingsFlashBannerSchema.parse(
      raw ??
        // テスト用
        {
          defaultCharacterKey: null,
          defaultMessage: 'チャンネル登録・高評価、お願いします。視聴数<<viewer>> 高評価<<upVote>>',
          iconSize: 0,
          showCharacterOnRight: false,
        }
    )
  })

  // コメントフィルタリング
  const announceMessages = computed(() =>
    botMessages.value.filter((msg): msg is BotMessageBubbleType => msg.type === 'comment' && !msg.bubble.isToast)
  )

  // 表示制御
  const { displayedComments, start, stop } = useBotDisplay(toRef(() => announceMessages.value))

  // デフォルトメッセージの更新トリガー
  const defaultMessageRefreshKey = ref(0)

  // デフォルトコメント(プレースホルダー適用)
  const defaultComment = computed(() => {
    // refreshKey を参照することで再計算をトリガー
    void defaultMessageRefreshKey.value

    const defaultMessage = settings.value.defaultMessage
    const metaData = appStore.metaState.getCurrent()

    const converted: Record<string, string | number> = {
      upVote: metaData?.upVote ?? 0,
      viewer: metaData?.viewer ?? 0,
    }

    const contentPlaceholder = new ContentPlaceholder(data.value.placeholders)
    contentPlaceholder.updateResolvedValues(converted)
    return contentPlaceholder.processText(defaultMessage)
  })

  // 最新の visible コメント、なければデフォルトメッセージ
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

  // 画像レイヤー
  const layers = computed(() => {
    const messageData = currentMessage.value
    if (!messageData) return []
    return getCharacterLayers(messageData)
  })

  // キャラクターカラー
  const currentCharacterColor = computed(() => {
    const key = currentMessage.value?.bubble?.characterKey ?? null
    return getCharacterColor(key)
  })

  // 30秒ごとにデフォルトメッセージをリフレッシュ
  let refreshInterval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    start()

    // 30秒ごとにリフレッシュキーを更新
    refreshInterval = setInterval(() => {
      defaultMessageRefreshKey.value++
    }, 30000)
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
