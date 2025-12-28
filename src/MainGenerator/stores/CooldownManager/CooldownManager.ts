// src/MainGenerator/script/omikujiProcess/CooldownManager.ts

/**
 * クールダウン管理クラス
 * 時間ベースの制御に特化（連投・回数制限は扱わない）
 */
export class CooldownManager {
  private static instance: CooldownManager | null = null

  /** 最後に処理が成功した時刻（ms） */
  private lastProcessedTime = 0

  /** 配信セッション識別子 */
  private readonly sessionId: string

  private constructor() {
    this.sessionId = this.generateSessionId()
  }

  // シングルトン
  public static getInstance(): CooldownManager {
    if (!CooldownManager.instance) {
      CooldownManager.instance = new CooldownManager()
    }
    return CooldownManager.instance
  }

  /**
   * 配信セッション用の一意IDを生成
   */
  private generateSessionId(): string {
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).slice(2, 8)
    return `session_${timestamp}_${randomSuffix}`
  }

  /**
   * 現在のセッションIDを取得
   */
  getSessionId(): string {
    return this.sessionId
  }

  /**
   * セッションリセット（新しい配信開始時）
   */
  resetSession(): void {
    this.lastProcessedTime = 0
  }

  /**
   * クールダウン判定
   * @param cooldownSeconds クールダウン秒数（0以下なら制限なし）
   * @returns クールダウン中なら true
   */
  isCooldownBlocked(cooldownSeconds: number = 3): boolean {
    if (cooldownSeconds <= 0) return false
    return this.getElapsedSeconds() < cooldownSeconds
  }

  /**
   * 残りクールダウン時間（秒）
   */
  getRemainingCooldown(cooldownSeconds: number = 3): number {
    if (cooldownSeconds <= 0) return 0
    return Math.max(0, cooldownSeconds - this.getElapsedSeconds())
  }

  /**
   * 最後の処理時刻を更新（成功時に呼ぶ）
   */
  updateLastProcessedTime(): void {
    this.lastProcessedTime = Date.now()
  }

  /**
   * 最後の処理時刻（ms）
   */
  getLastProcessedTime(): number {
    return this.lastProcessedTime
  }

  /**
   * 経過時間（秒）
   */
  getElapsedSeconds(): number {
    if (this.lastProcessedTime === 0) return Infinity
    return (Date.now() - this.lastProcessedTime) / 1000
  }
}
