// src/execute.ts
import {
 GameSettings,
 GameParams,
 GamePlaceholder,
 GameSettingsSchema,
 GameParamsSchema
} from './params';
import { ScriptClass, GameState } from '@type/index';
import LogRankScript from '@/GameScripts/LogRank/src/execute';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { GAME_CONFIGS, GameResult } from './gameConfigs';
import { GachaGame } from './game';

export class ExecuteScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder> {
 private settings!: GameSettings;
 private LogRank = LogRankScript;

 /**
  * 設定を初期化する
  */
 setup(settings: GameSettings): void {
  this.settings = GameSettingsSchema.parse(settings);
  this.LogRank.setup({ rankMode: 'point', enableCount: this.settings.enableCount });
 }

 /**
  * ゲームを実行する
  */
 run(comment: Comment, params: GameParams) {
  // パラメータ
  const { isParty } = this.settings;
  const { mode } = GameParamsSchema.parse(params);

  // 設定データ
  const userName = comment?.data.displayName ?? 'Unknown';

  // ゲームの実行
  const gameResult = this.executeGame(mode);

  // ランキングの生成
  const logResult = this.LogRank.run(comment, {
   isWin: false,
   getPoint: gameResult.points
  });

  return {
   postActions: isParty ? gameResult.postArray : [],
   placeholders: {
    ...logResult.placeholders,
    message: `${userName}の得点は${gameResult.points}!`,
    mode,
    points: gameResult.points
   }
  };
 }

 /**
  * ゲームデータを返す
  */
 getGameState(): GameState {
  return this.LogRank.getGameState();
 }

 /**
  * ゲームを実行し、結果を返す
  */
 private executeGame(mode: string): GameResult {
  const gameConfig = GAME_CONFIGS[mode];
  if (!gameConfig) throw new Error(`不明なゲームモード: ${mode}`);
  return new GachaGame(gameConfig).play();
 }
}

// プリセットから利用できるようにインスタンス化してエクスポート
const execute = new ExecuteScript();
export default execute;
