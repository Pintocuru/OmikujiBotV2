// src/GameScripts/scripts/GouseiSuika/game.ts
import { PostFlowWordPartyType } from '@/types'
import { GAME_CONFIGS, GAME_CONSTANTS, GameConfigDetails, GameConfigItem, GameResult } from './gameConfigs'
import { GameParams } from './params'

/**
 * ガチャゲームのロジックを管理するクラス
 */
export class GachaGame {
  private totalPoints = 0
  private postArray: PostFlowWordPartyType[] = []
  private readonly gameConfig: GameConfigDetails

  constructor(private readonly params: GameParams) {
    this.gameConfig = GAME_CONFIGS[params.mode]
    this.initializeEffects()
  }

  /**
   * ゲームをプレイして結果を返す
   */
  play(): GameResult {
    this.playSmallItems()
    this.playBigItems()

    return {
      points: this.calculateFinalScore(),
      postArray: this.postArray,
    }
  }

  /**
   * 初期エフェクトを設定
   */
  private initializeEffects(): void {
    this.postArray = [
      {
        actionType: 'wordParty',
        delaySeconds: GAME_CONSTANTS.EMOJI_DELAY,
        wordParty: this.params.mode === 'クジラ' ? 'GouseiSuikaMarimo' : 'GouseiSuikaCherry',
      },
    ]
  }

  /**
   * 小さいアイテムの抽選を実行
   */
  private playSmallItems(): void {
    for (const item of this.gameConfig.small) {
      const lottery = new ItemLottery(item)
      const result = lottery.draw()

      this.totalPoints += result.pointsEarned
      this.addEmojiEffects(item.party, result.wins)
    }
  }

  /**
   * 大きいアイテムの抽選を実行
   */
  private playBigItems(): void {
    let life = this.params.life ?? GAME_CONSTANTS.INITIAL_LIFE

    while (life > 0) {
      const selectedItem = this.selectBigItem()

      this.totalPoints += selectedItem.points
      life -= selectedItem.damage ?? 0
      this.addEffect(selectedItem.party)
    }
  }

  /**
   * 大きいアイテムを選択する
   */
  private selectBigItem(): GameConfigItem {
    for (const item of this.gameConfig.big) {
      if (Math.random() * 100 < item.chance) {
        return item
      }
    }
    // どれにも当選しなかった場合、最後のアイテムを返す
    return this.gameConfig.big[this.gameConfig.big.length - 1]
  }

  /**
   * 絵文字エフェクトを追加
   */
  private addEmojiEffects(party: string, wins: number): void {
    const halfWins = Math.floor(wins / GAME_CONSTANTS.HALF_DIVISOR)
    for (let i = 0; i < halfWins; i++) {
      this.addEffect(party)
    }
  }

  /**
   * エフェクトを追加
   */
  private addEffect(party: string): void {
    this.postArray.push({ actionType: 'wordParty', delaySeconds: GAME_CONSTANTS.EMOJI_DELAY, wordParty: party })
  }

  /**
   * 最終スコアを計算
   */
  private calculateFinalScore(): number {
    const { MIN, MAX } = GAME_CONSTANTS.SCORE_MULTIPLIER
    const multiplier = MIN + Math.random() * (MAX - MIN)
    return Math.ceil(this.totalPoints * multiplier)
  }
}

/**
 * アイテム抽選を管理するクラス
 */
export class ItemLottery {
  constructor(private readonly item: GameConfigItem) {}

  /**
   * 抽選を実行
   */
  draw(): { pointsEarned: number; wins: number } {
    let pointsEarned = 0
    let wins = 0
    const times = this.item.times ?? 0

    for (let i = 0; i < times; i++) {
      if (this.isWin()) {
        pointsEarned += this.item.points
        wins++
      }
    }
    return { pointsEarned, wins }
  }

  /**
   * 当選判定
   */
  private isWin(): boolean {
    return Math.random() * 100 < this.item.chance
  }
}
