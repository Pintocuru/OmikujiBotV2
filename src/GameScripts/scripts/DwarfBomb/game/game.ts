// src/GameScripts/scripts/DwarfBomb/game/game.ts
import { PostFlowWordPartyType } from '@/types/OmikujiData/'
import { GameResult, GAME_CONFIG, RewardType } from './gameConfigs'
import { createDwarfs, getTotalGold, createMessage } from './dwarfUtils'
import { selectReward, applyReward } from './rewards'
import { applySpecialEffects } from './specialEffects'

// ---- ゲームループ ----

export function playGame(userName: string, mode: string = ''): GameResult {
  const dwarfs = createDwarfs(mode)
  let life: number = GAME_CONFIG.INITIAL_LIFE
  let items = ''
  let day = 0
  let specialEffectCount = 0

  const hasSpecialEffect = () => dwarfs.some((d) => d.hasDynamite || d.hasRed)

  // ゲームループ
  while (getTotalGold(dwarfs) <= GAME_CONFIG.MAX_WIN && Math.random() * 10 < life) {
    day++
    life--

    const dwarf = dwarfs[Math.floor(Math.random() * GAME_CONFIG.DWARF_COUNT)]
    const rewardType = selectReward()

    items += applyReward(dwarf, dwarfs, rewardType)

    // 緑宝箱でライフ回復
    if (rewardType === RewardType.GREEN_CHEST) {
      life = GAME_CONFIG.GREEN_RECOVERY
    }

    items += applySpecialEffects(dwarfs)
    if (hasSpecialEffect()) specialEffectCount++
  }

  // ゲーム終了後、applySpecialEffects を2回行う
  for (let i = 0; i < 2; i++) {
    items += applySpecialEffects(dwarfs)
    if (hasSpecialEffect()) specialEffectCount++
  }

  const payout = Math.min(getTotalGold(dwarfs), GAME_CONFIG.MAX_WIN)
  const message = createMessage(userName, day, dwarfs, items, payout)

  return { day, payout, message, dwarfs, items, specialEffectCount }
}

// ---- WordParty 演出生成 ----

export function generatePartyEffects(gameResult: GameResult): PostFlowWordPartyType[] {
  const { items, day } = gameResult
  const effects: PostFlowWordPartyType[] = []

  const addEffect = (wordParty: string, times: number) => {
    for (let i = 0; i < times; i++) {
      effects.push({ actionType: 'wordParty', delaySeconds: 2.7, wordParty })
    }
  }

  const count = (emoji: string) => (items.match(new RegExp(emoji, 'g')) || []).length

  addEffect('DwarfBombMediumGold', count('🪙'))
  addEffect('DwarfBombLargeGold', count('💴'))
  addEffect('DwarfBombGold', count('💰'))
  addEffect('DwarfBombDiamond', count('💎'))
  addEffect('DwarfBombTreasure', count('🥕'))
  addEffect('DwarfBombPickaxe', count('⛏️'))
  addEffect('DwarfBombDynamite', count('🧨'))
  addEffect('DwarfBombDaysBunny', day)

  return effects
}
