// src/MainGenerator/script/omikujiProcess/placeholders/PlaceholderProcessor.ts
import { PostActionType } from '@/types/'
import { PlaceholderResolver } from './PlaceholderResolver'
import { PlaceholderContext } from './PlaceholderContext'

/**
 * プレースホルダー処理のメインクラス
 * リアルタイム置換とコンテキスト値の管理を行う
 */
export class PlaceholderProcessor {
  private readonly resolver: PlaceholderResolver
  private readonly context: PlaceholderContext
  private static readonly PLACEHOLDER_PATTERN = /<<([^>]+)>>/g

  constructor(placeholderSources: Record<string, any>) {
    this.resolver = new PlaceholderResolver(placeholderSources)
    this.context = new PlaceholderContext()
  }

  /**
   * コンテキスト値を更新
   */
  updateContext(values: Record<string, string | number>): void {
    console.log(values)
    this.context.updateValues(values)
  }

  /**
   * PostAction配列のプレースホルダーを置換
   * 各プレースホルダーは毎回新しく解決される
   */
  processPostActions(postActions: PostActionType[], seed?: number): PostActionType[] {
    return postActions.map((action) => ({
      ...action,
      messageContent: this.processText(action.messageContent, seed),
      messageToast: this.processText(action.messageToast, seed),
      wordParty: this.processText(action.wordParty, seed),
    }))
  }

  /**
   * テキスト内のプレースホルダーを処理
   */
  processText(text: string | undefined, seed?: number): string {
    if (!text) return ''

    // resolverにコンテキスト値を渡す
    this.resolver.setContextValues(this.context.getAllValues())

    return text.replace(PlaceholderProcessor.PLACEHOLDER_PATTERN, (match, placeholderId) => {
      const trimmedId = placeholderId.trim()

      // コンテキスト値を優先的にチェック
      if (this.context.hasValue(trimmedId)) {
        const contextValue = this.context.getValue(trimmedId)
        return contextValue !== undefined ? String(contextValue) : match
      }

      // プレースホルダー解決エンジンで処理
      return this.resolver.resolve(trimmedId, seed)
    })
  }

  /**
   * PostActions内で使用されているプレースホルダーIDを収集
   */
  collectUsedPlaceholderIds(postActions: PostActionType[]): string[] {
    const allIds = new Set<string>()

    postActions.forEach((action) => {
      this.addPlaceholderIds(allIds, action.messageContent)
      this.addPlaceholderIds(allIds, action.messageToast)
      this.addPlaceholderIds(allIds, action.wordParty)
    })

    // 依存関係も含めて収集
    const finalIds = new Set<string>()
    for (const id of allIds) {
      const dependencies = this.resolver.collectDependencies(id)
      dependencies.forEach((depId) => finalIds.add(depId))
    }

    return Array.from(finalIds)
  }

  /**
   * テキストからプレースホルダーIDを抽出してSetに追加
   */
  private addPlaceholderIds(idSet: Set<string>, text: string | undefined): void {
    if (!text) return

    const ids = this.resolver.extractPlaceholderIds(text)
    ids.forEach((id) => idSet.add(id))
  }

  /**
   * コンテキストをクリア
   */
  clearContext(): void {
    this.context.clear()
  }

  /**
   * デバッグ用: コンテキスト値の一覧を取得
   */
  getContextValues(): Record<string, string | number> {
    return this.context.getAllValues()
  }
}
