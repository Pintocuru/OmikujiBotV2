// src/types/MetaMaps/FontFamilyMaps.ts

export const fontFamilyMap = {
  // ───── システム ─────
  default: {
    label: 'デフォルト (PC依存)',
    className: '',
    googleFontsUrl: null,
    category: null,
    locales: ['ja'],
  },

  // ───── ゴシック・サンセリフ系 ─────
  notoSansJp: {
    label: 'Noto Sans JP',
    className: 'font-noto-sans-jp',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@500&display=swap',
    category: 'gothic',
    locales: ['ja'],
  },
  mplus1p: {
    label: 'M PLUS 1p',
    className: 'font-mplus-1p',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@600&display=swap',
    category: 'gothic',
    locales: ['ja'],
  },
  mplus2: {
    label: 'M PLUS 2',
    className: 'font-mplus-2',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=M+PLUS+2:wght@600&display=swap',
    category: 'gothic',
    locales: ['ja'],
  },
  bizUdGothic: {
    label: 'BIZ UDGothic',
    className: 'font-biz-ud-gothic',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=BIZ+UDGothic:wght@700&display=swap',
    category: 'gothic',
    locales: ['ja'],
  },
  lineSeedJp: {
    label: 'LINE Seed JP',
    className: 'font-line-seed-jp',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=LINE+Seed+JP_OTF:wght@700&display=swap',
    category: 'gothic',
    locales: ['ja'],
  },

  // 丸ゴシック
  kosugiMaru: {
    label: 'Kosugi Maru',
    className: 'font-kosugi-maru',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap',
    category: 'rounded',
    locales: ['ja'],
  },
  mplusRounded1c: {
    label: 'M PLUS Rounded 1c',
    className: 'font-mplus-rounded-1c',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap',
    category: 'rounded',
    locales: ['ja'],
  },
  kiwiMaru: {
    label: 'Kiwi Maru',
    className: 'font-kiwi-maru',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Kiwi+Maru&display=swap',
    category: 'rounded',
    locales: ['ja'],
  },

  // ───── 明朝・セリフ系 ─────
  notoSerifJp: {
    label: 'Noto Serif JP',
    className: 'font-noto-serif-jp',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@600&display=swap',
    category: 'mincho',
    locales: ['ja'],
  },
  shipporiMincho: {
    label: 'Shippori Mincho',
    className: 'font-shippori-mincho',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@600&display=swap',
    category: 'mincho',
    locales: ['ja'],
  },
  kaiseiDecol: {
    label: 'Kaisei Decol',
    className: 'font-kaisei-decol',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Kaisei+Decol:wght@500&display=swap',
    category: 'mincho',
    locales: ['ja'],
  },
  zenOldMincho: {
    label: 'Zen Old Mincho',
    className: 'font-zen-old-mincho',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@600&display=swap',
    category: 'mincho',
    locales: ['ja'],
  },
  zenAntique: {
    label: 'Zen Antique',
    className: 'font-zen-antique',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Zen+Antique&display=swap',
    category: 'mincho',
    locales: ['ja'],
  },

  // ───── 手書き・カジュアル系 ─────
  hachiMaruPop: {
    label: 'Hachi Maru Pop',
    className: 'font-hachi-maru-pop',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },
  yuseiMagic: {
    label: 'Yusei Magic',
    className: 'font-yusei-magic',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },
  zenKurenaido: {
    label: 'Zen Kurenaido',
    className: 'font-zen-kurenaido',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Zen+Kurenaido&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },
  kleeOne: {
    label: 'Klee One ',
    className: 'font-klee-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Klee+One:wght@600&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },
  yujiMai: {
    label: 'Yuji Mai ',
    className: 'font-yuji-mai',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Yuji+Mai&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },
  newTegomin: {
    label: 'New Tegomin ',
    className: 'font-new-tegomin',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=New+Tegomin&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },

  // ───── 装飾・ディスプレイ系 ─────
  dotGothic: {
    label: 'DotGothic16',
    className: 'font-dot-gothic',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DotGothic16&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  wdxlLubrifont: {
    label: 'WDXL Lubrifont JP N ',
    className: 'font-wdxl-lubrifont',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=WDXL+Lubrifont+JP+N&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  pottaOne: {
    label: 'Potta One',
    className: 'font-potta-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Potta+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  mochiyPop: {
    label: 'Mochiy Pop One',
    className: 'font-mochiy-pop',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  rocknrollOne: {
    label: 'RocknRoll One',
    className: 'font-rocknroll-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  reggaeOne: {
    label: 'Reggae One',
    className: 'font-reggae-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Reggae+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  rampartOne: {
    label: 'Rampart One',
    className: 'font-rampart-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Rampart+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  stick: {
    label: 'Stick ',
    className: 'font-stick',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Stick&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  delaGothicOne: {
    label: 'Dela Gothic One',
    className: 'font-dela-gothic-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
} as const
