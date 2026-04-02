// src/types/MetaMaps/GameMetaMaps.ts

const DOCS = 'https://github.com/Pintocuru/OmikujiBot-Docs'
const MAIN = `${DOCS}/blob/main`
const RAW = `${DOCS}/raw/main`

export const gameMetaMap = {
  GouseiSuika: {
    name: 'スイカジェネレーター',
    description: '米兜科技 - 合成大西瓜風のおみくじ',
    icon: 'Apple',
    url: `${MAIN}/2025-Q4/GouseiSuika/GouseiSuika.md`,
    banner: `${RAW}/2025-Q4/GouseiSuika/GouseiSuika.webp`,
  },
  BomberSpin: {
    name: 'ボンバースロット',
    description: 'APPLI - BOMBERSPIN2風のおみくじ',
    icon: 'Bomb',
    url: `${MAIN}/2025-Q4/BomberSpin/BomberSpin.md`,
    banner: `${RAW}/2025-Q4/BomberSpin/BomberSpin.webp`,
  },
  DwarfBomb: {
    name: 'うさぎスロット',
    description: 'Nolimit City - Fire in the Hole風のおみくじ',
    icon: 'Rabbit',
    url: `${MAIN}/2025-Q4/BomberSpin/DwarfBomb.md`,
    banner: `${RAW}/2025-Q4/BomberSpin/BomberSpinDwarf.webp`,
  },
  MultiplyBonanza: {
    name: '桜吹雪スロット',
    description: 'Wing - FURAIJIN風のおみくじ',
    icon: 'Flower2',
    url: `${MAIN}/2025-Q4/BomberSpin/MultiplyBonanza.md`,
    banner: `${RAW}/2025-Q4/BomberSpin/BomberSpinSakura.webp`,
  },
  GoogolClover: {
    name: 'グーゴルクローバー',
    description: 'Future Friends Games - CloverPit風のおみくじ',
    icon: 'Clover',
    url: `${MAIN}/GoogolClover/GoogolClover.md`,
    banner: `${RAW}/GoogolClover/GoogolClover.webp`,
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
    banner: `${RAW}/WinnerGroup/WinnerGroup.webp`,
  },
} as const
