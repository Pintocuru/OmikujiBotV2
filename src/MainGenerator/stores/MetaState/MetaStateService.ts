// src/MainGenerator/stores/MetaState/MetaStateService.ts
import { GetMetas } from '@shared/sdk/subscribe/GetMetas'
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'

export interface MetaStateServiceType {
  subscribe(fn: (meta: MetaUpdateEvent) => void): () => void
  subscribeError(fn: (error: unknown) => void): () => void
  getStatus(): MetaServiceStatus
  getLastError(): unknown
  getCurrent(): NormalizedMeta | null
  getPeak(): { upVote: number; viewer: number }
}

export class MetaStateService implements MetaStateServiceType {
  private current: NormalizedMeta | null = null
  private previous: NormalizedMeta | null = null
  private peak = { upVote: 0, viewer: 0 }
  private subscribers: Array<(meta: MetaUpdateEvent) => void> = []
  private static instance: MetaStateService | null = null
  private lastError: unknown | null = null
  private status: 'idle' | 'loading' | 'ready' | 'error' = 'idle'

  static getInstance() {
    if (!this.instance) this.instance = new MetaStateService()
    return this.instance
  }

  private constructor() {
    this.initialize()
  }

  private async initialize() {
    this.setStatus('loading')

    const metas = GetMetas.getInstance()
    const result = await metas.fetchMeta((raw) => {
      try {
        this.handleMeta(raw)
        // 初回データ受信時に ready へ
        if (this.status === 'loading') this.setStatus('ready')
      } catch (e) {
        this.notifyError(e)
      }
    })

    if (!result?.ok) {
      postSystemMessage(`❌ Meta取得失敗`, { speech: false, throttle: true })
      this.notifyError(new Error('Meta initialization failed'))
    }
  }

  private setStatus(next: MetaServiceStatus) {
    this.status = next
  }

  private handleMeta(rawServiceMeta: ServiceMeta | null) {
    const normalized = this.normalize(rawServiceMeta)

    this.previous = this.current
    this.current = normalized

    const peakChanged = this.updatePeak(normalized)
    this.notifySubscribers(peakChanged)
  }

  private normalize(meta: ServiceMeta | null): NormalizedMeta {
    return {
      isLive: meta?.isLive ?? false,
      upVote: this.toNumber(meta?.upVote),
      viewer: this.toNumber(meta?.viewer),
      follower: this.toNumber(meta?.subscriberCount ?? meta?.follower),
      startTime: meta?.startTime ?? null,
    }
  }

  /**
   * peak を更新し、peakChanged フラグを返す
   */
  private updatePeak(meta: NormalizedMeta) {
    const peakChanged = {
      upVote: meta.upVote > this.peak.upVote,
      viewer: meta.viewer > this.peak.viewer,
    }

    // peak を更新
    if (peakChanged.upVote) this.peak.upVote = meta.upVote
    if (peakChanged.viewer) this.peak.viewer = meta.viewer

    return peakChanged
  }

  /**
   * peakChanged を受け取る
   */
  private notifySubscribers(peakChanged: { upVote: boolean; viewer: boolean }) {
    if (!this.current) return

    const event: MetaUpdateEvent = {
      current: this.current,
      previous: this.previous,
      peak: this.peak,
      peakChanged,
    }

    for (const fn of this.subscribers) {
      try {
        fn(event)
      } catch (e) {
        console.error('Meta subscriber error', e)
      }
    }
  }

  subscribe(fn: (meta: MetaUpdateEvent) => void): () => void {
    this.subscribers.push(fn)

    return () => {
      this.subscribers = this.subscribers.filter((f) => f !== fn)
    }
  }

  private toNumber(value: unknown) {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
  }

  private errorSubscribers: Array<(error: unknown) => void> = []

  private notifyError(error: unknown) {
    this.lastError = error
    this.setStatus('error')

    console.error('[MetaStateService]', error)

    for (const fn of this.errorSubscribers) {
      try {
        fn(error)
      } catch {}
    }
  }

  subscribeError(fn: (error: unknown) => void) {
    this.errorSubscribers.push(fn)
    return () => {
      this.errorSubscribers = this.errorSubscribers.filter((f) => f !== fn)
    }
  }

  getStatus(): MetaServiceStatus {
    return this.status
  }

  getLastError(): unknown {
    return this.lastError
  }

  getCurrent(): NormalizedMeta | null {
    return this.current
  }

  getPeak() {
    return { ...this.peak }
  }
}

export type MetaServiceStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface NormalizedMeta {
  isLive: boolean
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
  peakChanged: {
    upVote: boolean
    viewer: boolean
  }
}
