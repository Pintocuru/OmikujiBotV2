// src/GameScripts/scripts/HugEmAll/game.ts
import {
  MAX_WIN,
  ATTACKS_PER_TURN,
  MODE_ATTACK_PROBABILITIES,
  MODE_ATTACK_EFFECTS,
  MODE_INITIAL_LIFE,
  MODE_LIFE_COST,
  ENEMY_PATTERNS,
  STAGE_REWARDS,
  WIN_MESSAGES,
  type GameMode,
  type EnemyPattern,
  type AttackType,
  type BattleResult,
  type GameResult,
} from './gameConfig'

export class GameEngine {
  /**
   * ゲームを実行する
   */
  playGame(mode: GameMode = ''): GameResult {
    const enemyPattern = this.selectEnemyPattern()
    const { stage, payout, ways } = this.executeAdventure(enemyPattern, mode)

    return {
      stage,
      name: enemyPattern.name,
      ways,
      payout,
    }
  }

  /**
   * 敵のパターンを選択する
   */
  private selectEnemyPattern(): EnemyPattern {
    const totalWeight = ENEMY_PATTERNS.reduce((sum, pattern) => sum + pattern.weight, 0)
    const randomValue = Math.random() * totalWeight
    let accumulatedWeight = 0

    for (const pattern of ENEMY_PATTERNS) {
      accumulatedWeight += pattern.weight
      if (randomValue <= accumulatedWeight) {
        return pattern
      }
    }

    return ENEMY_PATTERNS[0]
  }

  /**
   * ダンジョン攻略を実行する
   */
  private executeAdventure(enemyPattern: EnemyPattern, mode: GameMode) {
    let playerLife = MODE_INITIAL_LIFE[mode]
    let totalPayout = 0
    let baseReward = 1
    let currentStage = 0
    const stageRewards: number[] = []

    // 初期報酬
    const initialReward = this.getRandomReward(1, 10)
    totalPayout += initialReward
    stageRewards.push(initialReward)

    // 各ステージの戦闘
    for (const enemyLife of enemyPattern.enemyLife) {
      if (playerLife <= 0) break

      const battleResult = this.executeBattle(playerLife, enemyLife, mode)
      playerLife = battleResult.playerLife

      if (playerLife <= 0) break

      if (battleResult.enemyLife <= 0) {
        currentStage++

        // 最終ステージクリア時はMAX WIN
        if (currentStage >= enemyPattern.enemyLife.length) {
          totalPayout = MAX_WIN
          stageRewards.push(MAX_WIN)
          break
        }

        // ステージ報酬の計算
        const stageReward = this.calculateStageReward(currentStage, battleResult.enemyLife, baseReward)
        totalPayout += stageReward
        stageRewards.push(stageReward)
        baseReward = totalPayout
      }
    }

    return {
      stage: currentStage,
      payout: totalPayout,
      ways: stageRewards,
    }
  }

  /**
   * 戦闘を実行する
   */
  private executeBattle(playerLife: number, enemyLife: number, mode: GameMode): BattleResult {
    let currentPlayerLife = playerLife
    let currentEnemyLife = enemyLife
    const lifeCost = MODE_LIFE_COST[mode]

    while (currentPlayerLife > 0 && currentEnemyLife > 0) {
      // 3回攻撃のターン
      for (let attack = 0; attack < ATTACKS_PER_TURN; attack++) {
        const attackType = this.determineAttackType(mode)
        const effect = MODE_ATTACK_EFFECTS[mode][attackType]

        currentEnemyLife -= effect.damage
        currentPlayerLife += effect.heal

        if (currentEnemyLife <= 0) break
      }

      // ターン終了後に体力消費
      currentPlayerLife -= lifeCost
    }

    return {
      playerLife: currentPlayerLife,
      enemyLife: currentEnemyLife,
    }
  }

  /**
   * 攻撃タイプを決定する
   */
  private determineAttackType(mode: GameMode): AttackType {
    const probabilities = MODE_ATTACK_PROBABILITIES[mode]
    const roll = Math.random() * probabilities.DENOMINATOR

    if (roll < probabilities.CRITICAL) {
      return 'CRITICAL'
    } else if (roll < probabilities.CRITICAL + probabilities.NORMAL) {
      return 'NORMAL'
    } else {
      return 'MISS'
    }
  }

  /**
   * ステージ報酬を計算する
   */
  private calculateStageReward(stage: number, overkillDamage: number, baseReward: number): number {
    const maxReward = STAGE_REWARDS[Math.min(stage - 1, STAGE_REWARDS.length - 1)]

    if (overkillDamage < 0) {
      // オーバーキルボーナス
      const multiplier = 2 ** Math.abs(overkillDamage)
      const bonusReward = Math.min(maxReward, baseReward * multiplier)
      return this.getRandomReward(baseReward, bonusReward)
    }

    return this.getRandomReward(baseReward, maxReward)
  }

  /**
   * ランダムな報酬を取得する
   */
  private getRandomReward(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * メッセージを作成する
   */
  createMessage(userName: string, result: GameResult): string {
    const winMessage = this.getWinMessage(result.payout)
    const stageProgress = result.ways.join('/')

    return `${userName}のダンジョン攻略! ${stageProgress}! ${winMessage}合計${result.payout}枚獲得!`
  }

  /**
   * 勝利メッセージを取得する
   */
  private getWinMessage(payout: number): string {
    const winMessageEntry = WIN_MESSAGES.find(([threshold]) => payout >= threshold)
    return winMessageEntry ? winMessageEntry[1] : ''
  }
}
