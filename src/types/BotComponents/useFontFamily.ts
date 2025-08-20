// src/MainGenerator/scripts/useFontFamily.ts

export const fontFamilyOptions = [
  'system',
  'notoSansJp',
  'kosugiMaru',
  'zenMaruGothic',
  'rocknrollOne',
  'mochiyPop',
] as const
export type FontFamilyType = (typeof fontFamilyOptions)[number]

export const fontFamilyLabels: Record<FontFamilyType, string> = {
  system: 'システムフォント',
  notoSansJp: 'Noto Sans JP',
  kosugiMaru: '小杉丸ゴシック',
  zenMaruGothic: 'Zen丸ゴシック',
  rocknrollOne: 'ロックンロールOne',
  mochiyPop: 'モッチーポップ',
}

export function useFontFamily(font: FontFamilyType) {
  const mapping: Record<FontFamilyType, string> = {
    system: 'font-system',
    notoSansJp: 'font-noto-sans',
    kosugiMaru: 'font-rounded',
    zenMaruGothic: 'font-rounded',
    rocknrollOne: 'font-gothic',
    mochiyPop: 'font-mochiy',
  }
  return mapping[font] ?? 'font-system'
}
