// src/GameScripts/scripts/BomberSpin/game.ts

// ゲーム結果のインターフェース定義
interface GameResult {
  symbol: string
  party: string
  payout: number
  message: string
}

// 設定データの統合
const SLOT_CONFIG = {
  symbols: [
    { name: 'チェリー', party: 'BomberSpinCherry', payouts: [0, 0, 1, 2, 10, 40, 200, 1000] },
    { name: 'オレンジ', party: 'BomberSpinOrange', payouts: [0, 0, 1, 2, 15, 60, 300, 1500] },
    { name: 'ぶどう', party: 'BomberSpinPlum', payouts: [0, 0, 1, 4, 20, 80, 400, 2000] },
    { name: 'スイカ', party: 'BomberSpinMelon', payouts: [0, 0, 2, 6, 30, 120, 600, 3000] },
    { name: 'ベル', party: 'BomberSpinBell', payouts: [0, 1, 2, 8, 40, 160, 800, 4000] },
    { name: 'ハット', party: 'BomberSpinHat', payouts: [0, 1, 2, 10, 50, 200, 1000, 5000] },
    { name: 'コイン', party: 'BomberSpinBAR', payouts: [0, 1, 3, 15, 60, 240, 1200, 6000] },
    { name: 'ダイヤモンド', party: 'BomberSpinSeven', payouts: [0, 1, 4, 30, 80, 320, 2000, 8000] },
  ],
  winMessages: [
    [10000, '👑JACKPOT👑'],
    [5000, '💎EPIC WIN💎'],
    [2500, '♕FEVER♕'],
    [1000, '🎯大当り🎯'],
    [500, '✌あたり✌'],
  ] as [number, string][],
  spinWeights: [12, 11, 10, 9, 8, 7, 6, 5],
  symbolWeights: [14, 13, 12, 11, 10, 9, 8, 7],
  wildChance: 1 / 16,
  minPayout: 10,
}

function weightedSelect(weights: number[]): number {
  const total = weights.reduce((sum, w) => sum + w, 0)
  let random = Math.random() * total
  return weights.findIndex((w) => (random -= w) <= 0)
}

function randomSpins(): number {
  const base = weightedSelect(SLOT_CONFIG.spinWeights) + 1
  return Math.max(2, Math.min(7, base - Math.floor(Math.random() * 4)))
}

function randomSymbol(symbol: string) {
  let index = weightedSelect(SLOT_CONFIG.symbolWeights)
  if (symbol === 'チェリー') {
    index = 0
  } else if (symbol === 'オレンジ') {
    index = 1
  } else if (symbol === 'ぶどう') {
    index = 2
  } else if (symbol === 'スイカ') {
    index = 3
  } else if (symbol === 'ベル') {
    index = 4
  } else if (symbol === 'ハット') {
    index = 5
  } else if (symbol === 'コイン') {
    index = 6
  } else if (symbol === 'ダイヤモンド') {
    index = 7
  }
  return SLOT_CONFIG.symbols[index]
}

function countWilds(filledSlots: number): number {
  return Array(filledSlots)
    .fill(0)
    .reduce((wilds) => wilds + (Math.random() < SLOT_CONFIG.wildChance ? 1 : 0), 0)
}

function calculatePayout(payouts: number[], slots: number): number {
  const wilds = countWilds(7 - slots)
  const baseIndex = Math.min(7, 7 - slots + wilds)
  const payout = payouts[baseIndex]
  return payout < SLOT_CONFIG.minPayout ? payout + 1 : payout
}

function getHitRate(symbolData: any, remainingSpins: number): number {
  const symbolIndex = SLOT_CONFIG.symbols.indexOf(symbolData)
  return (20 - symbolIndex * 2 + 20 / remainingSpins) / 100
}

function countHits(slots: number, hitRate: number): number {
  return Array(slots)
    .fill(0)
    .reduce((hits) => hits + (Math.random() < hitRate ? 1 : 0), 0)
}

function createMessage(user: string, symbol: string, payouts: number[], total: number): string {
  const payoutText = payouts.map((p, i) => (i === payouts.length - 1 ? `${p}!` : `${p}/`)).join('')
  const winMessage = SLOT_CONFIG.winMessages.find(([threshold]) => total >= threshold)?.[1] || ''
  return `${user}の${symbol}スピン!${payoutText}${winMessage}合計${total}枚獲得!`
}

export function playSlot(user: string, symbol: string = '', spin: number | null = null): GameResult {
  // 基本パラメータの決定
  const spins = spin ? spin - 1 : randomSpins()
  const symbolData = randomSymbol(symbol)
  let slots = 7 - Math.floor(Math.random() * 3) // 5-7個の空きスロット

  // 初回スピンの結果
  let totalPayout = calculatePayout(symbolData.payouts, slots)
  const payoutHistory = [totalPayout]

  // 追加スピンの処理
  for (let i = spins; i > 0; i--) {
    const hitRate = getHitRate(symbolData, i)
    const hits = countHits(slots, hitRate)
    slots -= hits

    const payout = calculatePayout(symbolData.payouts, slots)
    payoutHistory.push(payout)
    totalPayout += payout
  }

  return {
    symbol: symbolData.name,
    party: symbolData.party,
    payout: totalPayout,
    message: createMessage(user, symbolData.name, payoutHistory, totalPayout),
  }
}
