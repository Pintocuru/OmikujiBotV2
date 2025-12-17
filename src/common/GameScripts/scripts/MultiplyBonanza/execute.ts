// src/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType } from '@/types/'
import { GameEngine } from './game'
import { LogRankScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@/common/GameScripts/parseQueryString'
import { WordPartySelector } from './wordPartySelector'
import { Comment } from '@onecomme.com/onesdk/'

const RANKING_KEY = 'MultiplyBonanza'
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
    const { mode } = this.parseParams(queryString)
    const userName = comment?.data.displayName ?? comment?.data.name ?? UNKNOWN_NAME

    // ゲームの実行
    const gameEngine = new GameEngine()
    const gameResult = gameEngine.playGame(mode)
    const message = gameEngine.createMessage(userName, gameResult)

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

    // WordPartyの抽選
    const wordPartySelector = new WordPartySelector()
    const wordPartyActions = wordPartySelector.selectWordParties(gameResult)

    return [
      { actionType: 'wordParty', delaySeconds: 1, wordParty: gameResult.party },
      { actionType: 'wordParty', delaySeconds: 3.2, wordParty: 'MultiplyBonanzaCracker1' },
      ...wordPartyActions,
      {
        actionType: 'message',
        delaySeconds: 3.5,
        characterKey,
        iconKey: 'default',
        message: {
          bubble: message,
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
