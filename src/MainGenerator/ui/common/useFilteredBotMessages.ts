// src/MainGenerator/ui/common/useFilteredBotMessages.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@main/stores/useAppStore'
import type { BotMessageBubbleType, UiKind } from '@/types'
import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'

export function useFilteredBotMessages(kind: UiKind, displaySeconds?: number | null, iconSize?: number) {
  const appStore = useAppStore()
  const { botMessages, data } = storeToRefs(appStore)
  const { hasCondition } = useVisibilityAccess()

  const isKindEnabled = computed(() => data.value.components.conditions.some((c) => c.kind === kind))

  const shouldInclude = (isSecondary: boolean): boolean =>
    (hasCondition('primary', kind) && !isSecondary) || (hasCondition('secondary', kind) && isSecondary)

  function buildMessage(bot: BotMessageBubbleType, rawMessage: string): BotMessageBubbleType {
    const message = resolveIconPlaceholders(
      rawMessage,
      (userId) => appStore.userSession.stats.get(userId)?.profileImage,
      iconSize
    )

    const bubble: BotMessageBubbleType['bubble'] = {
      ...bot.bubble!,
      message,
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
  getProfileImage?: (userId: string) => string | undefined,
  iconSize = 6
): string {
  if (!getProfileImage) return raw
  return raw.replace(/\{\{icon\s+([^\}]+)\}\}/g, (_, userId) => {
    const url = getProfileImage(userId)
    return url ? `<img class="inline-block w-${iconSize} h-${iconSize} rounded-full" src="${url}" />` : ''
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
