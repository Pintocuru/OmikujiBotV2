// src/MainGenerator/ui/FlightSeat/composables/seatLayoutUtils.ts

/**
 * flightComponentDefaults の値から総座席数を計算
 * - number: そのまま返す
 * - string: JSON配列をパースして合計する
 */
export function calculateTotalSeats(defaultValue: number | string, customLayout?: string): number {
  // customLayout が指定されていれば優先してパース
  const target = customLayout ?? defaultValue
  if (typeof defaultValue === 'number') return defaultValue
  if (typeof target === 'number') return target
  try {
    const parsed = JSON.parse(target) as number[]
    return parsed.reduce((sum, n) => sum + n, 0)
  } catch {
    return 0
  }
}

/**
 * string型（カスタムレイアウト）の場合に行配列を返す
 */
export function parseCustomLayout(defaultValue: number | string, customLayout?: string): number[] {
  const target = customLayout ?? defaultValue
  if (typeof target === 'string') {
    try {
      return JSON.parse(target) as number[]
    } catch {
      return []
    }
  }
  return []
}
