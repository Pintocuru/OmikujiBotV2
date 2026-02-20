// src/GameScripts/scripts/DwarfBomb/game.ts
// ! 使用しない(バックアップ用)
import { PostFlowWordPartyType } from '@/types/OmikujiData/'
import { RewardType, Dwarf, GameResult, GAME_CONFIG } from './game/gameConfigs'

export class DwarfBomb {
  playGame(userName: string, mode: string = ''): GameResult {
    const dwarfs = this.createDwarfs(mode)
    let life: number = GAME_CONFIG.INITIAL_LIFE
    let items = ''
    let day = 0
    let specialEffectCount = 0

    // ゲームループ
    while (this.getTotalGold(dwarfs) <= GAME_CONFIG.MAX_WIN && Math.random() * 10 < life) {
      day++
      life--

      const dwarf = dwarfs[Math.floor(Math.random() * GAME_CONFIG.DWARF_COUNT)]
      const rewardType = this.selectReward()

      items += this.applyReward(dwarf, dwarfs, rewardType)

      // 緑宝箱でライフ回復
      if (rewardType === RewardType.GREEN_CHEST) {
        life = GAME_CONFIG.GREEN_RECOVERY
      }

      items += this.applySpecialEffects(dwarfs)
      // 特殊効果を持つdwarfがいる場合のみカウント
      if (dwarfs.some((d) => d.hasDynamite || d.hasRed)) {
        specialEffectCount++
      }
    }

    // ゲーム終了後、applySpecialEffects を2回行う
    for (let i = 0; i < 2; i++) {
      // MAX_WIN を超えていないか都度判定
      // 超えていてもずっと行っていい(上限は変わらないので)
      if (this.getTotalGold(dwarfs) <= GAME_CONFIG.MAX_WIN || 1) {
        items += this.applySpecialEffects(dwarfs)
        // 特殊効果を持つdwarfがいる場合のみカウント
        if (dwarfs.some((d) => d.hasDynamite || d.hasRed)) {
          specialEffectCount++
        }
      } else {
        break // 超えたら打ち切り
      }
    }

    const payout = Math.min(this.getTotalGold(dwarfs), GAME_CONFIG.MAX_WIN)
    const message = this.createMessage(userName, day, dwarfs, items, payout)

    return { day, payout, message, dwarfs, items, specialEffectCount }
  }

  /**
   * ゲーム結果に基づいて演出効果を生成する
   */
  generatePartyEffects(gameResult: GameResult): PostFlowWordPartyType[] {
    const { items, day } = gameResult
    const effects: PostFlowWordPartyType[] = []

    // 共通 push 用ヘルパー
    const addEffect = (wordParty: string, times = 1) => {
      for (let i = 0; i < times; i++) {
        effects.push({ actionType: 'wordParty', delaySeconds: 2.7, wordParty })
      }
    }

    // items 条件
    const coinCount = (items.match(/🪙/g) || []).length
    addEffect('DwarfBombMediumGold', coinCount)
    const dollCount = (items.match(/💴/g) || []).length
    addEffect('DwarfBombLargeGold', dollCount)

    // items 条件
    const goldCount = (items.match(/💰/g) || []).length
    const diamondCount = (items.match(/💎/g) || []).length
    const treasureCount = (items.match(/🥕/g) || []).length
    addEffect('DwarfBombGold', goldCount)
    addEffect('DwarfBombDiamond', diamondCount)
    addEffect('DwarfBombTreasure', treasureCount)

    // dwarfs 条件
    const pickaxeCount = (items.match(/⛏️/g) || []).length
    addEffect('DwarfBombPickaxe', pickaxeCount)
    const dynamiteCount = (items.match(/🧨/g) || []).length
    addEffect('DwarfBombDynamite', dynamiteCount)

    // day 条件
    addEffect('DwarfBombDaysBunny', day)

    return effects
  }

