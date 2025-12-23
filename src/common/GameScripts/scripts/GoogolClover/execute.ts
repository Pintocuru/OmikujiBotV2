// src/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, RankingMessageSchema, PostActionMessageSchema } from '@/types/'
import { playSlot } from './game'
import { UserState } from './types'
import { LogRankScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@/common/GameScripts/parseQueryString'

const RANKING_KEY = 'GoogolClover'
const UNKNOWN_NAME = 'Unknown'

export class ExecuteScript implements ScriptClass {
  private readonly logRank = new LogRankScript()
  private userStates = new Map<string, UserState>()

  /**
   * 設定を初期化する
   */
  constructor() {
    this.logRank.setup(RANKING_KEY)
  }

  /**
   * ゲームを実行する
   */
  run(queryString: string, characterKey: string, comment?: OmikenCommentType): PostActionType[] {
    // パラメータ
    const { mode } = this.parseParams(queryString)
    const userName = comment?.data.displayName ?? comment?.data.name ?? UNKNOWN_NAME
    const userId = comment?.data.userId

    // ゲームの実行
    const gameResult = playSlot(this.userStates, userId, userName)

    // ランキングの生成
    const logResult = this.logRank.run({
      userId: comment.data.userId,
      name: userName,
      characterKey,
      rankingMode: 'total_wins',
      maxDrawsPerUser: 5,
      result: {
        type: 'win',
        score: gameResult.payout,
      },
    })

    const stats = logResult.currentUserStats
    const currentRecord = logResult.currentRecord

    const ranking = RankingMessageSchema.parse({
      name: stats.name,
      scoreText: String(gameResult.payout),
      scoreValue: gameResult.payout,
      scriptKey: RANKING_KEY,
      isUniqueUser: true,
    })

    const msg: PostActionType[] = [
      PostActionMessageSchema.parse({
        delaySeconds: 3.5,
        characterKey,
        message: {
          bubble: gameResult.message,
          ranking,
        },
        sound: 'decision',
      }),
    ]

    return gameResult.success
      ? [
          { actionType: 'wordParty', delaySeconds: -1, wordParty: 'MaidenOmikujiLottery' },
          { actionType: 'wordParty', delaySeconds: 0, wordParty: 'MaidenOmikuji01' },
          { actionType: 'sound', delaySeconds: 1, sound: 'carnival' },
          ...msg,
        ]
      : [
          { actionType: 'wordParty', delaySeconds: -1, wordParty: 'MaidenOmikujiLottery' },
          { actionType: 'wordParty', delaySeconds: 0, wordParty: 'MaidenOmikuji07' },
          { actionType: 'sound', delaySeconds: 1, sound: 'fail' },
          { actionType: 'wordParty', delaySeconds: 1, wordParty: 'GoogolCloverFail' },
          ...msg,
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
