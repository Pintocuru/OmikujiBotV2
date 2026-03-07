// src/MainGenerator/scripts/OmikujiProcess/SpecialActionProcessor.ts
import { ActionSetType, CommentRuleType } from '@/types/OmikujiData/'
import { useAppStore } from '@main/stores/useAppStore'
import { OmikenCommentType, UserNameSchema, UserNameType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'
import { GameStateType } from '@/types'

export interface SpecialActionResult {
  handled: boolean // trueのとき呼び出し元でイベント処理を終了する
  isCountEvent: boolean // カウントを行うか
}

/**
 * type === 'special' のアクションアイテムを処理するクラス
 */
export class SpecialActionProcessor {
  private readonly store = useAppStore()

  process(actionItem: ActionSetType, omiken: OmikenCommentType, rule: CommentRuleType): SpecialActionResult | null {
    if (actionItem.type !== 'special') return null

    const { type, isCountEvent, log } = actionItem.behavior
    const { targetKey, logFormat, logLimit } = log

    if (isCountEvent) this.recordDraw(omiken, rule)

    switch (type) {
      // 処理を終了する
      case 'return':
        return { handled: true, isCountEvent }

      // 次のイベントへ進む
      case 'continue':
        return { handled: false, isCountEvent }

      // おみくじ回数をリセットする
      case 'resetOmikuji': {
        this.store.userSession.visits.resetRule(actionItem.key)
        postSystemMessage(`${actionItem.name}のおみくじ回数をリセットしました`, { username: '__INFO__' })
        return { handled: true, isCountEvent }
      }

      case 'logUserState': {
        const logs = this.store.scriptManager.getGameState(targetKey)?.logs
        if (!logs) return { handled: true, isCountEvent }

        const message = this.formatLogs(logs, logFormat, logLimit)
        postSystemMessage(message, { username: '__INFO__', speech: false })
        return { handled: true, isCountEvent }
      }

      case 'logOmikuji': {
        const { totalVisits, uniqueUsers, averageVisitsPerUser } = this.store.userSession.visits.getStatistics(
          actionItem.key
        )
        const message = `${actionItem.name}/ 実行総数:${totalVisits}回 ユーザー数:${uniqueUsers}人 1人あたり平均:${averageVisitsPerUser}回`
        postSystemMessage(message, { username: '__INFO__', speech: false })
        return { handled: true, isCountEvent }
      }

      /**
       * ログ出力系
       */
      case 'logGame': {
        const logs = this.store.scriptManager.getGameState(targetKey)?.logs
        if (!logs) return { handled: true, isCountEvent: false }

        const message = this.formatLogs(logs, logFormat, logLimit)
        postSystemMessage(message, { username: '__INFO__', speech: false })
        return { handled: true, isCountEvent }
      }

      case 'logVariable': {
        const allData = this.store.placeholderVariable.getAll()
        const message =
          allData.length === 0
            ? '（変数はまだありません）'
            : Object.entries(allData)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')
        postSystemMessage(message, { username: '__INFO__', speech: false })
        return { handled: true, isCountEvent }
      }

      default:
        return { handled: false, isCountEvent }
    }
  }

  /** ログ配列をフォーマット文字列に従って整形し、件数制限して結合する */
  private formatLogs(logs: GameStateType['logs'] = [], logFormat: string, logLimit: number): string {
    return logs
      .map((log, i) => {
        const user = this.resolveUserName(log.userId)
        if (!user) return ''
        return logFormat
          .replace('<<index>>', String(i + 1))
          .replace('<<user>>', user.userName)
          .replace('<<userId>>', user.userId)
          .replace('<<score>>', String(log.score))
          .replace('<<item>>', log.item ?? '')
          .replace('<<flag>>', log.flag ? 'true' : 'false')
          .replace('<<createdAt>>', this.formatDate(log.createdAt))
      })
      .filter(Boolean)
      .slice(0, logLimit)
      .join('\n')
  }

  private recordDraw(omiken: OmikenCommentType, rule: CommentRuleType): void {
    this.store.userSession.visits.record(rule.key, UserNameSchema.parse(omiken))
  }

  private resolveUserName(userId: string): UserNameType | null {
    const hogg = this.store.userSession.stats.get(userId)
    return hogg ?? null
  }
  private formatDate(timestamp: number): string {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }
}
