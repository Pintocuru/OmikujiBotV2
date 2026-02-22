// src/MainGenerator/composables/useFilteredBotMessages.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@main/stores/useAppStore'
import type { BotMessageBubbleType, UiKind } from '@/types'
import { useVisibilityAccess } from '@/MainGenerator/scripts/FeatureAccess/useAccessCheckerMain'

export function useFilteredBotMessages(kind: UiKind, displaySeconds?: number | null) {
  const appStore = useAppStore()
  const { botMessages, data } = storeToRefs(appStore)
  const { hasCondition } = useVisibilityAccess()

  const isKindEnabled = computed(() => data.value.components.conditions.some((c) => c.kind === kind))

  const shouldInclude = (isToast: boolean): boolean =>
    (hasCondition('primary', 'bubble') && !isToast) || (hasCondition('secondary', 'bubble') && isToast)

  function buildMessage(bot: BotMessageBubbleType, rawMessage: string): BotMessageBubbleType {
    const message = resolveIconPlaceholders(
      rawMessage,
      (userId) => appStore.userSession.stats.get(userId)?.profileImage
    )

    const bubble: BotMessageBubbleType['bubble'] = {
      ...bot.bubble!,
      message: message ?? rawMessage,
      ...(displaySeconds != null && applyDisplaySeconds(bot.bubble, displaySeconds)),
    }

    return { ...bot, bubble }
  }

  const messages = computed<BotMessageBubbleType[]>(() => {
    if (!isKindEnabled.value) return []

    return botMessages.value.flatMap((msg) => {
      if (msg.type !== 'comment' || !msg.bubble) return []
      const { message, isToast } = msg.bubble
      return shouldInclude(isToast) ? [buildMessage(msg, message)] : []
    })
  })

  return { messages }
}

/**
 * ユーザーアイコンを取得
 */
export function resolveIconPlaceholders(
  raw: string,
  getProfileImage?: (userId: string) => string | undefined
): string | null {
  if (!getProfileImage) return null
  return raw.replace(/\{\{icon\s+([^\}]+)\}\}/g, (_, userId) => {
    const url = getProfileImage(userId)
    return url ? `<img class="inline-block w-6 h-6 rounded-full" src="${url}" />` : ''
  })
}

function applyDisplaySeconds(
  bubble: BotMessageBubbleType['bubble'],
  displaySeconds: number
): BotMessageBubbleType['bubble'] {
  return {
    ...bubble!,
    displaySeconds: displaySeconds === 0 ? null : displaySeconds,
  }
}
