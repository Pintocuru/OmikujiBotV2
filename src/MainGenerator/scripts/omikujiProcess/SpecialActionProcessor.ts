// src/MainGenerator/scripts/OmikujiProcess/SpecialActionProcessor.ts
import { BotMessageEmptySchema, BotMessageType } from '@/types/'
import { ActionSetType } from '@/types/OmikujiData/'
import { createFirstBotMessages } from '../RuleProcess/createBotMessages'
import { useAppStore } from '@main/stores/useAppStore'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { CommentRuleType } from '@/types/'

export interface SpecialActionResult {
  /** trueのとき呼び出し元でルール処理を終了する */
  handled: boolean
  /** コメントトリガーのクールダウンを更新すべきか */
  isCommentTriggered: boolean
  botMessages: BotMessageType[]
}

/**
 * type === 'special' のアクションアイテムをすべて処理するクラス
 *
 * 対応する special 値:
 *  - return   : カウントして処理を終了
 *  - continue : カウントせず次のルールへ
 *  - reset    : 対象ルールのおみくじ回数をリセット
 *  - log      : 対象ルールの統計をトーストで表示
 */
export class SpecialActionProcessor {
  private readonly store = useAppStore()

  /**
   * special アクションを処理する。
   * type が 'special' でない場合は handled: false を返す。
   */
  process(actionItem: ActionSetType, omiken: OmikenCommentType, rule: CommentRuleType): SpecialActionResult {
    if (actionItem.type !== 'special') {
      return { handled: false, isCommentTriggered: false, botMessages: [] }
    }

    switch (actionItem.special) {
      // カウントして処理終了
      case 'return': {
        this.recordDraw(omiken, rule)
        return {
          handled: true,
          isCommentTriggered: true,
          botMessages: [BotMessageEmptySchema.parse({})],
        }
      }

      // カウントせず次のルールへ
      case 'continue': {
        return { handled: true, isCommentTriggered: false, botMessages: [] }
      }

      // おみくじ回数リセット
      case 'reset': {
        this.store.userSession.visits.resetRule(actionItem.key)
        return {
          handled: true,
          isCommentTriggered: false,
          botMessages: createFirstBotMessages(`${actionItem.name}のおみくじ回数をリセットしたよ`),
        }
      }

      // 統計ログ表示
      case 'log': {
        const totalVisits = this.store.userSession.visits.getTotalByRuleId(actionItem.key)
        const totalUnique = this.store.userSession.visits.getUniqueCountByRuleId(actionItem.key)
        return {
          handled: true,
          isCommentTriggered: false,
          botMessages: createFirstBotMessages(
            `${actionItem.name}は、総数${totalVisits}回、${totalUnique}人が遊んでくれたよ`
          ),
        }
      }

      // フォールバック: continue 相当
      default: {
        return { handled: true, isCommentTriggered: false, botMessages: [] }
      }
    }
  }

  private recordDraw(omiken: OmikenCommentType, rule: CommentRuleType): void {
    this.store.userSession.visits.record(rule.key, UserNameSchema.parse(omiken))
  }
}
