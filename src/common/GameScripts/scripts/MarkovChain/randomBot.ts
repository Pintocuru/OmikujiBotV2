// src/randomBot.ts

/**
 * コーパスからランダムにテキストを選択するクラス
 */
export class RandomBot {
  /**
   * コーパスからランダムにテキストを生成
   * @param corpus テキストの配列
   * @param userName ユーザー名（置換用）
   */
  generate(corpus: string[], userName: string = 'そこの者'): string {
    if (!corpus || corpus.length === 0) {
      return 'こんにちは!今日も素敵な一日をお過ごしください!'
    }

    // ランダムにテキストを選択
    const randomIndex = Math.floor(Math.random() * corpus.length)
    const template = corpus[randomIndex]

    // ユーザー名を置換
    return template.replace(/\{userName\}/g, userName).replace(/\{name\}/g, userName)
  }
}
