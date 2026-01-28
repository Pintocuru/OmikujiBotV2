// src\MainGenerator\scripts\MetaState\MetaStateService.ts
import { createGetMetas } from '@shared/sdk/subscribe/GetMetas'
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service'

export class MetaStateService {
  private current: NormalizedMeta | null = null
  private previous: NormalizedMeta | null = null
  private peak = { upVote: 0, viewer: 0 }
  private subscribers: Array<(meta: MetaUpdateEvent) => void> = []

  constructor() {
    this.initialize()
  }

  private initialize() {
    createGetMetas().fetchMeta((raw) => {
      const normalized = this.normalize(raw)

      this.previous = this.current
      this.current = normalized

      this.updatePeak(normalized)
      this.notifySubscribers()
    })
  }

  private normalize(meta: ServiceMeta | null): NormalizedMeta {
    return {
      upVote: Number(meta?.upVote ?? 0),
      viewer: Number(meta?.viewer ?? 0),
      follower: Number(meta?.follower ?? 0),
      startTime: meta?.startTime ?? null,
    }
  }

  private updatePeak(meta: NormalizedMeta) {
    if (meta.upVote > this.peak.upVote) this.peak.upVote = meta.upVote
    if (meta.viewer > this.peak.viewer) this.peak.viewer = meta.viewer
  }

  private notifySubscribers() {
    if (!this.current) return

    const event: MetaUpdateEvent = {
      current: this.current,
      previous: this.previous,
      peak: this.peak,
    }

    for (const fn of this.subscribers) fn(event)
  }

  subscribe(fn: (meta: MetaUpdateEvent) => void) {
    this.subscribers.push(fn)
  }
}

/**
 * 型定義(あとで切り分ける)
 */
export interface NormalizedMeta {
  upVote: number
  viewer: number
  follower: number
  startTime: number | null
}

export interface MetaUpdateEvent {
  current: NormalizedMeta
  previous: NormalizedMeta | null
  peak: {
    upVote: number
    viewer: number
  }
}
