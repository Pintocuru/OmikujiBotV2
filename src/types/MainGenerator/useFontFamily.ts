// src/types/MainGenerator/useFontFamily.ts

export const fontFamilyOptions = [
  'default',
  'mplus1p',
  'shipporiMincho',
  'kosugiMaru',
  'kaiseiDecol',
  'dotGothic',
  'wdxlLubrifont',
  'mochiyPop',
  'kiwiMaru',
  'hachiMaruPop',
  'rocknrollOne',
  'delaGothicOne',
] as const
export type FontFamilyType = (typeof fontFamilyOptions)[number]

export const fontFamilyLabels: Record<FontFamilyType, string> = {
  default: 'デフォルト(PC依存)',
  mplus1p: 'M PLUS 1p',
  kosugiMaru: '小杉丸',
  shipporiMincho: 'しっぽり明朝',
  rocknrollOne: 'ロックンロール One',
  kaiseiDecol: '解星デコール',
  dotGothic: 'ドットゴシック16',
  kiwiMaru: 'Kiwi Maru',
  hachiMaruPop: 'はちまるポップ',
  wdxlLubrifont: '滑油字',
  mochiyPop: 'モッチーポップ',
  delaGothicOne: 'デラゴシック',
}

export function useFontFamily(font: FontFamilyType) {
  const mapping: Record<FontFamilyType, string> = {
    default: '',
    mplus1p: 'font-mplus-1p',
    kosugiMaru: 'font-kosugi-maru',
    shipporiMincho: 'font-shippori-mincho',
    rocknrollOne: 'font-rocknroll-one',
    dotGothic: 'font-dot-gothic',
    kiwiMaru: 'font-kiwi-maru',
    kaiseiDecol: 'font-kaisei-decol',
    hachiMaruPop: 'font-hachi-maru-pop',
    wdxlLubrifont: 'font-wdxl-lubrifont',
    mochiyPop: 'font-mochiy-pop',
    delaGothicOne: 'font-dela-gothic-one',
  }
  return mapping[font] ?? ''
}
