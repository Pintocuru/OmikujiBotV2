// src/game.ts
import { PostActionWordPartyType } from '@/types/OmikujiData/OmikujiSchema'
import { RewardType, Dwarf, GameResult, GAME_CONFIG } from './gameConfigs'

export class BomberSpinGame {
  playGame(userName: string): GameResult {
    const dwarfs = this.createDwarfs()
    let life: number = GAME_CONFIG.INITIAL_LIFE
    let items = ''
    let day = 0

    // ゲームループ
    while (this.getTotalGold(dwarfs) <= GAME_CONFIG.MAX_WIN && Math.random() * 10 < life) {
      day++
      life--

      const dwarf = dwarfs[Math.floor(Math.random() * GAME_CONFIG.DWARF_COUNT)]
      const rewardType = this.selectReward()

      items += this.applyReward(dwarf, dwarfs, rewardType, life)

      // 緑宝箱でライフ回復
      if (rewardType === RewardType.GREEN_CHEST) {
        life = GAME_CONFIG.GREEN_RECOVERY
      }

      this.applySpecialEffects(dwarfs)
    }

    // ゲーム終了後、applySpecialEffects を2回行う
    for (let i = 0; i < 2; i++) {
      // MAX_WIN を超えていないか都度判定
      if (this.getTotalGold(dwarfs) <= GAME_CONFIG.MAX_WIN) {
        this.applySpecialEffects(dwarfs)
      } else {
        break // 超えたら打ち切り
      }
    }

    const payout = Math.min(this.getTotalGold(dwarfs), GAME_CONFIG.MAX_WIN)
    const message = this.createMessage(userName, day, dwarfs, items, payout)

    return { day, payout, message, dwarfs, items }
  }

  /**
   * ゲーム結果に基づいて演出効果を生成する
   */
  generatePartyEffects(gameResult: GameResult): PostActionWordPartyType[] {
    const { dwarfs, items, day } = gameResult
    const effects: PostActionWordPartyType[] = []

    // 共通 push 用ヘルパー
    const addEffect = (wordParty: string, times = 1) => {
      for (let i = 0; i < times; i++) {
        effects.push({ actionType: 'wordParty', delaySeconds: 3, wordParty })
      }
    }

    // dwarfs 条件
    if (dwarfs.some((d) => d.hasDynamite)) addEffect('!dwarfBombDynamite')
    addEffect('!dwarfBombPickaxe', dwarfs.filter((d) => d.hasRed).length)

    // items 条件
    const goldCount = (items.match(/💰/g) || []).length
    const diamondCount = (items.match(/💎/g) || []).length
    const treasureCount = (items.match(/🎁/g) || []).length
    addEffect('!dwarfBombGold', goldCount)
    addEffect('!dwarfBombDiamond', diamondCount)
    addEffect('!dwarfBombTreasure', treasureCount)

    // day 条件
    addEffect('!dwarfBombDaysBunny', day)

    return effects
  }

  private createDwarfs(): Dwarf[] {
    return Array(GAME_CONFIG.DWARF_COUNT)
      .fill(null)
      .map(() => ({
        gold: 0,
        redChest: 0,
        hasRed: false,
        hasDynamite: false,
      }))
  }

  private getTotalGold(dwarfs: Dwarf[]): number {
    return dwarfs.reduce((sum, d) => sum + d.gold + d.redChest, 0)
  }

  private selectReward(): RewardType {
    const totalWeight = GAME_CONFIG.REWARD_ITEMS.reduce((sum, item) => sum + item.weight, 0)
    const rand = Math.random() * totalWeight
    let sum = 0

    const index = GAME_CONFIG.REWARD_ITEMS.findIndex((item) => (sum += item.weight) > rand)
    return index as RewardType
  }

  private applyReward(dwarf: Dwarf, dwarfs: Dwarf[], rewardType: RewardType, life: number): string {
    switch (rewardType) {
      case RewardType.UNKO:
        dwarf.gold += 1
        break

      case RewardType.MEDIUM_GOLD:
        dwarf.gold += this.getGoldAmount('mediumGold')
        break

      case RewardType.LARGE_GOLD:
        dwarf.gold += this.getGoldAmount('largeGold')
        break

      case RewardType.GOLD_MULTIPLIER:
        const goldMultiplier = this.getGoldAmount('goldMultiplier')
        dwarf.gold = Math.max(1, dwarf.gold * goldMultiplier)
        return dwarf.gold > 1 ? '💰' : ''

      case RewardType.DIAMOND_MULTIPLIER:
        const diamondMultiplier = this.getGoldAmount('diamondMultiplier')
        dwarf.gold = Math.max(1, dwarf.gold * diamondMultiplier)
        return dwarf.gold > 1 ? '💎' : ''

      case RewardType.GREEN_CHEST: // 緑宝箱
        dwarfs.forEach((d) => {
          if (d !== dwarf) {
            dwarf.gold += d.gold
            d.gold = 0
          }
        })
        return '🎁'

      case RewardType.RED_CHEST: // 赤宝箱(ツルハシ)
        if (!dwarf.hasRed) {
          dwarf.hasRed = true
        } else {
          dwarf.gold += 1
        }
        break

      case RewardType.DYNAMITE: // ダイナマイト
        if (!dwarf.hasDynamite) {
          dwarf.hasDynamite = true
        } else {
          dwarf.gold += 1
        }
        break
    }
    return ''
  }

  private getGoldAmount(rewardKey: keyof typeof GAME_CONFIG.GOLD_REWARDS): number {
    const CONFIG = GAME_CONFIG.GOLD_REWARDS[rewardKey]
    const selectedIndex = this.weightedSelect(CONFIG.weights)
    return CONFIG.amounts[selectedIndex]
  }

  private weightedSelect(weights: readonly number[]): number {
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    const rand = Math.random() * totalWeight
    let sum = 0
    return weights.findIndex((w) => (sum += w) > rand)
  }

  private applySpecialEffects(dwarfs: Dwarf[]): void {
    dwarfs.forEach((dwarf, i) => {
      if (dwarf.hasRed) {
        dwarf.redChest += dwarf.gold
      }
      if (dwarf.hasDynamite) {
        dwarfs.forEach((other, j) => {
          if (i !== j) {
            dwarf.gold += other.gold
          }
        })
      }
    })
  }

  private createMessage(user: string, day: number, dwarfs: Dwarf[], items: string, payout: number): string {
    const hasSpecial = dwarfs.some((d) => d.hasDynamite || d.hasRed)
    const winType = GAME_CONFIG.WIN_THRESHOLDS.find(([threshold]) => payout >= threshold)?.[1] || '合計'
    const goldText = dwarfs.map((d, i) => (i === 2 ? `${d.gold + d.redChest}!` : `${d.gold + d.redChest}/`)).join('')

    let msg = `${user}は🐰${day}匹`
    if (hasSpecial) {
      msg += 'と'
      if (dwarfs.some((d) => d.hasDynamite)) msg += 'TNT🧨'
      if (dwarfs.some((d) => d.hasDynamite && d.hasRed)) msg += 'と'
      if (dwarfs.some((d) => d.hasRed)) msg += 'ツルハシ⛏️'
    }
    msg += `と鉱山へ${items || '。'}${goldText}${winType}${payout}枚獲得!`

    return msg
  }
}
