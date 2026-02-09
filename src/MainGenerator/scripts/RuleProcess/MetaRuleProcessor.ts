// src\MainGenerator\scripts\RuleProcess\MetaRuleProcessor.ts
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiDataType } from '@/types/OmikujiData/'
import { useAppStore } from '@main/stores/useAppStore'
import { MetaUpdateEvent } from '../MetaState/MetaStateService'
import { evaluateMetaTrigger } from '../MetaState/MetaTriggerEvaluator'
import { OmikujiProcessor } from '../OmikujiProcess/OmikujiProcessor'

/**
 * メタルールの実行を管理
 *
 * このクラスはコンストラクタで受け取ったデータに基づいてメタルールを監視します。
 * MetaStateServiceはシングルトンなので、storeから取得する必要があります。
 */
export class MetaRuleProcessor {
  private readonly omikujiProcessor = new OmikujiProcessor()
  private readonly data: OmikujiDataType
  private unsubscribe: (() => void) | null = null

  constructor(data: OmikujiDataType) {
    this.data = data
  }

  /**
   * メタルール監視を開始
   */
  startMetaRules(onMetaTrigger: (messages: BotMessageType[]) => void): void {
    const appStore = useAppStore()
    const metaState = appStore.metaState

    this.stopMetaRules()

    const handler = (event: MetaUpdateEvent) => {
      this.processMetaRules(event, onMetaTrigger)
    }

    metaState.subscribe(handler)

    this.unsubscribe = metaState.subscribe((event) => {
      this.processMetaRules(event, onMetaTrigger)
    })
  }

  /**
   * メタルール監視を停止
   */
  stopMetaRules(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  /**
   * メタデータ更新時の処理
   */
  private processMetaRules(event: MetaUpdateEvent, onMetaTrigger: (messages: BotMessageType[]) => void): void {
    const enabledRules = Object.values(this.data.metas)
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
