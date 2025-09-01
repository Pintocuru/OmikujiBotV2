// src/MainGenerator/script/omikujiProcess/CooldownManager.ts

/**
 * ユーザーの抽選回数を管理するインターフェース
 */
interface UserDrawCount {
  userId: string // ユーザーID
  ruleId: string // ルールID（おみくじの種類など）
  draws: number // 抽選回数
  lastDrawTime: number // 最後の抽選時刻（UNIX timestamp）
  lastBotMessages: string // 最後のBOTの返答コメント
}

/**
 * おみくじのクールダウンと抽選制限を管理するクラス
 */
export class CooldownManager {
  private static instance: CooldownManager
  private lastProcessedTime: number = 0 // 最後に処理された時刻
  private lastUserId: string = '' // 最後に抽選したユーザーID（連投チェック用）
  // ユーザーごとの抽選記録 - キー: "userId:ruleId", 値: UserDrawCount
  private userDrawCounts: Record<string, UserDrawCount> = {}
  private sessionId: string // 配信セッションの一意ID

  // コンストラクタをprivateにして、外部からnewできないようにする
  private constructor() {
    this.sessionId = this.generateSessionId()
  }

  // 唯一のインスタンスを取得する静的メソッド
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

  /**
   * 現在のセッションIDを取得
   */
  getSessionId(): string {
    return this.sessionId
  }

  /**
   * セッションIDをリセット（新しい配信開始時などに使用）
   */
  resetSession(): void {
    this.sessionId = this.generateSessionId()
    this.resetAllDrawCounts()
    this.lastProcessedTime = 0
    this.lastUserId = ''
  }

  /**
   * プロセス全体のクールダウンチェック
   * @param cooldownSeconds クールダウン秒数（デフォルト3秒）
   * @returns クールダウン中ならtrue
   */
  isCooldownBlocked(cooldownSeconds: number = 3): boolean {
    const currentTime = Date.now()
    if (cooldownSeconds <= 0) return false // 0以下なら無効
    return (currentTime - this.lastProcessedTime) / 1000 < cooldownSeconds
  }

  /**
   * 最後の処理時刻を更新
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
   * 連投チェック（同じユーザーが連続で抽選することを防ぐ）
   */
  isRepeatBlocked(userId: string, isRepeatAllowed: boolean = true): boolean {
    // 連投が許可されている場合はブロックしない
    if (isRepeatAllowed) return false

    // 前回と同じユーザーの場合はブロックする
    return this.lastUserId === userId
  }

  /**
   * ユーザーIDを更新し、抽選回数をインクリメント
   */
  updateUserId(userId: string, ruleId: string, lastBotMessages: string): void {
    this.lastUserId = userId
    this.incrementUserDrawCount(userId, ruleId, lastBotMessages)
  }

  /**
   * ユーザーIDを更新し、抽選回数をインクリメント
   */
  getLastBotMessages(userId: string, ruleId: string): string {
    const key = `${userId}:${ruleId}`
    const record = this.userDrawCounts[key]
    return record ? record.lastBotMessages : 'error'
  }

  /**
   * 指定ユーザー・ルールの抽選回数を1増やす
   */
  private incrementUserDrawCount(userId: string, ruleId: string, lastBotMessages: string): void {
    const currentTime = Date.now()
    const key = `${userId}:${ruleId}` // 複合キーを生成

    const existingRecord = this.userDrawCounts[key]

    if (existingRecord) {
      // 既存記録があれば回数を増やして時刻を更新
      existingRecord.draws++
      existingRecord.lastDrawTime = currentTime
    } else {
      // 新規記録を追加
      this.userDrawCounts[key] = {
        userId,
        ruleId,
        draws: 1,
        lastDrawTime: currentTime,
        lastBotMessages,
      }
    }
  }

  /**
   * 指定ユーザー・ルールの抽選回数を取得
   */
  getUserDrawCount(userId: string, ruleId: string): number {
    const key = `${userId}:${ruleId}`
    const record = this.userDrawCounts[key]
    return record ? record.draws : 0
  }

  /**
   * 抽選回数制限チェック
   */
  isDrawLimitExceeded(userId: string, ruleId: string, drawLimit: number): boolean {
    // 制限が0以下の場合は制限なし
    if (drawLimit <= 0) return false

    const currentCount = this.getUserDrawCount(userId, ruleId)
    return currentCount >= drawLimit
  }

  /**
   * 全抽選記録をruleId別にグループ化して取得
   */
  getDrawCountsStatus(): Record<string, UserDrawCount[]> {
    const result: Record<string, UserDrawCount[]> = {}

    // 各記録をruleId別に分類
    Object.values(this.userDrawCounts).forEach((record) => {
      if (!result[record.ruleId]) {
        result[record.ruleId] = []
      }
      result[record.ruleId].push(record)
    })

    return result
  }

  /**
   * 指定ルールの抽選記録一覧を取得
   */
  getDrawCountsStatusByRuleId(ruleId: string): UserDrawCount[] {
    return Object.values(this.userDrawCounts).filter((record) => record.ruleId === ruleId)
  }

  /**
   * 指定ルールの総抽選回数を取得
   */
  getTotalDrawsByRuleId(ruleId: string): number {
    return Object.values(this.userDrawCounts)
      .filter((record) => record.ruleId === ruleId)
      .reduce((total, record) => total + record.draws, 0)
  }

  /**
   * 指定ユーザー・ルールの記録を削除
   */
  resetUserDrawCount(userId: string, ruleId: string): void {
    const key = `${userId}:${ruleId}`
    delete this.userDrawCounts[key]
  }

  /**
   * 全ての抽選記録をクリア
   */
  resetAllDrawCounts(): void {
    this.userDrawCounts = {}
  }
}
