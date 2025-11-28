// src\GameScripts\GoogolClover\execute.ts
import { GameSettings, GameParams, GamePlaceholder, GameSettingsSchema, GameParamsSchema } from './params'
import { ScriptClass, GameState, ScriptResult } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { playSlot } from './game'
import { ExecuteScript as LogExecuteScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { UserState } from './types'

export class ExecuteScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder> {
  private settings!: GameSettings
  private LogRank = new LogExecuteScript()
  private userStates = new Map<string, UserState>()

  setup(settings: GameSettings): void {
    this.settings = GameSettingsSchema.parse(settings)
    this.LogRank.setup({ rankMode: 'point', enableCount: this.settings.enableCount }, 'BomberSpin')
  }

  run(comment: Comment, params: GameParams): ScriptResult<GamePlaceholder> {
    const { isParty } = this.settings
    const {} = GameParamsSchema.parse(params)

    const userName = comment.data.displayName ?? comment.data.name
    const userId = comment?.data.userId

    // 純粋関数として呼び出し
    const result = playSlot(this.userStates, userId, userName)

    return {
      postActions:
        result.party === '!bombFail'
          ? [
              { actionType: 'wordParty', delaySeconds: -1, wordParty: 'MaidenOmikujiLottery' },
              { actionType: 'wordParty', delaySeconds: 0, wordParty: 'MaidenOmikuji07' },
              { actionType: 'wordParty', delaySeconds: 1, wordParty: 'GoogolCloverFail' },
            ]
          : [
              { actionType: 'wordParty', delaySeconds: -1, wordParty: 'MaidenOmikujiLottery' },
              { actionType: 'wordParty', delaySeconds: 0, wordParty: 'MaidenOmikuji01' },
              { actionType: 'wordParty', delaySeconds: 1, wordParty: '!レベルアップ' },
            ],
      placeholders: {
        message: result.message,
        payout: result.payout,
      },
    }
  }

  getGameState(): GameState {
    return this.LogRank.getGameState()
  }
}

// プリセットから利用できるようにインスタンス化してエクスポート
const execute = new ExecuteScript()
export default execute
