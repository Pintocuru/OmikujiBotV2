// src/execute.ts
import { GameSettings, GameParams, GameParamsSchema } from './params'
import { ScriptClass, GameState, ScriptResult } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { GAME_CONFIGS, GameResult } from './gameConfigs'
import { GachaGame } from './game'
import { ExecuteScript as LogExecuteScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'

export class ExecuteScript implements ScriptClass {
  private LogRank = new LogExecuteScript()

  constructor() {
    // LogRank
    this.LogRank.setup({ rankMode: 'point', enableCount: 5 }, 'GouseiSuika')
  }

  /**
   * ゲームを実行する
   */
  run(params: string, characterKey: string, comment?: Comment): ScriptResult {
    // パラメータ
    const { mode } = GameParamsSchema.parse(params)

    // 設定データ
    const userName = comment?.data.displayName ?? 'Unknown'

    // ゲームの実行
    const gameResult = this.executeGame(mode)

    // ランキングの生成
    const logResult = comment
      ? this.LogRank.run(comment, characterKey, {
          isWin: false,
          getPoint: gameResult.points,
        })
      : null

    return {
      postActions: gameResult.postArray,
      placeholders: {
        message: `${userName}の得点は${gameResult.points}!`,
        mode,
        points: gameResult.points,
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
   * ゲームを実行し、結果を返す
   */
  private executeGame(mode: string): GameResult {
    const gameConfig = GAME_CONFIGS[mode]
    if (!gameConfig) throw new Error(`不明なゲームモード: ${mode}`)
    return new GachaGame(gameConfig, mode).play()
  }
}

// プリセットから利用できるようにインスタンス化してエクスポート
const execute = new ExecuteScript()
export default execute
