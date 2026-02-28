// src/MainGenerator/scripts/VariablePlaceholder/ScriptVariableContext.ts
import { ExpressionEvaluator } from './ExpressionEvaluator'

/**
 * スクリプト実行中の変数状態を保持するコンテキスト
 * セッション単位で利用する
 */
export class ScriptVariableContext {
  private readonly evaluator = new ExpressionEvaluator()

  getEvaluator(): ExpressionEvaluator {
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
