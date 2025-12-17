// src/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType } from '@/types/'
import { playSlot } from './game'
import { LogRankScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@/common/GameScripts/parseQueryString'
import { Comment } from '@onecomme.com/onesdk/'

const RANKING_KEY = 'BomberSpin'
const UNKNOWN_NAME = 'Unknown'

export class ExecuteScript implements ScriptClass {
  private readonly logRank = new LogRankScript()

  /**
   * 設定を初期化する
   */
  constructor() {
    this.logRank.setup(RANKING_KEY)
  }

  /**
   * ゲームを実行する
   */
  run(queryString: string, characterKey: string, comment?: Comment): PostActionType[] {
    // パラメータ
    const { symbol } = this.parseParams(queryString)
    const userName = comment?.data.displayName ?? comment?.data.name ?? UNKNOWN_NAME

    // ゲームの実行
    const gameResult = playSlot(userName, symbol)

    // ランキングの生成
    const logResult = this.logRank.run({
      userId: comment.data.userId,
      name: userName,
      characterKey,
      rankingMode: 'high_score',
      maxDrawsPerUser: 5,
      result: {
        type: 'score',
        score: gameResult.payout,
      },
    })

    const stats = logResult.currentUserStats
    const currentRecord = logResult.currentRecord

    return [
      ...logResult.postActions,
      { actionType: 'wordParty', delaySeconds: 1, wordParty: 'BomberSpinBack' },
      { actionType: 'wordParty', delaySeconds: 1.1, wordParty: gameResult.party },
      { actionType: 'wordParty', delaySeconds: 2.8, wordParty: 'CommonBombFire' },
      {
        actionType: 'message',
        delaySeconds: 3.5,
        characterKey,
        iconKey: 'default',
        message: {
          bubble: gameResult.message,
          rankingKey: RANKING_KEY,
          rankingDisplayScore: String(gameResult.payout),
          rankingIsRank: !logResult.isOverLimit,
          rankingName: stats.name,
          rankingPoint: String(currentRecord.score),
          rankingSymbol: gameResult.symbol,
        },
        sound: 'decision',
      },
    ]
  }

  /**
   * ゲームデータを返す
   */
  getGameState(): GameStateType {
    return this.logRank.getGameState()
  }

  // パラメータ
  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse(paramsObject)
  }
}

// プリセット用エクスポート
export default new ExecuteScript()
