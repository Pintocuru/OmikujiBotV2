// src/MainGenerator/scripts/BotMessage/createBotMessages.ts
import { BotMessageBubbleSchema, BotMessageBubbleType, CommentEventType } from '@/types'
import { RestrictionCheckResult } from '../OmikujiProcess/RestrictionChecker'
import { useCharacterManager } from '../CharacterManager/useCharacterManager'

/**
 * メッセージを作成
 */
export function createFirstBotMessages(message: string, isToast: boolean = false): BotMessageBubbleType[] {
  const { characterArray } = useCharacterManager()

  // キャラクターがいない場合の明示的な扱い
  const firstCharacter = characterArray.value.length > 0 ? characterArray.value[0] : null

  const botMessageData: BotMessageBubbleType = BotMessageBubbleSchema.parse({
    bubble: {
      name: firstCharacter ? firstCharacter.name : undefined,
      characterKey: firstCharacter ? firstCharacter.key : undefined,
      message,
      isToast,
    },
  })

  return [botMessageData]
}

/**
 * 制限チェック結果からBotMessageを生成
 */
export function buildRestrictionMessages(
  result: RestrictionCheckResult,
  rule: CommentEventType
): BotMessageBubbleType[] {
  if (!result.isBlocked) return []

  const message = createMessage(result, rule)
  if (!message) return []

  return createFirstBotMessages(message, true)
}

/**
 * 制限タイプに応じたメッセージを作成
 */
function createMessage(result: RestrictionCheckResult, rule: CommentEventType): string | null {
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
 * 設定されたメッセージがあればそれを返し、なければデフォルトメッセージを返す
 */
function getMessageOrDefault(configuredMessage: string | null, defaultMessage: string): string {
  return configuredMessage?.trim() || defaultMessage
}
