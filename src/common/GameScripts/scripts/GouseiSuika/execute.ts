// src/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType } from '@/types/'
import { GachaGame } from './game'
import { GameResult } from './gameConfigs'
import { parseQueryString } from '@/common/GameScripts/parseQueryString'
import { LogRankScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { Comment } from '@onecomme.com/onesdk/'

const RANKING_KEY = 'GouseiSuika'
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
    const gameResult = new GachaGame(mode).play()
    const rankingActions = this.buildRankingActions(gameResult, characterKey, mode, comment)

    return [...gameResult.postArray, ...rankingActions]
  }

  sampleRun(): string {
    const gameResult = new GachaGame().play()
    return `[ユーザー名]の得点は${gameResult.points}!`
  }

  /** ゲームデータを返す */
  getGameState(): GameStateType {
    return this.logRank.getGameState()
  }

  // ---- private helpers ----

  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse(paramsObject)
  }

  private buildRankingActions(
    gameResult: GameResult,
    characterKey: string,
    mode: string,
    comment?: Comment
  ): PostActionType[] {
    if (!comment) return []

    const logResult = this.logRank.run({
      userId: comment.data.userId,
      name: comment.data.displayName ?? UNKNOWN_NAME,
      characterKey,
      rankingMode: 'high_score',
      maxDrawsPerUser: 5,
      result: {
        type: 'score',
        score: gameResult.points,
      },
    })

    const stats = logResult.currentUserStats
    const currentRecord = logResult.currentRecord

    return [
      ...logResult.postActions,
      {
        actionType: 'message',
        delaySeconds: 3.5,
        characterKey,
        iconKey: 'default',
        message: {
          bubble: `${comment.data.displayName ?? UNKNOWN_NAME}の得点は${gameResult.points}!`,
          rankingKey: RANKING_KEY,
          rankingDisplayScore: String(gameResult.points),
          rankingIsRank: !logResult.isOverLimit,
          rankingName: stats.name,
          rankingPoint: String(currentRecord.score),
          rankingSymbol: mode,
        },
        sound: 'decision',
      },
    ]
  }
}

// プリセット用エクスポート
export default new ExecuteScript()
