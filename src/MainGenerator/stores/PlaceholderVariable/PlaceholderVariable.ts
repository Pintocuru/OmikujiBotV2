// src/MainGenerator/stores/PlaceholderVariable/PlaceholderVariable.ts
import { ExpressionEngine } from './ExpressionEngine'

export interface PlaceholderVariableType {
  getEvaluator(): ExpressionEngine
  getAll(): Record<string, string | number>
  clear(): void
  remove(key: string): void
}

/**
 * スクリプト実行中の変数状態を保持するコンテキスト
 * セッション単位で利用する
 */
export class PlaceholderVariable implements PlaceholderVariableType {
  private readonly evaluator = new ExpressionEngine()

  getEvaluator(): ExpressionEngine {
    return this.evaluator
  }

  getAll(): Record<string, string | number> {
    return this.evaluator.getAll()
  }

  clear(): void {
    this.evaluator.clear()
  }

  remove(key: string): void {
    this.evaluator.remove(key)
  }
}
