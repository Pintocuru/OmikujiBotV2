// src/MainGenerator/stores/CooldownManager/CooldownManager.ts
/**
 * クールダウン管理クラス
 */
export class CooldownManager {
  private static instance: CooldownManager | null = null

  /** 最後に処理が成功した時刻（ms）: グローバルクールダウン用 */
  private lastProcessedTime = 0

  /** ActionSet単位のクールダウン管理: key -> 最終実行時刻（ms） */
  private readonly actionCooldownMap = new Map<string, number>()

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
    this.actionCooldownMap.clear()
  }

  /**
   * クールダウン判定（グローバル）
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

  // ──────────────────────────────────────────
  // ActionSet 単位のクールダウン管理
  // ──────────────────────────────────────────

  /**
   * ActionSet クールダウン判定
   * @param actionKey ActionSet の key
   * @param cooldownSeconds クールダウン秒数（0以下なら制限なし）
   * @returns クールダウン中なら true
   */
  isActionCooldownBlocked(actionKey: string, cooldownSeconds: number): boolean {
    if (cooldownSeconds <= 0) return false
    const lastTime = this.actionCooldownMap.get(actionKey)
    if (lastTime === undefined) return false
    return (Date.now() - lastTime) / 1000 < cooldownSeconds
  }

  /**
   * ActionSet の最終実行時刻を記録
   * @param actionKey ActionSet の key
   */
  recordActionExecution(actionKey: string): void {
    this.actionCooldownMap.set(actionKey, Date.now())
  }
}
