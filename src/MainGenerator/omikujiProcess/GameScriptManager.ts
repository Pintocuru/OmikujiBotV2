// src/MainGenerator/utils/processors/GameScriptManager.ts
import { CommentRuleType, OmikujiDataType } from '@/types/';
import { ScriptClass, ScriptResult, UserStatsType, GameState } from '@/types/';
import { gameScriptMap } from '@/ScriptGame/ScriptGameMap';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export class GameScriptManager {
 private readonly scriptInstances: Record<string, ScriptClass> = {};
 private readonly gameStates: Record<string, GameState> = {};
 private readonly omikujiData: OmikujiDataType;

 // ランキングデータを適切な型で管理
 private rankingData: Record<string, UserStatsType[]> = {};

 constructor(omikujiData: OmikujiDataType) {
  this.omikujiData = omikujiData;
  this.initializeScripts();
 }

 /**
  * ゲームスクリプトの初期化
  */
 private initializeScripts(): void {
  try {
   for (const scriptId of this.getAvailableScriptIds()) {
    // すでに初期化済みならスキップ
    if (this.scriptInstances[scriptId]) continue;

    const scriptInstance = gameScriptMap[scriptId].execute;

    // 初期化処理
    scriptInstance.setup(this.omikujiData.scriptSettings[scriptId]);

    // インスタンスを保存
    this.scriptInstances[scriptId] = scriptInstance;

    // ゲーム状態の初期化
    this.gameStates[scriptId] = {
     ruleId: scriptId,
     totalDraws: 0,
     userStats: {},
     currentUserIds: []
    };

    // ランキングデータの初期化
    this.rankingData[scriptId] = [];
   }
  } catch (error) {
   console.error('スクリプト初期化エラー:', error);
  }
 }

 /**
  * omikujiData 内で使用されている有効な scriptId の一覧を返す
  */
 getAvailableScriptIds(): string[] {
  const scriptIds = new Set<string>();

  Object.values(this.omikujiData.comments).forEach((comment) => {
   if (comment.scriptId && gameScriptMap[comment.scriptId]) {
    scriptIds.add(comment.scriptId);
   }
  });

  return Array.from(scriptIds);
 }

 /**
  * スクリプトインスタンスを取得
  */
 getScriptInstance(scriptId: string): ScriptClass | null {
  return this.scriptInstances[scriptId] || null;
 }

 /**
  * ゲーム状態を取得
  */
 getGameState(scriptId: string): GameState | null {
  return this.gameStates[scriptId] || null;
 }

 /**
  * スクリプト実行
  */
 executeScript(comment: Comment, rule: CommentRuleType): ScriptResult | null {
  const { scriptId } = rule;

  if (!scriptId || !gameScriptMap[scriptId]) return null;

  const scriptInstance = this.getScriptInstance(scriptId);
  if (!scriptInstance) {
   console.warn(`スクリプトインスタンスが見つかりません: ${scriptId}`);
   return null;
  }

  try {
   // スクリプト実行
   const result = scriptInstance.run(comment, rule.scriptParams || {});

   // ランキングデータの更新
   const rankingList = scriptInstance.getGameState()?.userRankings;
   if (rankingList) {
    this.rankingData[scriptId] = rankingList;
    this.updateGameState(scriptId, rankingList);
   }

   return result;
  } catch (error) {
   console.error(`スクリプト実行エラー (${scriptId}):`, error);
   return null;
  }
 }

 /**
  * ゲーム状態の更新
  */
 private updateGameState(scriptId: string, rankingList: UserStatsType[]): void {
  const gameState = this.gameStates[scriptId];
  if (!gameState) return;

  // 総実行回数の更新
  gameState.totalDraws++;

  // ユーザー統計の更新
  for (const userStat of rankingList) {
   const userId = userStat.userId;

   // 新規ユーザーの場合は履歴に追加
   if (!gameState.currentUserIds.includes(userId)) {
    gameState.currentUserIds.push(userId);
   }

   // ユーザー統計の更新
   gameState.userStats[userId] = userStat;
  }
 }

 /**
  * スクリプトの再初期化
  */
 reinitializeScripts(): void {
  // クリーンアップ処理
  this.cleanup();

  // データのクリア
  Object.keys(this.scriptInstances).forEach((key) => {
   delete this.scriptInstances[key];
  });
  Object.keys(this.gameStates).forEach((key) => {
   delete this.gameStates[key];
  });
  Object.keys(this.rankingData).forEach((key) => {
   delete this.rankingData[key];
  });

  // 再初期化
  this.initializeScripts();
 }

 /**
  * クリーンアップ処理
  */
 cleanup(): void {
  Object.entries(this.scriptInstances).forEach(([scriptId, instance]) => {
   if (instance.cleanup) {
    try {
     const gameState = this.getGameState(scriptId);
     if (gameState) {
      instance.cleanup(gameState);
     }
    } catch (error) {
     console.error(`クリーンアップエラー (${scriptId}):`, error);
    }
   }
  });
 }

 /**
  * ランキングデータ取得
  */
 getRankingData(scriptId: string): UserStatsType[] | null {
  return this.rankingData[scriptId] || null;
 }

 /**
  * 全てのランキングデータを取得
  */
 getAllRankingData(): Record<string, UserStatsType[]> {
  return { ...this.rankingData };
 }

 /**
  * 特定ユーザーの統計情報を取得
  */
 getUserStatistics(scriptId: string, userId: string): UserStatsType | null {
  const gameState = this.getGameState(scriptId);
  return gameState?.userStats[userId] || null;
 }

 /**
  * アクティブなスクリプトのリストを取得
  */
 getActiveScripts(): string[] {
  return Object.keys(this.scriptInstances);
 }
}
