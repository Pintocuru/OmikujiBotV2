// src/GameScripts/scripts/MultiplyBonanza/wordPartySelector.ts
import { GameResult } from './gameConfig'
import { PostFlowWordPartyType } from '@/types'

/**
 * WordParty演出の設定
 */
export const WORD_PARTY_CONFIG = {
  // 配当の閾値
  THRESHOLDS: {
    SMALL_WIN: 50, // 小当たり開始
    MEDIUM_WIN: 100, // 中当たり開始
    LARGE_WIN: 1000, // 大当たり開始
    MAX_WIN: 10000, // MAX WIN開始
  },

  // 確率計算の係数
  PROBABILITY_FACTORS: {
    SMALL_FUJIN: 200, // 小当たり時の風神確率 (payout/200)
    MEDIUM_FUJIN: 1000, // 中当たり時の風神確率 (payout/1000)
    LARGE_FUJIN: 10000, // 大当たり時の風神確率 (payout/10000)
  },

  // 演出の遅延時間
  DELAY_SECONDS: {
    BASE_PARTY: 1,
    CRACKER1: 3.2,
    CRACKER2: 3.5,
    CRACKER3: 3.8,
    FUJIN: 3.2,
    RAIJIN: 3.5,
    MAX_WIN_EFFECTS: 3.8,
  },

  // シンボル数に応じた演出の閾値
  SYMBOL_THRESHOLDS: {
    CRACKER2: 2, // Cracker2が出る最小シンボル数
    CRACKER3: 3, // Cracker3が出る最小シンボル数
  },
} as const

/**
 * WordParty抽選を管理するクラス
 * 配当額に応じて適切なWordPartyエフェクトを選択する
 */
export class WordPartySelector {
  /**
   * ゲーム結果に基づいてWordPartyアクションを選択する
   */
  selectWordParties(result: GameResult): PostFlowWordPartyType[] {
    const parties: PostFlowWordPartyType[] = []
    const { payout } = result
    const { THRESHOLDS } = WORD_PARTY_CONFIG

    // 50枚未満は演出なし
    if (payout < THRESHOLDS.SMALL_WIN) {
      return parties
    }

    if (payout < THRESHOLDS.MEDIUM_WIN) {
      this.addSmallWinEffects(parties, payout)
    } else if (payout < THRESHOLDS.LARGE_WIN) {
      this.addMediumWinEffects(parties, result)
    } else if (payout < THRESHOLDS.MAX_WIN) {
      this.addLargeWinEffects(parties, result)
    } else {
      this.addMaxWinEffects(parties)
    }

    return parties
  }

  /**
   * 小当たり時のエフェクト (50-99枚)
   */
  private addSmallWinEffects(parties: PostFlowWordPartyType[], payout: number): void {
    const { PROBABILITY_FACTORS, DELAY_SECONDS } = WORD_PARTY_CONFIG
    const fujinProbability = Math.min(Math.max(payout / PROBABILITY_FACTORS.SMALL_FUJIN, 0), 1)

    if (Math.random() < fujinProbability) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.FUJIN,
        wordParty: 'MultiplyBonanzaFujin',
      })
    }
  }

  /**
   * 中当たり時のエフェクト (100-999枚)
   */
  private addMediumWinEffects(parties: PostFlowWordPartyType[], result: GameResult): void {
    const { PROBABILITY_FACTORS, DELAY_SECONDS, SYMBOL_THRESHOLDS } = WORD_PARTY_CONFIG

    // シンボル数に応じたCracker演出
    if (result.attempt >= SYMBOL_THRESHOLDS.CRACKER2) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.CRACKER2,
        wordParty: 'MultiplyBonanzaCracker2',
      })
    }

    // 風神の抽選
    const fujinProbability = Math.min(Math.max(result.payout / PROBABILITY_FACTORS.MEDIUM_FUJIN, 0), 1)
    if (Math.random() < fujinProbability) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.FUJIN,
        wordParty: 'MultiplyBonanzaFujin',
      })
    }

    // ブースト時は雷神
    if (result.hasBoost) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.RAIJIN,
        wordParty: 'MultiplyBonanzaRaijin',
      })
    }
  }

  /**
   * 大当たり時のエフェクト (1000-9999枚)
   */
  private addLargeWinEffects(parties: PostFlowWordPartyType[], result: GameResult): void {
    const { PROBABILITY_FACTORS, DELAY_SECONDS, SYMBOL_THRESHOLDS } = WORD_PARTY_CONFIG

    // シンボル数に応じたCracker演出
    if (result.attempt >= SYMBOL_THRESHOLDS.CRACKER2) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.CRACKER2,
        wordParty: 'MultiplyBonanzaCracker2',
      })
    }
    if (result.attempt >= SYMBOL_THRESHOLDS.CRACKER3) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.CRACKER3,
        wordParty: 'MultiplyBonanzaCracker3',
      })
    }

    // ブースト時は雷神
    if (result.hasBoost) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.FUJIN,
        wordParty: 'MultiplyBonanzaRaijin',
      })
    }

    // 風神の抽選
    const fujinProbability = Math.min(Math.max(result.payout / PROBABILITY_FACTORS.LARGE_FUJIN, 0), 1)
    if (Math.random() < fujinProbability) {
      parties.push({
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.RAIJIN,
        wordParty: 'MultiplyBonanzaFujin',
      })
    }
  }

  /**
   * MAX WIN時のエフェクト (10000枚以上)
   */
  private addMaxWinEffects(parties: PostFlowWordPartyType[]): void {
    const { DELAY_SECONDS } = WORD_PARTY_CONFIG

    // 全ての演出を表示
    parties.push(
      {
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.CRACKER2,
        wordParty: 'MultiplyBonanzaCracker2',
      },
      {
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.CRACKER3,
        wordParty: 'MultiplyBonanzaCracker3',
      },
      {
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.MAX_WIN_EFFECTS,
        wordParty: 'MultiplyBonanzaFujin',
      },
      {
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.MAX_WIN_EFFECTS,
        wordParty: 'MultiplyBonanzaRaijin',
      },
      {
        actionType: 'wordParty',
        delaySeconds: DELAY_SECONDS.MAX_WIN_EFFECTS,
        wordParty: 'MultiplyBonanzaSakura',
      }
    )
  }
}
