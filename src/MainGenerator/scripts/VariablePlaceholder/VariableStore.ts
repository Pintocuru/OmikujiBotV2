// src\MainGenerator\scripts\VariablePlaceholder\VariableStore.ts

/**
 * 変数を管理するクラス
 */
export class VariableStore {
  private variables: Map<string, string | number> = new Map()

  /**
   * 変数を設定
   */
  set(name: string, value: string | number): void {
    this.variables.set(name, value)
  }

  /**
   * 変数を取得
   */
  get(name: string): string | number | undefined {
    return this.variables.get(name)
  }

  /**
   * 変数が存在するかチェック
   */
  has(name: string): boolean {
    return this.variables.has(name)
  }

  /**
   * 全変数をクリア
   */
  clear(): void {
    this.variables.clear()
  }

  /**
   * 全変数を取得（デバッグ用）
   */
  getAll(): Record<string, string | number> {
    return Object.fromEntries(this.variables)
  }
}
