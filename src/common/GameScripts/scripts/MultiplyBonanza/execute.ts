// src/execute.ts
import { GameSettings, GameParams, GamePlaceholder, GameSettingsSchema, GameParamsSchema } from './params'
import { ScriptClass, GameState, ScriptResult } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { ExecuteScript as LogExecuteScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { GameEngine } from './game'

export class ExecuteScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder> {
  private settings!: GameSettings
  private LogRank = new LogExecuteScript()
  private gameEngine = new GameEngine()

  /**
   * 設定を初期化する
   */
  setup(settings: GameSettings): void {
    this.settings = GameSettingsSchema.parse(settings)
    this.LogRank.setup({ rankMode: 'point', enableCount: this.settings.enableCount }, 'MultiplyBonanza')
  }

  /**
   * ゲームを実行する
   */
  run(comment: Comment, params: GameParams): ScriptResult<GamePlaceholder> {
    // パラメータ
    const { isParty } = this.settings
    const {} = GameParamsSchema.parse(params)

    // 設定データ
    const userName = comment?.data.displayName ?? 'Unknown'

    // ゲームの実行
    const result = this.gameEngine.playGame()
    const message = this.gameEngine.createMessage(userName, result)

    // ランキングの生成
    const logResult = this.LogRank.run(comment, {
      isWin: false,
      getPoint: result.payout,
    })

    return {
      // TODO:内容を実装
      postActions: isParty ? [] : [],
      placeholders: {
        ...logResult.placeholders,
        message,
        symbol: result.symbol,
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
}

const execute = new ExecuteScript()
export default execute
