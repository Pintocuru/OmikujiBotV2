// src/MainGenerator/scripts/useFontFamily.ts

export const fontFamilyLabel = [
  'system',
  'noto-sans-jp',
  'kosugi-maru',
  'zen-maru-gothic',
  'rocknroll-one',
  'mochiy-pop',
] as const
export type FontFamilyType = (typeof fontFamilyLabel)[number]

export function useFontFamily(font: FontFamilyType) {
  const mapping: Record<FontFamilyType, string> = {
    system: 'font-sans', // system-ui
    'noto-sans-jp': 'font-noto-sans-jp',
    'kosugi-maru': 'font-kosugi-maru',
    'zen-maru-gothic': 'font-zen-maru-gothic',
    'rocknroll-one': 'font-rocknroll',
    'mochiy-pop': 'font-mochiy',
  }
  return mapping[font] ?? 'font-sans'
}
