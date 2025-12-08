// src\MainGenerator\scripts\VariablePlaceholder\VariableProcessor.ts
import { VariableStore } from './VariableStore'
import { ExpressionEvaluator } from './ExpressionEvaluator'
import { BuiltinFunctionProcessor } from './BuiltinFunctionProcessor'
import { PlaceholderExtractor } from './PlaceholderExtractor'

/**
 * 変数プレースホルダー処理エンジン
 * {{var}}, {{rand}}などの特殊プレースホルダーを処理
 */
export class VariablePlaceholderProcessor {
  private variableStore = new VariableStore()
  private expressionEvaluator = new ExpressionEvaluator(this.variableStore)
  private builtinProcessor = new BuiltinFunctionProcessor()
  private extractor = new PlaceholderExtractor()

  /**
   * 変数をクリア（新しい解決サイクルの開始時に呼ぶ）
   */
  clearVariables(): void {
    this.variableStore.clear()
  }

  /**
   * テキスト内の変数プレースホルダーを処理
   * 処理順序：var宣言 → その他の変数参照 → rand
   */
  process(text: string): string {
    let processedText = text

    // 1. var宣言を先に処理（宣言順に処理）
    processedText = this.processVariableDeclarations(processedText)

    // 2. 変数参照を処理
    processedText = this.processVariableReferences(processedText)

    // 3. rand などの組み込み関数を処理
    processedText = this.builtinProcessor.process(processedText)

    return processedText
  }

  /**
   * 変数宣言を処理
   * {{var variableName = expression}}
   */
  private processVariableDeclarations(text: string): string {
    const varPattern = /\{\{var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^}]+)\}\}/g

    return text.replace(varPattern, (match, varName, expression) => {
      try {
        const value = this.expressionEvaluator.evaluate(expression.trim())
        this.variableStore.set(varName, value)
        return '' // 宣言は空文字に置換
      } catch (error) {
        console.warn(`変数宣言の評価に失敗しました: ${match}`, error)
        return match // エラー時は元のテキストを返す
      }
    })
  }

  /**
   * 変数参照を処理
   * {{variableName}}
   */
  private processVariableReferences(text: string): string {
    const refPattern = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g

    return text.replace(refPattern, (match, varName) => {
      if (this.variableStore.has(varName)) {
        return String(this.variableStore.get(varName))
      }

      console.warn(`未定義の変数が参照されました: ${varName}`)
      return match
    })
  }

  /**
   * デバッグ用：現在の変数状態を取得
   */
  getVariables(): Record<string, string | number> {
    return this.variableStore.getAll()
  }

  /**
   * テキスト内の変数プレースホルダーを抽出（解析用）
   */
  extractVariablePlaceholders(text: string): {
    declarations: Array<{ name: string; expression: string }>
    references: string[]
    builtins: string[]
  } {
    return this.extractor.extract(text)
  }
}
