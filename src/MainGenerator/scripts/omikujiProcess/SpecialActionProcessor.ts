// src/MainGenerator/scripts/OmikujiProcess/SpecialActionProcessor.ts
import { ActionSetType } from '@/types/OmikujiData/'
import { useAppStore } from '@main/stores/useAppStore'
import { UserNameType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { postSystemMessage } from '@shared/sdk/post/PostOneComme'
import { GameStateType } from '@/types'

export interface SpecialActionResult {
  handled: boolean // trueのとき呼び出し元でイベント処理を終了する
  isCountEvent: boolean // カウントを行うか
  countEvent?: number // カウントする回数
}

/**
 * type === 'special' のアクションアイテムを処理するクラス
 */
export class SpecialActionProcessor {
  private readonly store = useAppStore()

  process(actionItem: ActionSetType): SpecialActionResult | null {
    if (actionItem.type !== 'special') return null

    const { type, isCountEvent, countEvent, log } = actionItem.behavior
    const { targetKey, logFormat, logLimit } = log

    switch (type) {
      // 処理を終了する
      case 'return':
        return { handled: true, isCountEvent, countEvent }

      // 次のイベントへ進む
      case 'continue':
        return { handled: false, isCountEvent, countEvent }

      /**
       * reset
       * isCountEvent はfalseとする
       */
      // おみくじ回数をリセットする
      case 'resetOmikuji': {
        this.store.userSession.visits.resetEvent(actionItem.key)
        postSystemMessage(`${actionItem.name}のおみくじ回数をリセットしました`, { username: '__INFO__' })
        return { handled: true, isCountEvent: false }
      }

      /**
       * log ログ出力系
       * isCountEvent はfalseとする
       */
      case 'logUserState': {
        const logs = this.store.scriptManager.getGameState(targetKey)?.logs
        if (!logs) return { handled: true, isCountEvent }

        const message = this.formatLogs(logs, logFormat, logLimit)
        postSystemMessage(message, { username: '__INFO__', speech: false })
        return { handled: true, isCountEvent: false }
      }

      case 'logOmikuji': {
        const { totalVisits, uniqueUsers, averageVisitsPerUser } = this.store.userSession.visits.getStatistics(
          actionItem.key
        )
        const message = `${actionItem.name}/ 実行総数:${totalVisits}回 ユーザー数:${uniqueUsers}人 1人あたり平均:${averageVisitsPerUser}回`
        postSystemMessage(message, { username: '__INFO__', speech: false })
        return { handled: true, isCountEvent: false }
      }

      case 'logGame': {
        const logs = this.store.scriptManager.getGameState(targetKey)?.logs
        if (!logs) return { handled: true, isCountEvent: false }

        const message = this.formatLogs(logs, logFormat, logLimit)
        postSystemMessage(message, { username: '__INFO__', speech: false })
        return { handled: true, isCountEvent: false }
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
        return { handled: true, isCountEvent: false }
      }

      default:
        return { handled: false, isCountEvent, countEvent }
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

  private resolveUserName(userId: string): UserNameType | null {
    const hogg = this.store.userSession.stats.get(userId)
    return hogg ?? null
  }
  private formatDate(timestamp: number): string {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }
}
