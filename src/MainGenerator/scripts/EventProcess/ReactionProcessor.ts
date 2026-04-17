// src/MainGenerator/scripts/EventProcess/ReactionProcessor.ts
import { useAppStore } from '@main/stores/useAppStore'
import { GetReactions } from '@shared/sdk/subscribe/GetReactions'
import { OmikujiProcessor } from '../OmikujiProcess/OmikujiProcessor'
import { evaluateReactionTrigger } from '@main/scripts/EventProcess/ReactionTriggerEvaluator'

/** 10秒間リアクションがなければバーストレベルを1下げる */
const BURST_DECAY_MS = 10_000

export class EventReactionProcessor {
  private store = useAppStore()
  private readonly omikujiProcessor = new OmikujiProcessor()

  /** デケイタイマーのID。null = 未起動 */
  private decayTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * リアクション購読を開始する。
   * 既存の購読があれば先に停止してからリスタートする。
   */
  startReactions(): void {
    this.stopReactions()

    GetReactions((aggregated) => {
      // リアクション集計を記録し、ルール評価とデケイタイマーをリセット
      this.store.reactionStats.record(aggregated)
      this.evaluateReactionRules()
      this._restartDecayTimer()
    }).then((ok) => {
      if (!ok) console.error('Reaction購読失敗')
    })
  }

  /**
   * リアクション購読を停止し、統計をリセットする。
   */
  stopReactions(): void {
    this._clearDecayTimer()
    this.store.reactionStats.reset()
  }

  /**
   * 有効なリアクションルールをorder順に評価し、
   * トリガー条件を満たしたルールのおみくじを実行してBotMessageをスケジュールする。
   */
  private async evaluateReactionRules(): Promise<void> {
    const enabledEvents = Object.values(this.store.data.reactions)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    for (const event of enabledEvents) {
      if (evaluateReactionTrigger(event.trigger, this.store.reactionStats)) {
        const messages = await this.omikujiProcessor.executeOmikuji(event.key, event.omikuji, 'reactions')
        this.store.scheduleBotMessages(messages)
      }
    }
  }

  /**
   * デケイタイマーをリセットして再起動する。
   * バーストレベルが0の場合は起動しない。
   * タイムアウト後にレベルを1下げ、まだ残っていれば再帰的に再起動する。
   */
  private _restartDecayTimer(): void {
    this._clearDecayTimer()

    if (this.store.reactionStats.getBurstState().level === 0) return

    this.decayTimer = setTimeout(() => {
      const newLevel = this.store.reactionStats.decrementBurstLevel()
      if (newLevel > 0) {
        this._restartDecayTimer()
      } else {
        this.decayTimer = null
      }
    }, BURST_DECAY_MS)
  }

  /**
   * デケイタイマーが起動中であればキャンセルする。
   */
  private _clearDecayTimer(): void {
    if (this.decayTimer !== null) {
      clearTimeout(this.decayTimer)
      this.decayTimer = null
    }
  }
}
