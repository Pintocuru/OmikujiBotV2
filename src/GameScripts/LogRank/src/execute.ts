// src/execute.ts
// ユーザーの勝敗・ポイント・ランキングを管理するゲームシステム
import {
 GameSettings,
 GameParams,
 GamePlaceholder,
 GameSettingsSchema,
 GameParamsSchema
} from './params';
import { ScriptResult, ScriptClass, GameState, GameStateSchema } from '@/types/';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// Services
import { UserStatsService } from './services/UserStatsService';
import { RankingService } from './services/RankingService';
import { PlaceholderService } from './services/PlaceholderService';
import { GameContext } from './GameContext';

export class ExecuteScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder> {
 private settings!: GameSettings;
 private gameState?: GameState;

 /**
  * 設定を初期化する
  */
 setup(settings: GameSettings): void {
  this.gameState = GameStateSchema.parse({ ruleId: 'LogRank' });
  this.settings = GameSettingsSchema.parse(settings);
 }

 /**
  * ゲームを実行する
  */
 run(comment: Comment, params: GameParams): ScriptResult<GamePlaceholder> {
  try {
   // コンテキストオブジェクトを作成
   const context: GameContext = {
    settings: this.settings,
    params: GameParamsSchema.parse(params),
    gameState: this.gameState,
    currentUser: {
     id: comment.data.userId,
     name: comment.data.name
    }
   };

   // ユーザー統計を更新
   const updatedUserStats = UserStatsService.updateUserStats(context);

   // ゲーム状態を更新
   const updatedGameState = {
    ...context.gameState,
    userStats: updatedUserStats
   };

   // ランキングを生成
   const updatedContext = { ...context, gameState: updatedGameState };
   const userRankings = RankingService.generateRankings(updatedContext);

   // 上限チェック
   const currentUserStats = updatedUserStats[context.currentUser.id];
   const isOverLimit =
    this.settings.enableCount > 0 && (currentUserStats?.draws || 0) > this.settings.enableCount;

   if (!isOverLimit) {
    this.gameState = { ...updatedGameState, userRankings };
   }

   // プレースホルダーを生成
   const finalContext = {
    ...updatedContext,
    gameState: { ...updatedGameState, userRankings }
   };

   return {
    placeholders: PlaceholderService.createPlaceholders(finalContext),
    postActions: []
   };
  } catch (error) {
   console.error('Game execution error:', error);
   throw new Error('ゲーム実行中にエラーが発生しました');
  }
 }

 /**
  * ゲームデータを返す
  */
 getGameState(): GameState {
  return this.gameState;
 }
}

// プリセットから利用できるようにインスタンス化してエクスポート
const execute = new ExecuteScript();
export default execute;
