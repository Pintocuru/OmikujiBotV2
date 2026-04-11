// src/MainGenerator/ui/common/useFilteredBotMessages.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@main/stores/useAppStore'
import type { BotMessageBubbleType, UiKind } from '@/types'
import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'

type UseFilteredBotMessagesOptions = {
  displaySeconds?: number | null // 表示する時間(秒)
  userIconSize?: number // ユーザーアイコンの大きさ
  allowEmptyMessage?: boolean // 空のメッセージを許可するか
}

const EMPTY_MESSAGE_FALLBACK = '(メッセージが入力されていません)'

export function useFilteredBotMessages(kind: UiKind, options?: UseFilteredBotMessagesOptions) {
  const appStore = useAppStore()
  const { botMessages, data } = storeToRefs(appStore)
  const { hasCondition } = useVisibilityAccess()

  const isKindEnabled = computed(() => data.value.components.conditions.some((c) => c.kind === kind))

  const shouldInclude = (isSecondary: boolean): boolean =>
    (hasCondition('primary', kind) && !isSecondary) || (hasCondition('secondary', kind) && isSecondary)

  const displaySeconds = options?.displaySeconds
  const userIconSize = options?.userIconSize ?? 6
  const allowEmpty = options?.allowEmptyMessage ?? false

  function buildMessage(bot: BotMessageBubbleType, rawMessage: string): BotMessageBubbleType {
    const normalizedMessage = allowEmpty && !rawMessage?.trim() ? EMPTY_MESSAGE_FALLBACK : rawMessage

    const message = resolveIconPlaceholders(
      normalizedMessage,
      (userId) => appStore.userSession.stats.get(userId)?.profileImage,
      userIconSize
    )

    const bubble = {
      ...bot.bubble!,
      message,
      displaySeconds:
        displaySeconds != null ? (displaySeconds === 0 ? null : displaySeconds) : bot.bubble!.displaySeconds,
    }

    return { ...bot, bubble }
  }

  const messages = computed<BotMessageBubbleType[]>(() => {
    if (!isKindEnabled.value) return []

    return botMessages.value.flatMap((msg) => {
      if (msg.type !== 'comment' || !msg.bubble) return []

      const { message, isToast } = msg.bubble

      if (!allowEmpty && !message?.trim()) return []

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
  userIconSize = 6
): string {
  if (!getProfileImage) return raw

  return raw.replace(/\{\{icon\s+([^\}]+)\}\}/g, (_, userId) => {
    const url = getProfileImage(userId)
    return url ? `<img class="inline-block w-${userIconSize} h-${userIconSize} rounded-full" src="${url}" />` : ''
  })
}
