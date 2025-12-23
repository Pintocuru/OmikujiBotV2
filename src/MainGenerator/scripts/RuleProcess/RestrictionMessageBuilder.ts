// src/MainGenerator/scripts/OmikujiProcess/RestrictionMessageBuilder.ts
import { BotMessage, BotMessageSchema, CommentRuleType } from '@/types/'
import { RestrictionCheckResult } from '../OmikujiProcess/RestrictionChecker'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'

/**
 * 設定されたメッセージがあればそれを返し、なければデフォルトメッセージを返す
 */
function getMessageOrDefault(configuredMessage: string | null, defaultMessage: string): string {
  return configuredMessage?.trim() || defaultMessage
}

/**
 * 制限タイプに応じたメッセージを作成
 */
function createMessage(result: RestrictionCheckResult, rule: CommentRuleType): string | null {
  const { restrictionType, metadata } = result

  switch (restrictionType) {
    case 'cooldown':
      if (rule.limits.cooldownMessage === '') return null // 空メッセージ

      return getMessageOrDefault(
        rule.limits.cooldownMessage,
        `コメントが被って、「${metadata?.ruleName}」ができなかったよ。またコメントしてね。`
      )

    case 'repeat':
      if (rule.limits.repeatMessage === '') return null // 空メッセージ

      return getMessageOrDefault(
        rule.limits.repeatMessage,
        `${metadata?.userName}さんは、連投制限で「${metadata?.ruleName}」ができなかったよ。`
      )

    default:
      return null
  }
}

/**
 * トーストメッセージを作成
 */
function createToastMessages(message: string): BotMessage[] {
  const appStore = useAppStore()
  const firstCharacter = appStore.characterCollector.getFirstCharacter()

  const botMessageData: Partial<BotMessage> = firstCharacter
    ? {
        name: firstCharacter.name,
        profileImage: firstCharacter.image?.default || null,
        message: {
          toast: message,
        },
        color: firstCharacter.color,
      }
    : {
        message: {
          toast: message,
        },
      }

  return [BotMessageSchema.parse(botMessageData)]
}

/**
 * 制限チェック結果からBotMessageを生成
 */
export function buildRestrictionMessages(result: RestrictionCheckResult, rule: CommentRuleType): BotMessage[] {
  if (!result.isBlocked) return []

  const message = createMessage(result, rule)
  if (!message) return []

  return createToastMessages(message)
}
