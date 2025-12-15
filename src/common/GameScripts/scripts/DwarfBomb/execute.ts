// src/execute.ts
import { GameSettings, GameParams, GamePlaceholder, GameSettingsSchema, GameParamsSchema } from './params'
import { BomberSpinGame } from './game'
import { ScriptClass, GameState, ScriptResult } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { LogRankScript as LogExecuteScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'

export class ExecuteScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder> {
  private settings!: GameSettings
  private LogRank = new LogExecuteScript()
  private game = new BomberSpinGame()

  /**
   * 設定を初期化する
   */
  setup(settings: GameSettings): void {
    this.settings = GameSettingsSchema.parse(settings)
    this.LogRank.setup({ rankMode: 'point', enableCount: this.settings.enableCount }, 'DwarfBomb')
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
    const gameResult = this.game.playGame(userName)
    const { day, payout, message } = gameResult

    // ランキングの生成
    const logResult = this.LogRank.run(comment, {
      isWin: false,
      getPoint: payout,
    })

    // ゲーム結果に基づいて演出効果を生成
    const partyEffects = this.game.generatePartyEffects(gameResult)

    return {
      postActions: isParty
        ? [
            { actionType: 'wordParty', delaySeconds: 1, wordParty: 'DwarfBombRabbit1' },
            { actionType: 'wordParty', delaySeconds: 1.5, wordParty: 'DwarfBombRabbit2' },
            { actionType: 'wordParty', delaySeconds: 2, wordParty: 'DwarfBombRabbit3' },
            { actionType: 'wordParty', delaySeconds: 2.7, wordParty: 'CommonBombFire' },
            ...partyEffects,
          ]
        : [],
      placeholders: {
        ...logResult.placeholders,
        message,
        day,
        payout,
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
