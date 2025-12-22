// src/MainGenerator/script/omikujiProcess/CooldownManager.ts

/**
 * おみくじのクールダウンと連投制限を管理するクラス
 * 時間ベースの制御に特化
 */
export class CooldownManager {
  private static instance: CooldownManager | null = null
  private lastProcessedTime = 0
  private readonly lastUserRuleKeys: string[] = []
  private readonly sessionId: string

  private constructor() {
    this.sessionId = this.generateSessionId()
  }

  // シングルトンパターン
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
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    return `session_${timestamp}_${randomSuffix}`
  }

  getSessionId(): string {
    return this.sessionId
  }

  /**
   * セッションをリセット（新しい配信開始時などに使用）
   */
  resetSession(): void {
    this.lastProcessedTime = 0
    this.lastUserRuleKeys.length = 0 // 配列をクリア（参照は維持）
  }

  /**
   * プロセス全体のクールダウンチェック
   * @param cooldownSeconds クールダウン秒数（0以下の場合は制限なし）
   * @returns クールダウン中ならtrue
   */
  isCooldownBlocked(cooldownSeconds: number = 3): boolean {
    if (cooldownSeconds <= 0) return false

    const elapsedSeconds = (Date.now() - this.lastProcessedTime) / 1000
    return elapsedSeconds < cooldownSeconds
  }

  /**
   * 残りクールダウン時間を取得（秒）
   */
  getRemainingCooldown(cooldownSeconds: number = 3): number {
    if (cooldownSeconds <= 0) return 0

    const elapsedSeconds = (Date.now() - this.lastProcessedTime) / 1000
    const remaining = cooldownSeconds - elapsedSeconds
    return Math.max(0, remaining)
  }

  /**
   * 最後の処理時刻を現在時刻に更新
   */
  updateLastProcessedTime(): void {
    this.lastProcessedTime = Date.now()
  }

  /**
   * 最後の処理時刻を取得
   */
  getLastProcessedTime(): number {
    return this.lastProcessedTime
  }

  /**
   * 最後の処理からの経過時間を取得（秒）
   */
  getElapsedSeconds(): number {
    return (Date.now() - this.lastProcessedTime) / 1000
  }

  /**
   * 連投チェック（同じユーザーが同じルールで連続で抽選することを防ぐ）
   * @param userId ユーザーID
   * @param ruleId ルールID
   * @param blockCount 直近何回をチェックするか（0以下の場合は制限なし）
   * @returns 連投制限に引っかかる場合true
   */
  isRepeatBlocked(userId: string, ruleId: string, blockCount: number = 0): boolean {
    if (blockCount <= 0) return false

    const key = this.createKey(userId, ruleId)
    const checkRange = Math.min(blockCount, this.lastUserRuleKeys.length)

    // 直近blockCount回の履歴に同じキーが含まれているかチェック
    for (let i = 0; i < checkRange; i++) {
      if (this.lastUserRuleKeys[i] === key) {
        return true
      }
    }

    return false
  }

  /**
   * 同一ユーザー・ルールが最後に現れた位置を取得
   * @returns 見つからない場合は-1
   */
  getLastOccurrenceIndex(userId: string, ruleId: string): number {
    const key = this.createKey(userId, ruleId)
    return this.lastUserRuleKeys.indexOf(key)
  }

  /**
   * ユーザー・ルールの組み合わせを履歴に追加
   * recordVisitと連動して呼び出すことを想定
   */
  recordUserRuleHistory(userId: string, ruleId: string): void {
    const key = this.createKey(userId, ruleId)

    // 配列の先頭に追加（最新の履歴が常に先頭）
    this.lastUserRuleKeys.unshift(key)

    // 履歴が長くなりすぎないよう制限（最大100件）
    if (this.lastUserRuleKeys.length > 100) {
      this.lastUserRuleKeys.pop()
    }
  }

  /**
   * 履歴配列を取得（デバッグ用）
   */
  getHistoryKeys(): readonly string[] {
    return [...this.lastUserRuleKeys]
  }

  /**
   * 履歴の件数を取得
   */
  getHistoryCount(): number {
    return this.lastUserRuleKeys.length
  }

  /**
   * 履歴をクリア
   */
  clearHistory(): void {
    this.lastUserRuleKeys.length = 0
  }

  /**
   * 指定ルールの履歴をクリア
   */
  clearHistoryByRuleId(ruleId: string): void {
    for (let i = this.lastUserRuleKeys.length - 1; i >= 0; i--) {
      if (this.lastUserRuleKeys[i].endsWith(`:${ruleId}`)) {
        this.lastUserRuleKeys.splice(i, 1)
      }
    }
  }

  /**
   * userId:ruleIdの複合キーを作成
   */
  private createKey(userId: string, ruleId: string): string {
    return `${userId}:${ruleId}`
  }
}
