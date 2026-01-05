// src\MainGenerator\scripts\PlaceholderProcess\PlaceholderProcessor.ts
import { PostActionType, PlaceholderType } from '@/types/'
import { PlaceholderResolver } from './PlaceholderResolver'
import { PlaceholderContext } from './PlaceholderContext'

/**
 * プレースホルダー処理のメインクラス
 * プレースホルダー置換処理とコンテキスト値の管理を統合して行う
 * 各プレースホルダーは毎回新しく解決される
 */
export class PlaceholderProcessor {
  private readonly resolver: PlaceholderResolver
  private readonly context: PlaceholderContext
  private static readonly PLACEHOLDER_PATTERN = /<<([^>]+)>>/g

  constructor(placeholderSources: Record<string, PlaceholderType>) {
    this.resolver = new PlaceholderResolver(placeholderSources)
    this.context = new PlaceholderContext()
  }

  /**
   * コンテキスト値を更新(ユーザー名、日付など)
   */
  updateResolvedValues(data: Record<string, string | number>): void {
    this.context.updateValues(data)
  }

  /**
   * PostAction配列のプレースホルダーを置換して返す
   */
  processPostActions(postActions: PostActionType[]): PostActionType[] {
    return postActions.map((action) => {
      if (action.actionType === 'message') {
        return { ...action, message: this.processObject(action.message) }
      }
      if (action.actionType === 'wordParty') {
        return { ...action, wordParty: this.processText(action.wordParty) }
      }
      return action
    })
  }

  /**
   * オブジェクト内の文字列プロパティを処理
   */
  private processObject<T extends Record<string, any>>(obj: T): T {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, typeof value === 'string' ? this.processText(value) : value])
    ) as T
  }

  /**
   * 単一のテキストのプレースホルダーを処理
   */
  processText(text?: string): string {
    if (!text) return ''

    this.resolver.setContextValues(this.context.getAll())

    return text.replace(PlaceholderProcessor.PLACEHOLDER_PATTERN, (match, placeholderId) =>
      this.resolvePlaceholder(match, placeholderId.trim())
    )
  }

  /**
   * プレースホルダーを解決
   */
  private resolvePlaceholder(originalMatch: string, placeholderId: string): string {
    // コンテキスト値を優先
    if (this.context.has(placeholderId)) {
      const value = this.context.get(placeholderId)
      return value !== undefined ? String(value) : originalMatch
    }

    // プレースホルダー解決エンジンで処理
    return this.resolver.resolve(placeholderId)
  }

  /**
   * PostActions内で使用されているプレースホルダーIDを収集
   */
  collectUsedPlaceholderIds(postActions: PostActionType[]): string[] {
    const placeholderIds = new Set<string>()

    // 直接使用されているIDを収集
    postActions.forEach((action) => {
      if (action.actionType === 'message') {
        this.extractIdsFromObject(action.message, placeholderIds)
      } else if (action.actionType === 'wordParty') {
        this.extractIdsFromText(action.wordParty, placeholderIds)
      }
    })

    // 依存関係を含めたIDを収集
    const allIds = new Set<string>()
    placeholderIds.forEach((id) => {
      this.resolver.collectDependencies(id).forEach((depId) => allIds.add(depId))
    })

    return [...allIds]
  }

  /**
   * テキストからプレースホルダーIDを抽出
   */
  private extractIdsFromText(text: string | undefined, idSet: Set<string>): void {
    if (!text) return
    this.resolver.extractPlaceholderIds(text).forEach((id) => idSet.add(id))
  }

  /**
   * オブジェクトの文字列値からプレースホルダーIDを抽出
   */
  private extractIdsFromObject(obj: Record<string, unknown>, idSet: Set<string>): void {
    Object.values(obj).forEach((value) => {
      if (typeof value === 'string') {
        this.extractIdsFromText(value, idSet)
      }
    })
  }

  /**
   * デバッグ用: コンテキスト値の一覧を取得
   */
  getResolvedValues(): Record<string, string | number> {
    return this.context.getAll()
  }

  /**
   * コンテキスト値をクリア
   */
  clearResolvedValues(): void {
    this.context.clear()
  }
}
