// src/MainGenerator/scripts/ContentPlaceholder/parser.ts

/**
 * ネストを考慮して、対応する閉じ括弧 >> の位置を返す
 */
export function findMatchingClosingBracket(text: string, startPos: number): number {
  let depth = 0
  for (let i = startPos; i < text.length; i++) {
    if (text.substring(i, i + 2) === '<<') {
      depth++
      i++ // 1文字飛ばす
    } else if (text.substring(i, i + 2) === '>>') {
      depth--
      if (depth === 0) return i
      i++ // 1文字飛ばす
    }
  }
  return -1
}

/**
 * インラインランダム選択構文かどうかを判定
 */
export function isInlineRandomSyntax(input: string): boolean {
  return input.includes(',') && input.includes("'")
}

/**
 * インライン値をパースして配列として取得
 * 'value1','value2','value3' -> ['value1', 'value2', 'value3']
 */
export function parseInlineValues(input: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuote = false
  let quoteChar = ''

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    // クォートの判定
    if ((char === "'" || char === '"') && (i === 0 || input[i - 1] !== '\\')) {
      if (!inQuote) {
        inQuote = true
        quoteChar = char
        // 開始クォートは current に追加しない
      } else if (char === quoteChar) {
        inQuote = false
        // 終了クォートも current に追加しない
      } else {
        current += char
      }
    } else if (char === ',' && !inQuote) {
      // クォート外のカンマで区切る
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  if (current.trim() || values.length > 0) {
    values.push(current.trim())
  }
  return values
}

/**
 * 配列からランダムに1つの要素を選択
 * @param values 選択元の配列
 * @returns ランダムに選択された要素
 */
export function selectRandomValue<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)]
}
