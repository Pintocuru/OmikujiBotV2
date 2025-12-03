// src/wordPartySelector.ts
import { GameResult } from './gameConfig'
import { PostActionWordPartyType } from '@/types/'

/**
 * WordParty抽選を管理するクラス
 * 配当額に応じて適切なWordPartyエフェクトを選択する
 */
export class WordPartySelector {
  /**
   * ゲーム結果に基づいてWordPartyアクションを選択する
   */
  selectWordParties(result: GameResult): PostActionWordPartyType[] {
    const parties: PostActionWordPartyType[] = []

    // 50枚未満は演出なし
    if (result.payout < 50) {
      return parties
    }

    if (result.payout < 100) {
      this.addSmallWinEffects(parties, result.payout)
    } else if (result.payout < 1000) {
      this.addMediumWinEffects(parties, result)
    } else if (result.payout < 10000) {
      this.addLargeWinEffects(parties, result)
    } else {
      this.addMaxWinEffects(parties)
    }

    return parties
  }

  /**
   * 小当たり時のエフェクト (50-99枚)
   */
  private addSmallWinEffects(parties: PostActionWordPartyType[], payout: number): void {
    const fujinProbability = Math.min(Math.max(payout / 200, 0), 1)
    
    if (Math.random() < fujinProbability) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: 3.2,
        wordParty: 'MultiplyBonanzaFujin'
      })
    }
  }

  /**
   * 中当たり時のエフェクト (100-999枚)
   */
  private addMediumWinEffects(parties: PostActionWordPartyType[], result: GameResult): void {
    // シンボル数に応じたCracker演出
    if (result.attempt >= 2) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: 3.5,
        wordParty: 'MultiplyBonanzaCracker2'
      })
    }

    // 風神の抽選
    const fujinProbability = Math.min(Math.max(result.payout / 1000, 0), 1)
    if (Math.random() < fujinProbability) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: 3.2,
        wordParty: 'MultiplyBonanzaFujin'
      })
    }

    // ブースト時は雷神
    if (result.hasBoost) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: 3.5,
        wordParty: 'MultiplyBonanzaRaijin'
      })
    }
  }

  /**
   * 大当たり時のエフェクト (1000-9999枚)
   */
  private addLargeWinEffects(parties: PostActionWordPartyType[], result: GameResult): void {
    // シンボル数に応じたCracker演出
    if (result.attempt >= 2) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: 3.5,
        wordParty: 'MultiplyBonanzaCracker2'
      })
    }
    if (result.attempt >= 3) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: 3.8,
        wordParty: 'MultiplyBonanzaCracker3'
      })
    }

    // ブースト時は雷神
    if (result.hasBoost) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: 3.2,
        wordParty: 'MultiplyBonanzaRaijin'
      })
    }

    // 風神の抽選
    const fujinProbability = Math.min(Math.max(result.payout / 10000, 0), 1)
    if (Math.random() < fujinProbability) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: 3.5,
        wordParty: 'MultiplyBonanzaFujin'
      })
    }
  }

  /**
   * MAX WIN時のエフェクト (10000枚以上)
   */
  private addMaxWinEffects(parties: PostActionWordPartyType[]): void {
    // 全ての演出を表示
    parties.push(
      {
        actionType: 'wordParty',
        delaySeconds: 3.5,
        wordParty: 'MultiplyBonanzaCracker2'
      },
      {
        actionType: 'wordParty',
        delaySeconds: 3.8,
        wordParty: 'MultiplyBonanzaCracker3'
      },
      {
        actionType: 'wordParty',
        delaySeconds: 3.8,
        wordParty: 'MultiplyBonanzaFujin'
      },
      {
        actionType: 'wordParty',
        delaySeconds: 3.8,
        wordParty: 'MultiplyBonanzaRaijin'
      }
    )
  }
}