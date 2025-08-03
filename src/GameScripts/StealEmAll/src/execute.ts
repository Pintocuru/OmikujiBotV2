// src/execute.ts
import { GameSettings, GameParams, GamePlaceholder, GameResult } from './params';
import { ScriptResult, ScriptClass } from '@type/index';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { GameStateExtras, UserRankingType } from '@/GameScripts/LogRank/src/params';
import LogRankScript from '@/GameScripts/LogRank/src/execute';

// ゲーム設定
const MAX_WIN = 20000;
const PLAYER_INITIAL_LIFE = 4;
const ATTACKS_PER_TURN = 3;

// 攻撃確率
const ATTACK_PROBABILITIES = {
 DENOMINATOR: 15, // 分母
 CRITICAL: 1, // クリティカル(ダメージ2)
 NORMAL: 2 // 通常(ダメージ1)
} as const;

// 攻撃効果
const ATTACK_EFFECTS = {
 CRITICAL: { damage: 2, heal: 2 },
 NORMAL: { damage: 1, heal: 1 },
 MISS: { damage: 0, heal: 0 }
} as const;

// 敵のテーブル
const ENEMY_PATTERNS = [
 { weight: 9, enemyLife: [2, 2, 2, 3, 4, 5, 6, 12], name: '通常A' },
 { weight: 8, enemyLife: [2, 3, 2, 3, 5, 4, 6, 12], name: '通常B' },
 { weight: 7, enemyLife: [1, 1, 2, 4, 5, 7, 8, 12], name: '前半チャンスA' },
 { weight: 6, enemyLife: [1, 1, 1, 2, 7, 8, 9, 12], name: '前半チャンスB' },
 { weight: 5, enemyLife: [3, 5, 7, 4, 4, 3, 3, 12], name: '後半チャンスA' },
 { weight: 4, enemyLife: [5, 6, 7, 4, 3, 2, 1, 12], name: '後半チャンスB' },
 { weight: 3, enemyLife: [4, 4, 4, 4, 4, 4, 4, 12], name: '同じ敵' },
 { weight: 2, enemyLife: [10, 1, 1, 1, 1, 1, 1, 12], name: 'ソードマスターヤマト' }
] as const;

// 報酬テーブル
const STAGE_REWARDS = [10, 50, 100, 500, 1000, 5000, 10000] as const;

// 勝利メッセージテーブル
const WIN_MESSAGES = [
 [MAX_WIN, '🌟MAX WIN🌟 上限の'],
 [10000, '👑JACKPOT👑'],
 [5000, '💎EPIC WIN💎'],
 [2500, '♕FEVER♕'],
 [1000, '🎯大当り🎯'],
 [500, '✌あたり✌']
] as const;

type EnemyPattern = (typeof ENEMY_PATTERNS)[number];
type AttackType = keyof typeof ATTACK_EFFECTS;

interface BattleResult {
 playerLife: number;
 enemyLife: number;
}

