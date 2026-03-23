// EventReactionProcessor.ts
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { GetReactions } from '@shared/sdk/subscribe/GetReactions'
import { OmikujiProcessor } from '../OmikujiProcess/OmikujiProcessor'
import { evaluateReactionTrigger } from '@/MainGenerator/stores/ReactionManager/ReactionTriggerEvaluator'

export class EventReactionProcessor {
  private store = useAppStore()
  private readonly omikujiProcessor = new OmikujiProcessor()

  startReactions(): void {
    this.stopReactions()

    GetReactions((aggregated, firedLabels) => {
      this.store.reactionStats.record(aggregated)
      this.evaluateReactionRules(firedLabels)
    }).then((ok) => {
      if (!ok) console.error('Reaction購読失敗')
    })
  }

  stopReactions(): void {
    this.store.reactionStats.reset()
  }

  private evaluateReactionRules(firedLabels: Set<string>) {
    const enabledEvents = Object.values(this.store.data.reactions)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    for (const event of enabledEvents) {
      if (evaluateReactionTrigger(event.trigger, this.store.reactionStats, firedLabels)) {
        const messages = this.omikujiProcessor.executeOmikuji(event.omikuji)
        this.store.scheduleBotMessages(messages)
      }
    }
  }
}
