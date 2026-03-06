// src/ConfigMaker/components/UiEditor/FlightSeat/CustomLayoutPresets.ts

export const customLayoutPresets = {
  flightSeat: { label: 'フライトシート', layout: [4, 6, 6, 6], emoji: '✈' },
  pyramid5: { label: 'ピラミッド (5段)', layout: [1, 2, 3, 4, 5], emoji: '🔺' },
  inversePyramid5: { label: '逆ピラミッド (5段)', layout: [5, 4, 3, 2, 1], emoji: '🔻' },
  hinadan5: { label: 'ひな壇 (5段)', layout: [2, 2, 3, 5, 5], emoji: '🎎' },
  theater: { label: 'シアター風', layout: [3, 4, 5, 6, 7, 8, 9], emoji: '🎭' },
  diamond: { label: 'ダイヤモンド', layout: [1, 2, 3, 4, 3, 2, 1], emoji: '💎' },
  graduationPhoto: { label: '卒業写真（中央密集）', layout: [12, 13, 12], emoji: '🎓' },
  hourglass: { label: '砂時計型', layout: [5, 4, 3, 2, 3, 4, 5], emoji: '⏳' },
} as const

export type CustomLayoutPresetKey = keyof typeof customLayoutPresets

/**
 * 配列を文字列に変換（保存用）
 */
export function layoutArrayToString(layout: number[]): string {
  return JSON.stringify(layout)
}

/**
 * 文字列を配列に変換（読み込み用）
 */
export function layoutStringToArray(str: string, fallback: number[] = [1, 2, 3, 4, 5]): number[] {
  try {
    const parsed = JSON.parse(str)
    if (Array.isArray(parsed) && parsed.every((n) => typeof n === 'number' && n > 0)) {
      return parsed
    }
  } catch {}
  return fallback
}

/**
 * プリセットキーから配列を取得
 */
export function getPresetLayout(presetKey: CustomLayoutPresetKey): number[] {
  return [...customLayoutPresets[presetKey].layout]
}
