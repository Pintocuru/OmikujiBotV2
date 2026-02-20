// src/GameScripts/scripts/DwarfBomb/game/dwarfUtils.ts
import { Dwarf, GAME_CONFIG } from './gameConfigs'

export function createDwarfs(mode: string): Dwarf[] {
  const dwarfs = Array(GAME_CONFIG.DWARF_COUNT)
    .fill(null)
    .map(() => ({
      gold: 0,
      redChest: 0,
      hasRed: false,
      hasDynamite: false,
    }))

  if (mode === 'ツルハシ') {
    dwarfs[0].hasRed = true
  } else if (mode === 'TNT') {
    dwarfs[0].hasDynamite = true
  } else if (mode === 'ツルハシTNT') {
    dwarfs[0].hasRed = true
    dwarfs[0].hasDynamite = true
  }

  return dwarfs
}

export function getTotalGold(dwarfs: Dwarf[]): number {
  return dwarfs.reduce((sum, d) => sum + d.gold + d.redChest, 0)
}

export function createMessage(
  user: string,
  day: number,
  dwarfs: Dwarf[],
  items: string,
  payout: number
): string {
  const winType = GAME_CONFIG.WIN_THRESHOLDS.find(([threshold]) => payout >= threshold)?.[1] || '合計'
  const goldText = dwarfs.map((d, i) => (i === 2 ? `${d.gold + d.redChest}!` : `${d.gold + d.redChest}/`)).join('')

  let msg = `${user}は🐰${day}匹`
  msg += `と鉱山へ${items || '。'}${goldText}${winType}${payout}枚獲得!`

  return msg
}
