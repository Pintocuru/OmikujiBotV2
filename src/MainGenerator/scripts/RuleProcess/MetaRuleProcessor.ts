// src\MainGenerator\scripts\RuleProcess\MetaRuleProcessor.ts
import { BotMessageType } from '@/types/'
import { OmikujiDataType } from '@/types/OmikujiData/'
import { MetaUpdateEvent } from '@main/stores/MetaState/MetaStateService'
import { OmikujiProcessor } from '@main/scripts/OmikujiProcess/OmikujiProcessor'
import { useAppStore } from '@main/stores/useAppStore'
import { evaluateMetaTrigger } from '@/MainGenerator/stores/MetaState/MetaTriggerEvaluator'

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
  private lastUpVote: number | null = null
  private lastViewer: number | null = null

  constructor(data: OmikujiDataType) {
    this.data = data
  }

  /**
   * メタルール監視を開始
   */
  startMetaRules(onMetaTrigger: (messages: BotMessageType[]) => void): void {
    const { metaState } = useAppStore()

    this.stopMetaRules()

    // 購読の開始
    this.unsubscribe = metaState.subscribe((event) => {
      this.processMetaRules(event, onMetaTrigger)
    })

    // ??
    const current = metaState.getCurrent()
    if (current) {
      this.processMetaRules(
        {
          current,
          previous: null,
          peak: metaState.getPeak(),
          peakChanged: {
            upVote: false,
            viewer: false,
          },
        },
        onMetaTrigger
      )
    }
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
        onMetaTrigger(this.omikujiProcessor.executeOmikuji(rule.omikuji))
      }
    }
  }
}
