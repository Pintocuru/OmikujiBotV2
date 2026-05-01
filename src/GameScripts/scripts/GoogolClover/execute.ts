// src/GameScripts/scripts/GoogolClover/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, GameStateType, ScriptResult } from '@/types'
import { executeGame } from './sub/game'
import { buildPostActions } from './sub/postActionBuilder'
import { UserState } from './sub/types'
import { LogRankScript } from '@game/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@game/parseQueryString'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { prepareUserInfo } from '@/GameScripts/scriptsEngine/RankingMessage/RankingMessage'
import { GameScriptBase } from '@/types/GameScript/GameScriptBase'

const RANKING_KEY = 'GoogolClover'

export class ExecuteScript extends GameScriptBase implements ScriptClass {
  private readonly logRank = new LogRankScript()
  private readonly userStates = new Map<string, UserState>()

  /**
   * 設定を初期化する
   */
  constructor() {
    super()
    this.logRank.setup(RANKING_KEY)
  }

  /**
   * ゲームを実行する
   */
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const {} = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)

    // ゲームの実行
    const gameResult = executeGame(this.userStates, user)

    // PostActionの構築
    const postActions = buildPostActions({
      bubble: gameResult.bubble,
      score: gameResult.botMessageExtra.lists?.order ?? 0,
      characterKey,
    })

    return {
      actions: postActions,
      botMessageExtras: [gameResult.botMessageExtra],
    }
  }

  /**
   * サンプルラン
   */
  sampleRun(queryString: string): string {
    const {} = this.parseParams(queryString)
    const user = prepareUserInfo()

    const gameResult = executeGame(this.userStates, user)
    return gameResult.bubble
  }

  /**
   * ゲームデータを返す
   */
  getGameState(): GameStateType {
    return this.logRank.getGameState()
  }

  /**
   * パラメータをパース
   */
  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse(paramsObject)
  }
}

export default new ExecuteScript()
