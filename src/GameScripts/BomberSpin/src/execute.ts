// src/execute.ts
import { GameSettings, GameParams, GamePlaceholder, GameSettingsSchema, GameParamsSchema } from './params'
import { ScriptClass, GameState, ScriptResult } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/types/Comment'
import { SlotGame } from './game'
import { ExecuteScript as LogExecuteScript } from '@/GameScripts/LogRank/src/execute'

export class ExecuteScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder> {
  private settings!: GameSettings
  private LogRank = new LogExecuteScript()
  private slotGame = new SlotGame()

  /**
   * 設定を初期化する
   */
  setup(settings: GameSettings): void {
    this.settings = GameSettingsSchema.parse(settings)
    this.LogRank.setup({ rankMode: 'point', enableCount: this.settings.enableCount }, 'BomberSpin')
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
    const result = this.slotGame.playSlot(userName)

    // ランキングの生成
    const logResult = this.LogRank.run(comment, {
      isWin: false,
      getPoint: result.payout,
    })

    return {
      postActions: isParty
        ? [
            { actionType: 'wordParty', delaySeconds: 0, wordParty: '!bombBack' },
            { actionType: 'wordParty', delaySeconds: 0, wordParty: result.party },
            { actionType: 'wordParty', delaySeconds: 1.8, wordParty: '!bombFire' },
          ]
        : [],
      placeholders: {
        ...logResult.placeholders,
        message: result.message,
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

// プリセットから利用できるようにインスタンス化してエクスポート
const execute = new ExecuteScript()
export default execute
