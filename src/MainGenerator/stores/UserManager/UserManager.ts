// src/MainGenerator/stores/UserManager/UserManager.ts
import { UserStatsManager } from './UserStatsManager'
import { UserVisitManager } from './UserVisitManager'

// ============================================================
// UserSessionManager — 配信セッション全体を統括するクラス
// ============================================================

/**
 * 配信セッションを管理するファサードクラス
 * - stats: 全体のユーザー統計（コメント数・チーム・スコアなど）
 * - visits: ruleId別の訪問情報・抽選制限
 */
export class UserManager {
  readonly stats = new UserStatsManager()
  readonly visits = new UserVisitManager()
  private readonly sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  getSessionId(): string {
    return this.sessionId
  }

  /**
   * セッションをリセット（新しい配信開始時などに使用）
   */
  resetSession(): void {
    this.stats.reset()
    this.visits.resetAll()
  }

  private generateSessionId(): string {
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    return `session_${timestamp}_${randomSuffix}`
  }
}
