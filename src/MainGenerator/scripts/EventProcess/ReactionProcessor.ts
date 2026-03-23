// src/MainGenerator/scripts/EventProcess/MetaProcessor.ts
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { GetReactions } from '@shared/sdk/subscribe/GetReactions'
import { OmikujiProcessor } from '../OmikujiProcess/OmikujiProcessor'
import { evaluateReactionTrigger } from '@/MainGenerator/stores/ReactionManager/ReactionTriggerEvaluator'

export class EventReactionProcessor {
  private store = useAppStore()
  private readonly omikujiProcessor = new OmikujiProcessor()
  private unsubscribe: (() => void) | null = null

  /**
   * イベント監視を開始
   */
  startReactions(): void {
    this.stopReactions()

    GetReactions((payload) => {
      this.store.reactionStats.record(payload)
      this.evaluateReactionRules()
    }).then((ok) => {
      if (!ok) console.error('Reaction購読失敗')
    })
  }

  /**
   * イベント監視を停止
   */
  stopReactions(): void {
    this.unsubscribe?.()
    this.unsubscribe = null
    this.store.reactionStats.reset()
  }

  private evaluateReactionRules() {
    const enabledRules = Object.values(this.store.data.reactions)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    for (const rule of enabledRules) {
      if (evaluateReactionTrigger(rule.trigger, this.store.reactionStats)) {
        const messages = this.omikujiProcessor.executeOmikuji(rule.omikuji)
        this.store.scheduleBotMessages(messages)
      }
    }
  }
}
