// src/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType } from '@/types/'
import { BomberSpinGame } from './game'
import { parseQueryString } from '@/common/GameScripts/parseQueryString'
import { LogRankScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { Comment } from '@onecomme.com/onesdk/'

const RANKING_KEY = 'DwarfBomb'
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
    const game = new BomberSpinGame()
    const gameResult = game.playGame(userName, mode)
    const { day, payout, message } = gameResult

    // ランキングの生成
    const logResult = this.logRank.run({
      userId: comment.data.userId,
      name: userName,
      characterKey,
      rankingMode: 'high_score',
      maxDrawsPerUser: 5,
      result: {
        type: 'score',
        score: payout,
      },
    })

    const stats = logResult.currentUserStats
    const currentRecord = logResult.currentRecord

    // ゲーム結果に基づいて演出効果を生成
    const partyEffects = game.generatePartyEffects(gameResult)

    return [
      { actionType: 'wordParty', delaySeconds: 1, wordParty: 'DwarfBombRabbit1' },
      { actionType: 'wordParty', delaySeconds: 1.5, wordParty: 'DwarfBombRabbit2' },
      { actionType: 'wordParty', delaySeconds: 2, wordParty: 'DwarfBombRabbit3' },
      { actionType: 'wordParty', delaySeconds: 2.7, wordParty: 'CommonBombFire' },
      ...partyEffects,
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
          rankingSymbol: '',
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
