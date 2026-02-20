// src/MainGenerator/scripts/KeyValue/KeyValueMap.ts

export class KeyValueMap {
  protected values = new Map<string, string | number>()

  // 変数を設定
  set(key: string, value: string | number) {
    this.values.set(key, value)
  }

  // 変数を取得
  get(key: string) {
    return this.values.get(key)
  }

  // 変数の存在確認
  has(key: string) {
    return this.values.has(key)
  }

  // 指定した変数を削除
  remove(key: string) {
    this.values.delete(key)
  }

  // 変数をクリア
  clear() {
    this.values.clear()
  }

  // すべての変数を取得
  getAll(): Record<string, string | number> {
    return Object.fromEntries(this.values)
  }
}
