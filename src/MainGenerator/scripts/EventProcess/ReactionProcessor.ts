// src/MainGenerator/scripts/EventProcess/ReactionProcessor.ts
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { GetReactions } from '@shared/sdk/subscribe/GetReactions'
import { OmikujiProcessor } from '../OmikujiProcess/OmikujiProcessor'
import { evaluateReactionTrigger } from '@/MainGenerator/scripts/EventProcess/ReactionTriggerEvaluator'

/** 10秒間リアクションがなければレベルを1下げる */
const BURST_DECAY_MS = 10_000

export class EventReactionProcessor {
  private store = useAppStore()
  private readonly omikujiProcessor = new OmikujiProcessor()

  private decayTimer: ReturnType<typeof setTimeout> | null = null

  startReactions(): void {
    this.stopReactions()

    GetReactions((aggregated) => {
      this.store.reactionStats.record(aggregated)
      this.evaluateReactionRules()
      this._restartDecayTimer()
    }).then((ok) => {
      if (!ok) console.error('Reaction購読失敗')
    })
  }

  stopReactions(): void {
    this._clearDecayTimer()
    this.store.reactionStats.reset()
  }

  private evaluateReactionRules(): void {
    const enabledEvents = Object.values(this.store.data.reactions)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    for (const event of enabledEvents) {
      if (evaluateReactionTrigger(event.trigger, this.store.reactionStats)) {
        const messages = this.omikujiProcessor.executeOmikuji(event.omikuji)
        this.store.scheduleBotMessages(messages)
      }
    }
  }

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

  private _clearDecayTimer(): void {
    if (this.decayTimer !== null) {
      clearTimeout(this.decayTimer)
      this.decayTimer = null
    }
  }
}
