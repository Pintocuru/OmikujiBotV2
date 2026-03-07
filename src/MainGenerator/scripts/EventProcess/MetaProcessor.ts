// src/MainGenerator/scripts/RuleProcess/MetaRuleProcessor.ts
import { MetaUpdateEvent } from '@main/stores/MetaState/MetaStateService'
import { OmikujiProcessor } from '@main/scripts/OmikujiProcess/OmikujiProcessor'
import { evaluateMetaTrigger } from '@main/stores/MetaState/MetaTriggerEvaluator'
import { useAppStore } from '@main/stores/useAppStore'

/**
 * メタイベントの実行を管理
 */
export class EventMetaProcessor {
  private readonly omikujiProcessor = new OmikujiProcessor()
  private unsubscribe: (() => void) | null = null
  // 購読開始時点の値を記録（初回イベントのpreviousとして使用）
  private lastUpVote: number | null = null
  private lastViewer: number | null = null

  /**
   * メタイベント監視を開始
   */
  startMetaRules(): void {
    this.stopMetaRules()

    const appStore = useAppStore()

    // 購読開始時点の値をスナップショットとして保存
    const snapshot = appStore.metaState.getCurrent()
    this.lastUpVote = snapshot?.upVote ?? null
    this.lastViewer = snapshot?.viewer ?? null

    // 購読の開始
    this.unsubscribe = appStore.metaState.subscribe((event) => {
      this.processMetaRules(event)
    })
  }

  /**
   * メタイベント監視を停止
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
  private processMetaRules(event: MetaUpdateEvent): void {
    const appStore = useAppStore()

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

    const enabledRules = Object.values(appStore.data.metas)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    for (const rule of enabledRules) {
      if (evaluateMetaTrigger(rule.trigger, resolvedEvent)) {
        const omikujiMessages = this.omikujiProcessor.executeOmikuji(rule.omikuji)
        appStore.scheduleBotMessages(omikujiMessages)
      }
    }
  }
}
