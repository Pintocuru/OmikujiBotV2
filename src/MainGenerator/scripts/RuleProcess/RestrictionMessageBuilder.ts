// src/MainGenerator/scripts/OmikujiProcess/RestrictionMessageBuilder.ts
import { BotMessageCommentSchema, BotMessageType, CommentRuleType } from '@/types/'
import { RestrictionCheckResult } from '../OmikujiProcess/RestrictionChecker'
import { useCharacterManager } from '../CharacterManager/useCharacterManager'
import { useVisibilityAccess } from '../FeatureAccess/useAccessCheckerMain'

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
 * メッセージを作成
 */
export function createBotMessages(message: string, isToast: boolean = false): BotMessageType[] {
  const { isCharacter } = useVisibilityAccess()
  const { defaultToastColor } = useCharacterManager()
  const firstCharacter = useCharacterManager().getFirstCharacter()

  const botMessageData: BotMessageType = BotMessageCommentSchema.parse({
    bubble: {
      name: firstCharacter?.name,
      message,
      isToast,
      characterKey: firstCharacter?.key,
      color: isCharacter.value && firstCharacter ? firstCharacter.color : defaultToastColor.value,
    },
  })

  return [botMessageData]
}

/**
 * 制限チェック結果からBotMessageを生成
 */
export function buildRestrictionMessages(result: RestrictionCheckResult, rule: CommentRuleType): BotMessageType[] {
  if (!result.isBlocked) return []

  const message = createMessage(result, rule)
  if (!message) return []

  return createBotMessages(message, true)
}
