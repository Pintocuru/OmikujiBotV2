// src/MainGenerator/script/omikujiProcess/CooldownManager.ts

/**
 * ユーザーの抽選回数を管理するインターフェース
 */
export interface UserDrawCount {
  readonly userId: string
  readonly name: string
  readonly ruleId: string
  draws: number
  lastDrawTime: number
  lastBotMessages: string
}

/**
 * おみくじのクールダウンと抽選制限を管理するクラス
 */
export class CooldownManager {
  private static instance: CooldownManager | null = null
  private lastProcessedTime = 0
  private readonly userDrawCounts = new Map<string, UserDrawCount>()
  private readonly sessionId: string
  private lastUserRuleKeys: string[] = [] // string[] に変更

  private constructor() {
    this.sessionId = this.generateSessionId()
  }

  // シングルトンモード
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
    this.userDrawCounts.clear()
    this.lastProcessedTime = 0
    this.lastUserRuleKeys = [] // 配列もクリア
  }

  /**
   * プロセス全体のクールダウンチェック
   */
  isCooldownBlocked(cooldownSeconds: number = 3): boolean {
    if (cooldownSeconds <= 0) return false

    const elapsedSeconds = (Date.now() - this.lastProcessedTime) / 1000
    return elapsedSeconds < cooldownSeconds
  }

  updateLastProcessedTime(): void {
    this.lastProcessedTime = Date.now()
  }

  getLastProcessedTime(): number {
    return this.lastProcessedTime
  }

  /**
   * 連投チェック（同じユーザーが同じルールで連続で抽選することを防ぐ）
   * @param userId - ユーザーID
   * @param ruleId - ルールID
   * @param isRepeatAllowed - 連投を許可するか
   * @param blockCount - 直近何回の履歴をチェックするか（デフォルト: 1）
   * @returns ブロックする場合はtrue
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
   * ユーザーIDを更新し、抽選回数をインクリメント
   */
  updateUserId(userId: string, ruleId: string, name: string, lastBotMessages: string): void {
    const key = this.createKey(userId, ruleId)

    // 配列の先頭に追加（最新の履歴が常に先頭）
    this.lastUserRuleKeys.unshift(key)

    // 履歴が長くなりすぎないよう制限（例: 最大100件）
    if (this.lastUserRuleKeys.length > 100) {
      this.lastUserRuleKeys.pop()
    }

    this.incrementUserDrawCount(userId, ruleId, name, lastBotMessages)
  }

  /**
   * 最後のBotメッセージを取得
   */
  getLastBotMessages(userId: string, ruleId: string): string {
    const record = this.userDrawCounts.get(this.createKey(userId, ruleId))
    return record?.lastBotMessages ?? 'error'
  }

  /**
   * 指定ユーザー・ルールの抽選回数を1増やす
   */
  private incrementUserDrawCount(userId: string, ruleId: string, name: string, lastBotMessages: string): void {
    const key = this.createKey(userId, ruleId)
    const existingRecord = this.userDrawCounts.get(key)
    const currentTime = Date.now()

    if (existingRecord) {
      existingRecord.draws++
      existingRecord.lastDrawTime = currentTime
      existingRecord.lastBotMessages = lastBotMessages
    } else {
      this.userDrawCounts.set(key, {
        userId,
        ruleId,
        name,
        draws: 1,
        lastDrawTime: currentTime,
        lastBotMessages,
      })
    }
  }

  /**
   * 指定ユーザー・ルールの抽選回数を取得
   */
  getUserDrawCount(userId: string, ruleId: string): number {
    const record = this.userDrawCounts.get(this.createKey(userId, ruleId))
    return record?.draws ?? 0
  }

  /**
   * 抽選回数制限チェック
   */
  isDrawLimitExceeded(userId: string, ruleId: string, drawLimit: number): boolean {
    if (drawLimit <= 0) return false
    return this.getUserDrawCount(userId, ruleId) >= drawLimit
  }

  /**
   * 全抽選記録をruleId別にグループ化して取得
   */
  getDrawCountsStatus(): Record<string, UserDrawCount[]> {
    const result: Record<string, UserDrawCount[]> = {}

    for (const record of this.userDrawCounts.values()) {
      if (!result[record.ruleId]) {
        result[record.ruleId] = []
      }
      result[record.ruleId].push(record)
    }

    return result
  }

  /**
   * 指定ルールの抽選記録一覧を取得
   */
  getDrawCountsStatusByRuleId(ruleId: string): UserDrawCount[] {
    return Array.from(this.userDrawCounts.values()).filter((record) => record.ruleId === ruleId)
  }

  /**
   * 指定ルールの総抽選回数を取得
   */
  getTotalDrawsByRuleId(ruleId: string): number {
    return Array.from(this.userDrawCounts.values())
      .filter((record) => record.ruleId === ruleId)
      .reduce((total, record) => total + record.draws, 0)
  }

  /**
   * 指定ルールの最後のユーザーを取得
   */
  getLatestUserRuleId(ruleId: string): UserDrawCount | null {
    const record = Array.from(this.userDrawCounts.values())
      .filter((r) => r.ruleId === ruleId)
      .sort((a, b) => b.lastDrawTime - a.lastDrawTime)[0]

    return record ?? null
  }

  /**
   * 指定ユーザー・ルールの記録を削除
   */
  resetUserDrawCount(userId: string, ruleId: string): void {
    this.userDrawCounts.delete(this.createKey(userId, ruleId))
  }

  /**
   * 全ての抽選記録をクリア
   */
  resetAllDrawCounts(): void {
    this.userDrawCounts.clear()
  }

  /**
   * 履歴配列を取得（デバッグ用）
   */
  getHistoryKeys(): string[] {
    return [...this.lastUserRuleKeys]
  }

  /**
   * userId:ruleIdの複合キーを作成
   */
  private createKey(userId: string, ruleId: string): string {
    return `${userId}:${ruleId}`
  }
}
