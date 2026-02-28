// src/types/MetaMaps/GameMetaMaps.ts

const DOCS = 'https://github.com/Pintocuru/OmikujiBot-Docs'
const MAIN = `${DOCS}/blob/main/solo`
const RAW = `${DOCS}/raw/main/solo`

export const gameMetaMap = {
  GouseiSuika: {
    name: 'スイカジェネレーター',
    description: '米兜科技 - 合成大西瓜風のおみくじ',
    icon: 'Apple',
    url: `${MAIN}/GouseiSuika/GouseiSuika.md`,
    banner: `${RAW}/GouseiSuika/images/thumb_GouseiSuika.webp`,
  },
  BomberSpin: {
    name: 'ボンバースロット',
    description: 'APPLI - BOMBERSPIN2風のおみくじ',
    icon: 'Bomb',
    url: `${MAIN}/BomberSpin/BomberSpin.md`,
    banner: `${MAIN}/BomberSpin/images/thumb_BomberSpin.webp`,
  },
  DwarfBomb: {
    name: 'うさぎスロット',
    description: 'Nolimit City - Fire in the Hole風のおみくじ',
    icon: 'Rabbit',
    url: `${MAIN}/BomberSpin/DwarfBomb.md`,
    banner: `${RAW}/BomberSpin/images/thumb_DwarfBomb.webp`,
  },
  MultiplyBonanza: {
    name: '桜吹雪スロット',
    description: 'Wing - FURAIJIN風のおみくじ',
    icon: 'Flower2',
    url: `${MAIN}/BomberSpin/MultiplyBonanza.md`,
    banner: `${RAW}/BomberSpin/images/thumb_MultiplyBonanza.webp`,
  },
  GoogolClover: {
    name: 'グーゴルクローバー',
    description: 'Future Friends Games - CloverPit風のおみくじ',
    icon: 'Clover',
    url: `${MAIN}/GoogolClover/GoogolClover.md`,
    banner: `${RAW}/GoogolClover/images/thumb_GoogolClover.webp`,
  },
  HugEmAll: {
    name: 'ダンジョンスロット',
    description: 'Nolimit City - Kill Em All風のおみくじ',
    icon: 'Swords',
    url: '',
    banner: '',
  },
  WinnerGroup: {
    name: 'ラッキーメンバーズ',
    description: '複数の当選者をまとめて返すスクリプト',
    icon: 'Crown',
    url: `${MAIN}/WinnerGroup/WinnerGroup.md`,
    banner: `${RAW}/WinnerGroup/images/thumb_WinnerGroup.webp`,
  },
} as const
