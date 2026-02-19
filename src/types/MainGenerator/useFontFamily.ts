// src/types/MainGenerator/useFontFamily.ts

export const fontFamilyLabels = {
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
export type FontFamilyType = keyof typeof fontFamilyLabels
export const fontFamilyOptions = Object.keys(fontFamilyLabels) as FontFamilyType[]

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
