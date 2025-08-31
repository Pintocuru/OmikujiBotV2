// src/MainGenerator/script/omikujiProcess/PlaceProcess.ts
import { PostActionType, PlaceholderType } from '@/types/'
import { DefaultTypes } from '@shared/types'
import { PlaceholderProcessor } from './placeholders/PlaceholderProcessor'

/**
 * プレースホルダー置換処理を行うメインクラス
 * リファクタリング版：各プレースホルダーは毎回新しく解決される
 */
export class PlaceProcess {
  private readonly processor: PlaceholderProcessor

  constructor(placeholderSources: Record<string, PlaceholderType>) {
    this.processor = new PlaceholderProcessor(placeholderSources)
  }

  /**
   * コンテキスト値を更新（ユーザー名、日付など）
   */
  updateResolvedValues(data: DefaultTypes): void {
    this.processor.updateContext(data)
  }

  /**
   * PostAction配列のプレースホルダーを置換して返す
   * 同じプレースホルダーIDでも毎回新しい値が生成される
   */
  processPostActions(postActions: PostActionType[], seed?: number): PostActionType[] {
    return this.processor.processPostActions(postActions, seed)
  }

  /**
   * 単一のテキストのプレースホルダーを処理
   */
  processText(text: string, seed?: number): string {
    return this.processor.processText(text, seed)
  }

  /**
   * PostActions内で使用されているプレースホルダーIDを収集
   */
  collectUsedPlaceholderIds(postActions: PostActionType[]): string[] {
    return this.processor.collectUsedPlaceholderIds(postActions)
  }

  /**
   * デバッグ用: コンテキスト値の一覧を取得
   */
  getResolvedValues(): Record<string, string | number> {
    return this.processor.getContextValues()
  }

  /**
   * コンテキスト値をクリア
   */
  clearResolvedValues(): void {
    this.processor.clearContext()
  }
}
