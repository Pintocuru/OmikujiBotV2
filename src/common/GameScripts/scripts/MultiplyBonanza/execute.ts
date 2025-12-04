// src/execute.ts
import { GameSettings, GameParams, GamePlaceholder, GameSettingsSchema, GameParamsSchema } from './params'
import { ScriptClass, GameState, ScriptResult } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { ExecuteScript as LogExecuteScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { GameEngine } from './game'
import { WordPartySelector } from './wordPartySelector'

export class ExecuteScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder> {
  private settings!: GameSettings
  private LogRank = new LogExecuteScript()
  private gameEngine = new GameEngine()
  private wordPartySelector = new WordPartySelector()

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
    GameParamsSchema.parse(params)

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

    // WordPartyの抽選
    const wordPartyActions = this.wordPartySelector.selectWordParties(result)

    return {
      postActions: isParty
        ? [
            { actionType: 'wordParty', delaySeconds: 1, wordParty: result.party },
            { actionType: 'wordParty', delaySeconds: 3.2, wordParty: 'MultiplyBonanzaCracker1' },
            ...wordPartyActions,
          ]
        : [],
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