export class ExecuteScript
 implements ScriptClass<GameSettings, GameParams, GamePlaceholder, UserRankingType, GameStateExtras>
{
 private settings: GameSettings = { isParty: 'ON' };
 private LogRank = LogRankScript;

 setup(settings: GameSettings): void {
  this.settings = settings;
  this.LogRank.setup({ rankMode: 'point' });
 }

 run(comment: Comment, params: GameParams): ScriptResult<GamePlaceholder, UserRankingType> {
  const userName = comment?.data.displayName ?? 'Unknown';
  const result = this.playGame();
  const message = this.createMessage(userName, result);

  const rankResult = this.LogRank.run(comment, {
   enableCount: params.enableCount,
   isWin: false,
   getPoint: result.payout
  });

  return {
   // TODO:settings.isPartyの実装(まだWordPartyができてない)
   postActions: [],
   placeholders: {
    message,
    stage: result.stage,
    payout: String(result.payout),
    winsRank: rankResult.placeholders.winsRank
   },
   rankingList: rankResult.rankingList
  };
 }

 public playGameForTest(): GameResult {
  return this.playGame();
 }

 private playGame(): GameResult {
  const enemyPattern = this.selectEnemyPattern();
  const { stage, payout, ways } = this.executeAdventure(enemyPattern);

  return {
   stage: String(stage),
   name: enemyPattern.name,
   ways,
   payout
  };
 }

 private selectEnemyPattern(): EnemyPattern {
  const totalWeight = ENEMY_PATTERNS.reduce((sum, pattern) => sum + pattern.weight, 0);
  const randomValue = Math.random() * totalWeight;
  let accumulatedWeight = 0;

  for (const pattern of ENEMY_PATTERNS) {
   accumulatedWeight += pattern.weight;
   if (randomValue <= accumulatedWeight) {
    return pattern;
   }
  }

  return ENEMY_PATTERNS[0];
 }

 private executeAdventure(enemyPattern: EnemyPattern) {
  let playerLife = PLAYER_INITIAL_LIFE;
  let totalPayout = 0;
  let baseReward = 1;
  let currentStage = 0;
  const stageRewards: number[] = [];

  // 初期報酬
  const initialReward = this.getRandomReward(1, 10);
  totalPayout += initialReward;
  stageRewards.push(initialReward);

  // 各ステージの戦闘
  for (const enemyLife of enemyPattern.enemyLife) {
   if (playerLife <= 0) break;

   const battleResult = this.executeBattle(playerLife, enemyLife);
   playerLife = battleResult.playerLife;

   if (playerLife <= 0) break;

   if (battleResult.enemyLife <= 0) {
    currentStage++;

    // 最終ステージクリア時はMAX WIN
    if (currentStage >= enemyPattern.enemyLife.length) {
     totalPayout = MAX_WIN;
     stageRewards.push(MAX_WIN); // MAX WIN報酬を追加
     break;
    }

    // ステージ報酬の計算
    const stageReward = this.calculateStageReward(currentStage, battleResult.enemyLife, baseReward);
    totalPayout += stageReward;
    stageRewards.push(stageReward);
    baseReward = totalPayout;
   }
  }

  return {
   stage: currentStage,
   payout: totalPayout,
   ways: stageRewards
  };
 }

 private executeBattle(playerLife: number, enemyLife: number): BattleResult {
  let currentPlayerLife = playerLife;
  let currentEnemyLife = enemyLife;

  while (currentPlayerLife > 0 && currentEnemyLife > 0) {
   // 3回攻撃のターン
   for (let attack = 0; attack < ATTACKS_PER_TURN; attack++) {
    const attackType = this.determineAttackType();
    const effect = ATTACK_EFFECTS[attackType];

    currentEnemyLife -= effect.damage;
    currentPlayerLife += effect.heal;

    if (currentEnemyLife <= 0) break;
   }

   // ターン終了後に体力消費
   currentPlayerLife--;
  }

  return {
   playerLife: currentPlayerLife,
   enemyLife: currentEnemyLife
  };
 }

 private determineAttackType(): AttackType {
  const roll = Math.random() * ATTACK_PROBABILITIES.DENOMINATOR;

  if (roll < ATTACK_PROBABILITIES.CRITICAL) {
   return 'CRITICAL';
  } else if (roll < ATTACK_PROBABILITIES.CRITICAL + ATTACK_PROBABILITIES.NORMAL) {
   return 'NORMAL';
  } else {
   return 'MISS';
  }
 }

 private calculateStageReward(stage: number, overkillDamage: number, baseReward: number): number {
  const maxReward = STAGE_REWARDS[Math.min(stage - 1, STAGE_REWARDS.length - 1)];

  if (overkillDamage < 0) {
   // オーバーキルボーナス
   const multiplier = 2 ** Math.abs(overkillDamage);
   const bonusReward = Math.min(maxReward, baseReward * multiplier);
   return this.getRandomReward(baseReward, bonusReward);
  }

  return this.getRandomReward(baseReward, maxReward);
 }

 private getRandomReward(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
 }

 private createMessage(userName: string, result: GameResult): string {
  const winMessage = this.getWinMessage(result.payout);
  const stageProgress = result.ways.join('/');

  return `${userName}のダンジョン攻略! ${stageProgress}! ${winMessage}合計${result.payout}枚獲得!`;
 }

 private getWinMessage(payout: number): string {
  const winMessageEntry = WIN_MESSAGES.find(([threshold]) => payout >= threshold);
  return winMessageEntry ? winMessageEntry[1] : '';
 }
}

const execute = new ExecuteScript();
export default execute;
