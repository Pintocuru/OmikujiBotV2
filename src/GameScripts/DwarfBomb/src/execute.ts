// src/execute.ts
import {
 GameSettings,
 GameParams,
 GamePlaceholder,
 GameSettingsSchema,
 GameParamsSchema
} from './params';
import { BomberSpinGame } from './game';
import LogRankScript from '@/GameScripts/LogRank/src/execute';
import { ScriptClass, GameState } from '@/types/';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export class ExecuteScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder> {
 private settings!: GameSettings;
 private LogRank = LogRankScript;
 private game = new BomberSpinGame();

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
  const {} = GameParamsSchema.parse(params);

  // 設定データ
  const userName = comment?.data.displayName ?? 'Unknown';

  // ゲームの実行
  const gameResult = this.game.playGame(userName);
  const { day, payout, message } = gameResult;

  // ランキングの生成
  const logResult = this.LogRank.run(comment, {
   isWin: false,
   getPoint: payout
  });

  // ゲーム結果に基づいて演出効果を生成
  const partyEffects = this.game.generatePartyEffects(gameResult);

  return {
   postActions: isParty
    ? [
       { delaySeconds: 0, wordParty: '!dwarfBombRabbit' },
       { delaySeconds: 3, wordParty: '!bombFire' },
       ...partyEffects
      ]
    : [],
   placeholders: {
    ...logResult.placeholders,
    message,
    day,
    payout
   }
  };
 }

 /**
  * ゲームデータを返す
  */
 getGameState(): GameState {
  return this.LogRank.getGameState();
 }
}

// プリセットから利用できるようにインスタンス化してエクスポート
const execute = new ExecuteScript();
export default execute;
