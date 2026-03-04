import { BotMessageType } from '@/types/'
import { MetaRuleType } from '@/types/OmikujiData/'
import { MetaStateServiceType, MetaUpdateEvent } from '@main/stores/MetaState/MetaStateService'
import { OmikujiProcessor } from '@main/scripts/OmikujiProcess/OmikujiProcessor'
import { evaluateMetaTrigger } from '@main/stores/MetaState/MetaTriggerEvaluator'

/**
 * メタルールの実行を管理
 */
export class MetaRuleProcessor {
  private readonly omikujiProcessor = new OmikujiProcessor()
  private unsubscribe: (() => void) | null = null
  // 購読開始時点の値を記録（初回イベントのpreviousとして使用）
  private lastUpVote: number | null = null
  private lastViewer: number | null = null

  constructor(
    private readonly metas: Record<string, MetaRuleType>,
    private readonly metaState: MetaStateServiceType
  ) {}

  /**
   * メタルール監視を開始
   */
  startMetaRules(onMetaTrigger: (messages: BotMessageType[]) => void): void {
    this.stopMetaRules()

    // 購読開始時点の値をスナップショットとして保存
    const snapshot = this.metaState.getCurrent()
    this.lastUpVote = snapshot?.upVote ?? null
    this.lastViewer = snapshot?.viewer ?? null

    // 購読の開始
    this.unsubscribe = this.metaState.subscribe((event) => {
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
    this.lastUpVote = null
    this.lastViewer = null
  }

  /**
   * メタデータ更新時の処理
   */
  private processMetaRules(event: MetaUpdateEvent, onMetaTrigger: (messages: BotMessageType[]) => void): void {
    // previousがない場合（MetaStateService側で初回）は
    // スナップショット値をpreviousとして補完する
    const resolvedEvent: MetaUpdateEvent =
      event.previous === null && (this.lastUpVote !== null || this.lastViewer !== null)
        ? {
            ...event,
            previous: {
              upVote: this.lastUpVote ?? event.current.upVote,
              viewer: this.lastViewer ?? event.current.viewer,
              follower: event.current.follower,
              startTime: event.current.startTime,
            },
          }
        : event

    const enabledRules = Object.values(this.metas)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    for (const rule of enabledRules) {
      if (evaluateMetaTrigger(rule.trigger, resolvedEvent)) {
        const omikujiMessages = this.omikujiProcessor.executeOmikuji(rule.omikuji)
        onMetaTrigger(omikujiMessages)
      }
    }
  }
}
