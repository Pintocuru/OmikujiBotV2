// src/MainGenerator/script/omikujiProcess/UserCommentProcessor.ts
import { BotMessage, CommentRuleType, OmikujiDataType } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { GameScriptManager } from './GameScriptManager'
import { CommentRestrictionChecker } from './CommentRestrictionChecker'
import { OmikujiProcessor } from './OmikujiProcessor'
import { useAppStore } from '@/MainGenerator/stores'
import { checkAllConditions } from '@shared/utils/threshold/ThresholdChecker'

interface RuleProcessResult {
  isCommentTriggered: boolean // コメントによって起動したかをチェック
  botMessages: BotMessage[]
}

export class UserCommentProcessor {
  private readonly restrictionChecker: CommentRestrictionChecker
  private readonly omikujiProcessor: OmikujiProcessor

  constructor(
    private readonly omikujiData: OmikujiDataType,
    scriptManager: GameScriptManager
  ) {
    const characters = Object.values(omikujiData.characters)
    const firstCharacter = characters.length > 0 ? characters[0] : null
    this.restrictionChecker = new CommentRestrictionChecker(firstCharacter)
    this.omikujiProcessor = new OmikujiProcessor(omikujiData, scriptManager)
  }

  /**
   * ユーザーコメントの処理
   */
  generateBotMessages(comment: Comment): BotMessage[] {
    try {
      const { cooldownManager } = useAppStore()
      const sortedRules = this.getSortedEnabledRules()

      for (const rule of sortedRules) {
        const result = this.processRule(comment, rule)

        // ルールが成功し、botメッセージが生成された場合はここで終了
        if (result.botMessages.length > 0) {
          // コメントでの発動なら、クールダウンを設定する
          // (100回目のコメント等、コメントが条件でないおみくじはこれをスルーする)
          if (result.isCommentTriggered) {
            cooldownManager.updateLastProcessedTime()
          }
          return result.botMessages
        }
      }

      // どのルールにもマッチしなかった場合
      return []
    } catch (error) {
      console.error('ユーザーコメント処理エラー:', error)
      return []
    }
  }

  /**
   * 単一ルールの処理
   */
  private processRule(comment: Comment, rule: CommentRuleType): RuleProcessResult {
    const { cooldownManager } = useAppStore()

    // 1. 閾値条件チェック
    if (!this.validateThreshold(comment, rule)) {
      return { isCommentTriggered: false, botMessages: [] }
    }

    // 2. 制限チェック（ユーザーID重複、クールダウンなど）
    const restrictionResult = this.restrictionChecker.checkRestrictions(comment, rule)
    if (restrictionResult.isBlocked) {
      return {
        isCommentTriggered: false,
        botMessages: restrictionResult.toastMessages,
      }
    }

    // 3. おみくじ実行
    const omikujiMessages = this.omikujiProcessor.executeOmikuji(comment, rule)

    // 4. ユーザー情報の更新
    cooldownManager.updateUserId(comment.data.userId, rule.id, omikujiMessages.map((m) => m.comment).join(','))

    // チャットワード起動かどうかを判定
    const isCommentTriggered = rule.threshold.conditions.includes('comment')

    return {
      isCommentTriggered,
      botMessages: omikujiMessages,
    }
  }

  /**
   * ルールの並び替え
   */
  private getSortedEnabledRules(): CommentRuleType[] {
    return Object.values(this.omikujiData.comments)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)
  }

  /**
   * コメントルールの条件チェック
   */
  private validateThreshold(comment: Comment, rule: CommentRuleType): boolean {
    return checkAllConditions(comment, rule.threshold)
  }
}
