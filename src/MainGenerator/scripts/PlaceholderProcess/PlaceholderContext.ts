// src\MainGenerator\scripts\PlaceholderProcess\PlaceholderContext.ts
import { DefaultTypes } from '@shared/types'
import { KeyValueMap } from '@/MainGenerator/scripts/KeyValue/KeyValueMap'

/**
 * プレースホルダーのコンテキスト値を管理
 * ユーザー名、日付など、動的に設定される値を保持
 */
export class PlaceholderContext extends KeyValueMap {
  /**
   * コンテキスト値を更新
   */
  updateValues(values: DefaultTypes): void {
    Object.entries(values).forEach(([key, value]) => {
      this.set(key, value)
    })
  }
}
