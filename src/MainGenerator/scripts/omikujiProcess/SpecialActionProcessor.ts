// src/MainGenerator/scripts/OmikujiProcess/SpecialActionProcessor.ts
import { BotMessageEmptySchema, BotMessageType } from '@/types/'
import { ActionBehaviorType, ActionSetType } from '@/types/OmikujiData/'
import { createFirstBotMessages } from '../RuleProcess/createBotMessages'
import { useAppStore } from '@main/stores/useAppStore'
import { OmikenCommentType, UserNameSchema, UserNameType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { CommentRuleType } from '@/types/'

export interface SpecialActionResult {
  handled: boolean // trueのとき呼び出し元でルール処理を終了する
  isCommentTriggered: boolean // コメントトリガーのクールダウンを更新すべきか
  botMessages: BotMessageType[]
}

/**
 * type === 'special' のアクションアイテムを処理するクラス
 */
export class SpecialActionProcessor {
  private readonly store = useAppStore()

  process(actionItem: ActionSetType, omiken: OmikenCommentType, rule: CommentRuleType): SpecialActionResult {
    if (actionItem.type !== 'special') {
      return { handled: false, isCommentTriggered: false, botMessages: [] }
    }

    const behavior = actionItem.behavior

    // おみくじとしてカウントするか
    if (behavior.countEvent) this.recordDraw(omiken, rule)

    switch (behavior.type) {
      case 'return': {
        return {
          handled: true,
          isCommentTriggered: behavior.countEvent,
          botMessages: [BotMessageEmptySchema.parse({})],
        }
      }

      case 'continue': {
        return {
          handled: false,
          isCommentTriggered: false,
          botMessages: [],
        }
      }

      // --- 以下は実装用プレースホルダー ---

      case 'resetOmikuji': {
        // TODO: reset処理
        return {
          handled: true,
          isCommentTriggered: behavior.countEvent ?? false,
          botMessages: [],
        }
      }

      case 'logUserState': {
        // ユーザー状態ログ

        const format = behavior.logFormat ?? '<<user>> <<score>> <<createdAt>>'
        const targetKey = behavior.targetKey ?? ''
        const logs = this.store.scriptManager.getGameState(targetKey)?.logs
        if (!logs) return { handled: true, isCommentTriggered: false, botMessages: [] }

        const lines = logs.map((log, i) => {
          const user = this.resolveUserName(log.userId)
          if (!user) return ''
          return format
            .replace('<<index>>', String(i + 1))
            .replace('<<user>>', user.userName)
            .replace('<<userId>>', user.userId)
            .replace('<<score>>', String(log.score))
            .replace('<<item>>', log.item ?? '')
            .replace('<<flag>>', log.flag ? 'true' : 'false')
            .replace('<<createdAt>>', this.formatDate(log.createdAt))
        })

        // TODO:ログをわんコメのコメントテスターに投稿
        return {
          handled: true,
          isCommentTriggered: behavior.countEvent ?? false,
          botMessages: [],
        }
      }

      case 'logOmikuji': {
        // TODO: おみくじ履歴ログ
        return {
          handled: true,
          isCommentTriggered: behavior.countEvent ?? false,
          botMessages: [],
        }
      }

      case 'logGame': {
        // TODO: ゲーム状態ログ
        return {
          handled: true,
          isCommentTriggered: behavior.countEvent ?? false,
          botMessages: [],
        }
      }

      case 'logVariable': {
        // TODO: 変数ログ
        return {
          handled: true,
          isCommentTriggered: behavior.countEvent ?? false,
          botMessages: [],
        }
      }

      default: {
        return {
          handled: true,
          isCommentTriggered: behavior.countEvent ?? false,
          botMessages: [],
        }
      }
    }
  }

  private recordDraw(omiken: OmikenCommentType, rule: CommentRuleType): void {
    this.store.userSession.visits.record(rule.key, UserNameSchema.parse(omiken))
  }

  private resolveUserName(userId: string): UserNameType | null {
    const hoge = this.store.userSession.stats.get(userId)
    return hoge ?? null
  }
  private formatDate(timestamp: number): string {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }
}

/**
 * 


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

 */
