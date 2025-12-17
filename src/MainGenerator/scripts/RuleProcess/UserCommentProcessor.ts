// src/MainGenerator/script/RuleProcess/UserCommentProcessor.ts
import { BotMessage, CommentRuleType, OmikujiDataType } from '@/types/'
import { GameScriptManager } from '../GameScript/GameScriptManager'
import { RestrictionChecker } from '../OmikujiProcess/RestrictionChecker'
import { RestrictionMessageBuilder } from '../RuleProcess/RestrictionMessageBuilder'
import { OmikujiProcessor } from '../OmikujiProcess/OmikujiProcessor'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { checkAllConditions } from '@shared/utils/threshold/ThresholdChecker'
import { Comment } from '@onecomme.com/onesdk/'

interface RuleProcessResult {
  isCommentTriggered: boolean
  botMessages: BotMessage[]
}

export class UserCommentProcessor {
  private readonly restrictionChecker: RestrictionChecker
  private readonly messageBuilder: RestrictionMessageBuilder
  private readonly omikujiProcessor: OmikujiProcessor

  constructor(
    private readonly omikujiData: OmikujiDataType,
    scriptManager: GameScriptManager
  ) {
    const characters = Object.values(omikujiData.characters)
    const firstCharacter = characters.length > 0 ? characters[0] : null

    this.restrictionChecker = new RestrictionChecker()
    this.messageBuilder = new RestrictionMessageBuilder(firstCharacter)
    this.omikujiProcessor = new OmikujiProcessor(omikujiData, scriptManager)
  }

  /**
   * ユーザーコメントの処理
   */
  process(comment: Comment): BotMessage[] {
    try {
      const { cooldownManager } = useAppStore()
      const sortedRules = this.getSortedEnabledRules()

      for (const rule of sortedRules) {
        const result = this.processRule(comment, rule)

        // ルールが成功し、botメッセージが生成された場合はここで終了
        if (result.botMessages.length > 0) {
          // コメントでの発動なら、クールダウンを設定する
          if (result.isCommentTriggered) {
            cooldownManager.updateLastProcessedTime()
          }
          return result.botMessages
        }
      }

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

    // 2. 制限チェック（純粋なチェックのみ）
    const restrictionResult = this.restrictionChecker.checkRestrictions(comment, rule)

    if (restrictionResult.isBlocked) {
      // 3. 制限チェックの結果からメッセージを生成
      const toastMessages = this.messageBuilder.buildMessages(restrictionResult, rule)
      return {
        isCommentTriggered: false,
        botMessages: toastMessages,
      }
    }

    // 4. おみくじ実行
    const omikujiMessages = this.omikujiProcessor.executeOmikuji(rule.omikuji, comment)

    // 5. ユーザー情報の更新
    cooldownManager.updateUserId(
      comment.data.userId,
      rule.key,
      comment.data.displayName ?? comment.data.name,
      omikujiMessages.map((m) => m.comment).join(',')
    )

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
