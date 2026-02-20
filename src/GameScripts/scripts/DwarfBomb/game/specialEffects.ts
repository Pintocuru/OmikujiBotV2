// src/GameScripts/scripts/DwarfBomb/game/specialEffects.ts
import { Dwarf } from './gameConfigs'

/** 桁数に応じた絵文字文字列を返す（1桁は空白） */
function emojiByDigits(amount: number, emoji: string): string {
  const digits = String(amount).length
  if (digits === 1) return ' '
  if (digits === 2) return emoji
  if (digits === 3) return emoji + emoji
  return emoji.repeat(4)
}

/**
 * hasRed / hasDynamite の特殊効果を dwarfs に適用し、
 * 増加量に応じた絵文字文字列を返す。
 *
 * 副作用: dwarf.redChest / dwarf.gold を直接変更する。
 */
export function applySpecialEffects(dwarfs: Dwarf[]): string {
  // 1. 適用前のスナップショット
  const snapshots = dwarfs.map((d) => ({
    redChest: d.redChest,
    gold: d.gold,
  }))

  // 2. hasRed: redChest += gold
  dwarfs.forEach((d) => {
    if (d.hasRed) {
      d.redChest += d.gold
    }
  })

  // 3. ⛏️ 絵文字の生成
  let result = ''
  dwarfs.forEach((d, i) => {
    const increase = d.redChest - snapshots[i].redChest
    if (increase > 0) {
      result += emojiByDigits(increase, '⛏️')
    }
  })

  // 4. hasDynamite: gold += 他の全 dwarf の gold（hasRed 適用前の値を使う）
  //    snapshots[i].gold = hasRed 適用前の値 なので、それを合算する
  dwarfs.forEach((d, i) => {
    if (d.hasDynamite) {
      dwarfs.forEach((_, j) => {
        if (i !== j) {
          d.gold += snapshots[j].gold
        }
      })
    }
  })

  // 5. 🧨 絵文字の生成（hasDynamite による gold の増加）
  dwarfs.forEach((d, i) => {
    // hasDynamite 適用前の gold = hasRed 適用後の gold = snapshots[i].gold（hasRed は gold を変えない）
    const increase = d.gold - snapshots[i].gold
    if (increase > 0) {
      result += emojiByDigits(increase, '🧨')
    }
  })

  return result
}
