// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\MainGenerator\scripts\PlaceholderProcess\PlaceholderContext.ts
import { DefaultTypes } from '@shared/types'

/**
 * プレースホルダーのコンテキスト値を管理
 * ユーザー名、日付など、動的に設定される値を保持
 */
export class PlaceholderContext {
  private contextValues: Record<string, string | number> = {}

  /**
   * コンテキスト値を更新
   */
  updateValues(values: DefaultTypes): void {
    Object.assign(this.contextValues, values)
  }

  /**
   * コンテキスト値を取得
   */
  getValue(key: string): string | number | undefined {
    return this.contextValues[key]
  }

  /**
   * すべてのコンテキスト値を取得
   */
  getAllValues(): Record<string, string | number> {
    return { ...this.contextValues }
  }

  /**
   * 特定のキーが存在するかチェック
   */
  hasValue(key: string): boolean {
    return key in this.contextValues
  }

  /**
   * コンテキスト値をクリア
   */
  clear(): void {
    this.contextValues = {}
  }

  /**
   * 指定したキーのコンテキスト値を削除
   */
  removeValue(key: string): void {
    delete this.contextValues[key]
  }
}
