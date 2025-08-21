// src/MainGenerator/scripts/useFontFamily.ts

export const fontFamilyOptions = [
  'default',
  'mplus1p',
  'shipporiMincho',
  'kosugiMaru',
  'kaiseiDecol',
  'dotGothic',
  'wdxlLubrifont',
  'mochiyPop',
] as const
export type FontFamilyType = (typeof fontFamilyOptions)[number]

export const fontFamilyLabels: Record<FontFamilyType, string> = {
  default: 'デフォルト(PC依存)',
  mplus1p: 'M PLUS 1p',
  shipporiMincho: 'しっぽり明朝',
  kosugiMaru: '小杉丸',
  kaiseiDecol: '解星デコール',
  dotGothic: 'ドットゴシック16',
  wdxlLubrifont: '滑油字',
  mochiyPop: 'モッチーポップ',
}

export function useFontFamily(font: FontFamilyType) {
  const mapping: Record<FontFamilyType, string> = {
    default: '',
    mplus1p: 'font-mplus-1p',
    shipporiMincho: 'font-shippori-mincho',
    kosugiMaru: 'font-kosugi-maru',
    kaiseiDecol: 'font-kaisei-decol',
    dotGothic: 'font-dot-gothic',
    wdxlLubrifont: 'font-wdxl-lubrifont',
    mochiyPop: 'font-mochiy-pop',
  }
  return mapping[font] ?? ''
}
