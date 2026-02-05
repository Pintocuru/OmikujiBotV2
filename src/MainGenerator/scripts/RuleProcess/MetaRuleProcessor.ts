// src\MainGenerator\scripts\RuleProcess\MetaRuleProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { useAppStore } from '@main/stores/useAppStore'
import { MetaUpdateEvent } from '../MetaState/MetaStateService'
import { evaluateMetaTrigger } from '../MetaState/MetaTriggerEvaluator'
import { OmikujiProcessor } from '../OmikujiProcess/OmikujiProcessor'

/**
 * メタルールの実行を管理
 */
export class MetaRuleProcessor {
  private readonly store = useAppStore()
  private readonly omikujiProcessor = new OmikujiProcessor()
  private readonly metaState = this.store.metaState

  /**
   * メタルール監視を開始
   */
  startMetaRules(onMetaTrigger: (messages: BotMessageType[]) => void): void {
    this.metaState.subscribe((event) => {
      this.processMetaRules(event, onMetaTrigger)
    })
  }

  /**
   * メタデータ更新時の処理
   */
  private processMetaRules(event: MetaUpdateEvent, onMetaTrigger: (messages: BotMessageType[]) => void): void {
    const enabledRules = Object.values(this.store.data.metas)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    for (const rule of enabledRules) {
      if (evaluateMetaTrigger(rule.trigger, event)) {
        try {
          const messages = this.omikujiProcessor.executeOmikuji(rule.omikuji)
          onMetaTrigger(messages)
        } catch (error) {
          console.error(`Meta rule ${rule.key} execution error:`, error)
        }
      }
    }
  }
}
