// src/MainGenerator/scripts/EventProcess/ServiceProcessor.ts
import { evaluateServiceTrigger } from './ServiceTriggerEvaluator'
import { MetaUpdateEvent } from '@main/stores/MetaState/MetaStateService'
import { OmikujiProcessor } from '@main/scripts/OmikujiProcess/OmikujiProcessor'
import { useAppStore } from '@main/stores/useAppStore'
import { addSourceCategory } from './AddSourceHelper'

/**
 * 配信数値イベントの実行を管理
 */
export class EventServiceProcessor {
  private store = useAppStore()
  private readonly omikujiProcessor = new OmikujiProcessor()
  private unsubscribe: (() => void) | null = null
  // 購読開始時点の値を記録（初回イベントのpreviousとして使用）
  private lastUpVote: number | null = null
  private lastViewer: number | null = null

  /**
   * イベント監視を開始
   */
  startServices(): void {
    this.stopServices()

    // 購読開始時点の値をスナップショットとして保存
    const snapshot = this.store.serviceMetaStore.getCurrent()
    this.lastUpVote = snapshot?.upVote ?? null
    this.lastViewer = snapshot?.viewer ?? null

    // 購読の開始
    this.unsubscribe = this.store.serviceMetaStore.subscribe((event) => {
      this.processMetaRules(event)
    })
  }

  /**
   * イベント監視を停止
   */
  stopServices(): void {
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
  private async processMetaRules(event: MetaUpdateEvent): Promise<void> {
    const resolvedEvent: MetaUpdateEvent =
      event.previous === null && (this.lastUpVote !== null || this.lastViewer !== null)
        ? {
            ...event,
            previous: {
              isLive: event.current.isLive,
              upVote: this.lastUpVote ?? event.current.upVote,
              viewer: this.lastViewer ?? event.current.viewer,
              follower: event.current.follower,
              startTime: event.current.startTime,
            },
          }
        : event

    const enabledRules = Object.values(this.store.data.metas)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    for (const rule of enabledRules) {
      if (evaluateServiceTrigger(rule.trigger, resolvedEvent)) {
        const messages = await this.omikujiProcessor.executeOmikuji(rule.omikuji)
        const enriched = addSourceCategory(messages, 'metas')
        this.store.scheduleBotMessages(enriched)
      }
    }
  }
}