  private createDwarfs(mode: string): Dwarf[] {
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

  private applyReward(dwarf: Dwarf, dwarfs: Dwarf[], rewardType: RewardType): string {
    switch (rewardType) {
      case RewardType.UNKO:
        dwarf.gold += 1
        break

      case RewardType.MEDIUM_GOLD:
        dwarf.gold += this.getGoldAmount('mediumGold')
        return '🪙'

      case RewardType.LARGE_GOLD:
        dwarf.gold += this.getGoldAmount('largeGold')
        return '💴'

      case RewardType.GOLD_MULTIPLIER:
        const goldMultiplier = this.getGoldAmount('goldMultiplier')
        const beforeGold = dwarf.gold
        dwarf.gold = Math.max(1, dwarf.gold * goldMultiplier)
        if (dwarf.gold > beforeGold) {
          const digits = Math.floor(Math.log10(dwarf.gold))
          return '💰'.repeat(digits * digits)
        }
        return ''

      case RewardType.DIAMOND_MULTIPLIER:
        const diamondMultiplier = this.getGoldAmount('diamondMultiplier')
        const beforeDiamond = dwarf.gold
        dwarf.gold = Math.max(1, dwarf.gold * diamondMultiplier)
        if (dwarf.gold > beforeDiamond) {
          const digits = Math.floor(Math.log10(dwarf.gold))
          return '💎'.repeat(digits * digits)
        }
        return ''

      case RewardType.GREEN_CHEST: // 緑宝箱
        dwarfs.forEach((d) => {
          if (d !== dwarf) {
            dwarf.gold += d.gold
            d.gold = 0
          }
        })
        return '🥕'

      case RewardType.RED_CHEST: // 赤宝箱(ツルハシ)
        if (!dwarf.hasRed) {
          dwarf.hasRed = true
        } else {
          dwarf.gold += 1
        }
        break

      case RewardType.DYNAMITE: // TNT
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

  // 桁数に応じた絵文字の文字列を生成するヘルパー関数
  private getEmojiString = (increaseAmount: number, emoji: string): string => {
    const digits = String(increaseAmount).length

    if (digits === 1) {
      return ' ' // 1桁なら空白
    } else if (digits === 2) {
      return emoji // 2桁なら1つ
    } else if (digits === 3) {
      return emoji + emoji // 3桁なら2つ
    } else {
      // 4桁以上なら4つ（ご要望に合わせて最大4つとします）
      return emoji.repeat(4)
    }
  }

  private applySpecialEffects(dwarfs: Dwarf[]): string {
    // 1. 特殊効果適用前の値を保持
    const initialStates = dwarfs.map((dwarf) => ({
      initialRedChest: dwarf.redChest,
      initialGold: dwarf.gold,
    }))

    // 2. 特殊効果を適用
    //    dwarf.hasRed の処理を先に実行し、その増加値を計算
    //    このループで dwarf.redChest が更新されます
    dwarfs.forEach((dwarf) => {
      if (dwarf.hasRed) {
        dwarf.redChest += dwarf.gold
      }
    })

    // 3. hasRed による増加値を計算し、返り値の文字列を生成（前半）
    let redEmojiString = ''
    initialStates.forEach((initialState, i) => {
      const currentDwarf = dwarfs[i]
      // hasRed による redChest の増加量 = 適用後の値 - 適用前の値
      const increaseRed = currentDwarf.redChest - initialState.initialRedChest
      if (increaseRed > 0) {
        // 増加があった場合にのみ、その増加量に基づいて絵文字を決定
        redEmojiString += this.getEmojiString(increaseRed, '⛏️')
      }
      // hasRed の処理で gold は変化していませんが、hasDynamite の増加量計算のために
      // gold の初期値を更新（この時点での currentDwarf.gold は initialState.initialGold と同じ）
      initialState.initialGold = currentDwarf.gold
    })

    // ---

    // 4. hasDynamite の特殊効果を適用
    //    このループで dwarf.gold が更新されます
    dwarfs.forEach((dwarf, i) => {
      if (dwarf.hasDynamite) {
        dwarfs.forEach((other, j) => {
          if (i !== j) {
            dwarf.gold += other.gold // other.gold は hasRed 適用前の値
          }
        })
      }
    })

    // 5. hasDynamite による増加値を計算し、返り値の文字列を生成（後半）
    let dynamiteEmojiString = ''
    initialStates.forEach((initialState, i) => {
      const currentDwarf = dwarfs[i]
      // hasDynamite による gold の増加量 = 適用後の値 - hasRed適用後/hasDynamite適用前の値
      const increaseDynamite = currentDwarf.gold - initialState.initialGold
      if (increaseDynamite > 0) {
        // 増加があった場合にのみ、その増加量に基づいて絵文字を決定
        dynamiteEmojiString += this.getEmojiString(increaseDynamite, '🧨')
      }
    })

    // 6. 2つの文字列を結合して返す
    return redEmojiString + dynamiteEmojiString
  }

  private createMessage(user: string, day: number, dwarfs: Dwarf[], items: string, payout: number): string {
    const winType = GAME_CONFIG.WIN_THRESHOLDS.find(([threshold]) => payout >= threshold)?.[1] || '合計'
    const goldText = dwarfs.map((d, i) => (i === 2 ? `${d.gold + d.redChest}!` : `${d.gold + d.redChest}/`)).join('')

    let msg = `${user}は🐰${day}匹`
    msg += `と鉱山へ${items || '。'}${goldText}${winType}${payout}枚獲得!`

    return msg
  }
}
