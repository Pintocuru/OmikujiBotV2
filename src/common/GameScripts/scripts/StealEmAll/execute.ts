// src/execute.ts
import { GameSettings, GameParams, GameSettingsSchema, GameParamsSchema } from './params'
import { ScriptClass, GameState, PostActionType } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { LogRankScript as LogExecuteScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { GameEngine } from './game'
import { type GameResult } from './gameConfig'

export class ExecuteScript implements ScriptClass {
  private settings!: GameSettings
  private LogRank = new LogExecuteScript()
  private gameEngine = new GameEngine()

  /**
   * 設定を初期化する
   */
  setup(settings: GameSettings): void {
    this.settings = GameSettingsSchema.parse(settings)
    this.LogRank.setup({ rankMode: 'point', enableCount: this.settings.enableCount }, 'StealEmAll')
  }

  /**
   * ゲームを実行する
   */
  run(comment: Comment, params: GameParams): PostActionType[] {
    // パラメータ
    const { isParty } = this.settings
    const {} = GameParamsSchema.parse(params)

    // 設定データ
    const userName = comment?.data.displayName ?? comment?.data.name ?? 'Unknown'

    // ゲームの実行
    const result = this.gameEngine.playGame()
    const message = this.gameEngine.createMessage(userName, result)

    // ランキングの生成
    const logResult = this.LogRank.run(comment, {
      isWin: false,
      getPoint: result.payout,
    })

    return {
      // TODO:settings.isPartyの実装(まだWordPartyができてない)
      postActions: isParty ? [] : [],
      placeholders: {
        ...logResult.placeholders,
        message,
        stage: result.stage,
        payout: result.payout,
      },
    }
  }

  /**
   * ゲームデータを返す
   */
  getGameState(): GameState {
    return this.LogRank.getGameState()
  }

  /**
   * テスト用のゲーム実行
   */
  public playGameForTest(): GameResult {
    return this.gameEngine.playGame()
  }
}

const execute = new ExecuteScript()
export default execute
