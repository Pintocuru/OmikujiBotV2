// src/execute.ts
import { GameSettings, GameParams, GamePlaceholder, GameSettingsSchema, GameParamsSchema } from './params'
import { ScriptClass, GameState, ScriptResult } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { SlotGame } from './game'
import { ExecuteScript as LogExecuteScript } from '@/GameScripts/LogRank/src/execute'

export class ExecuteScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder> {
  private settings!: GameSettings
  private LogRank = new LogExecuteScript()
  private slotGame = new SlotGame()

  // ★ userStatesをExecuteScriptで管理
  private userStates = new Map<string, { funds: number; exp: number }>()

  setup(settings: GameSettings): void {
    this.settings = GameSettingsSchema.parse(settings)
    this.LogRank.setup({ rankMode: 'point', enableCount: this.settings.enableCount }, 'BomberSpin')
  }

  run(comment: Comment, params: GameParams): ScriptResult<GamePlaceholder> {
    const { isParty } = this.settings
    const {} = GameParamsSchema.parse(params)

    const userName = comment?.data.displayName ?? 'Unknown'
    const userId = comment?.data.userId ?? 'unknown-id' // ★ userIdを取得

    // ★ userStatesとuserIdを引数として渡す
    const result = this.slotGame.playSlot(this.userStates, userId)

    return {
      postActions: isParty
        ? [
            { actionType: 'wordParty', delaySeconds: 0, wordParty: '!bombBack' },
            { actionType: 'wordParty', delaySeconds: 0, wordParty: result.party },
            { actionType: 'wordParty', delaySeconds: 1.8, wordParty: '!bombFire' },
          ]
        : [],
      placeholders: {
        message: result.message,
        symbol: result.symbol,
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
