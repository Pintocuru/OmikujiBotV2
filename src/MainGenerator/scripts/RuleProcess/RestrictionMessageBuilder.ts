// src/MainGenerator/scripts/OmikujiProcess/RestrictionMessageBuilder.ts
import { BotMessage, BotMessageSchema, CharacterType, CommentRuleType } from '@/types/'
import { RestrictionCheckResult, DrawLimitAction } from '../OmikujiProcess/RestrictionChecker'

/**
 * 制限チェックの結果からメッセージを生成するクラス
 */
export class RestrictionMessageBuilder {
  constructor(private readonly firstCharacter: CharacterType | null) {}

  /**
   * 制限チェック結果からBotMessageを生成
   */
  buildMessages(result: RestrictionCheckResult, rule: CommentRuleType): BotMessage[] {
    if (!result.isBlocked) {
      return []
    }

    const message = this.createMessage(result, rule)
    if (!message) {
      return []
    }

    return this.createToastMessages(message)
  }

  /**
   * 制限タイプに応じたメッセージを作成
   */
  private createMessage(result: RestrictionCheckResult, rule: CommentRuleType): string | null {
    const { restrictionType, metadata } = result

    switch (restrictionType) {
      case 'cooldown':
        return this.getMessageOrDefault(
          rule.limits.cooldownMessage,
          `コメントが被って、「${metadata?.ruleName}」ができなかったよ。またコメントしてね。`
        )

      case 'repeat':
        return this.getMessageOrDefault(
          rule.limits.repeatMessage,
          `${metadata?.userName}さんは、連投制限で「${metadata?.ruleName}」ができなかったよ。`
        )

      case 'drawLimit': {
        const action = rule.limits.drawLimitExceeded as DrawLimitAction

        if (action === 'showMessage') {
          return this.getMessageOrDefault(
            rule.limits.drawLimitMessage,
            `${metadata?.userName}さんの「${metadata?.ruleName}」は上限の${metadata?.drawLimit}回を超えているよ。`
          )
        }

        if (action === 'showLastResult') {
          return `${metadata?.userName}さんの「${metadata?.ruleName}」は上限の${metadata?.drawLimit}回を超えているよ。 最後の結果:${metadata?.lastBotMessages}`
        }

        return null
      }

      case 'none':
      default:
        return null
    }
  }

  /**
   * トーストメッセージを作成
   */
  private createToastMessages(message: string): BotMessage[] {
    const botMessageData = this.firstCharacter
      ? {
          name: this.firstCharacter.name,
          profileImage: this.firstCharacter.image?.default || null,
          comment: message,
          isToast: true,
          color: this.firstCharacter.color,
        }
      : {
          comment: message,
          isToast: true,
        }

    return [BotMessageSchema.parse(botMessageData)]
  }

  /**
   * 設定されたメッセージがあればそれを返し、なければデフォルトメッセージを返す
   */
  private getMessageOrDefault(configuredMessage: string | undefined, defaultMessage: string): string {
    return configuredMessage?.trim() || defaultMessage
  }
}
