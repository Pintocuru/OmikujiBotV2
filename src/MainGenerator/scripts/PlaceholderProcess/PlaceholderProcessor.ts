// src/MainGenerator/scripts/PlaceholderProcess/PlaceholderProcessor.ts
import { PostActionType, PlaceholderType } from '@/types/'
import { DefaultTypes } from '@shared/types'
import { PlaceholderResolver } from './PlaceholderResolver'
import { PlaceholderContext } from './PlaceholderContext'
import { VariablePlaceholderProcessor } from '../VariablePlaceholder/VariableProcessor'

/**
 * プレースホルダー処理のメインクラス
 * プレースホルダー置換処理とコンテキスト値の管理を統合して行う
 * リファクタリング版：各プレースホルダーは毎回新しく解決される
 */
export class PlaceholderProcessor {
  private readonly resolver: PlaceholderResolver
  private readonly context: PlaceholderContext
  private readonly variableProcessor: VariablePlaceholderProcessor = new VariablePlaceholderProcessor()
  private static readonly PLACEHOLDER_PATTERN = /<<([^>]+)>>/g

  constructor(placeholderSources: Record<string, PlaceholderType>) {
    // variableProcessorを先に作成して共有
    this.resolver = new PlaceholderResolver(placeholderSources, this.variableProcessor)
    this.context = new PlaceholderContext()
  }

  /**
   * コンテキスト値を更新（ユーザー名、日付など）
   */
  updateResolvedValues(data: DefaultTypes): void {
    this.context.updateValues(data)
  }

  /**
   * PostAction配列のプレースホルダーを置換して返す
   * 各プレースホルダーは毎回新しく解決される
   */
  processPostActions(postActions: PostActionType[]): PostActionType[] {
    return postActions.map((action) => {
      // actionType: 'message' の場合、messageオブジェクト内の各プロパティを処理
      if (action.actionType === 'message') {
        return {
          ...action,
          message: {
            ...action.message,
            bubble: this.processText(action.message.bubble),
            toast: this.processText(action.message.toast),
            banner: this.processText(action.message.banner),
            dialog: this.processText(action.message.dialog),
          },
        }
      }

      // actionType: 'wordParty' の場合、wordPartyプロパティを処理
      if (action.actionType === 'wordParty') {
        return {
          ...action,
          wordParty: this.processText(action.wordParty),
        }
      }

      // その他のactionType（sound, actionSetなど）はそのまま返す
      return action
    })
  }

  /**
   * 単一のテキストのプレースホルダーを処理
   */
  processText(text?: string): string {
    if (!text) return ''

    // resolverにコンテキスト値を渡す
    this.resolver.setContextValues(this.context.getAllValues())

    // 変数プレースホルダーを処理
    this.variableProcessor.clearVariables() // 初期化
    const content = this.variableProcessor.process(text)

    return content.replace(PlaceholderProcessor.PLACEHOLDER_PATTERN, (match, placeholderId) => {
      const trimmedId = placeholderId.trim()
      // コンテキスト値を優先的にチェック
      if (this.context.hasValue(trimmedId)) {
        const contextValue = this.context.getValue(trimmedId)
        return contextValue !== undefined ? String(contextValue) : match
      }

      // プレースホルダー解決エンジンで処理
      return this.resolver.resolve(trimmedId)
    })
  }

  /**
   * PostActions内で使用されているプレースホルダーIDを収集
   */
  collectUsedPlaceholderIds(postActions: PostActionType[]): string[] {
    const allIds = new Set<string>()

    postActions.forEach((action) => {
      if (action.actionType === 'message') {
        // messageオブジェクト内のすべてのテキストフィールドから収集
        this.addPlaceholderIds(allIds, action.message.bubble)
        this.addPlaceholderIds(allIds, action.message.toast)
        this.addPlaceholderIds(allIds, action.message.banner)
        this.addPlaceholderIds(allIds, action.message.dialog)
      } else if (action.actionType === 'wordParty') {
        // wordPartyから収集
        this.addPlaceholderIds(allIds, action.wordParty)
      }
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
   * デバッグ用: コンテキスト値の一覧を取得
   */
  getResolvedValues(): Record<string, string | number> {
    return this.context.getAllValues()
  }

  /**
   * コンテキスト値をクリア
   */
  clearResolvedValues(): void {
    this.context.clear()
    // 変数プレースホルダーもクリア
    this.variableProcessor.clearVariables()
  }
}
