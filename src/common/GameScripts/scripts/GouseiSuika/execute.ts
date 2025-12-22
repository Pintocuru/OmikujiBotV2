// src/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, RankingMessageSchema, PostActionMessageSchema } from '@/types/'
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
  run(queryString: string, characterKey: string, comment?: OmikenCommentType): PostActionType[] {
    // パラメータ
    const { mode } = this.parseParams(queryString)
    const userName = comment?.data.displayName ?? comment?.data.name ?? UNKNOWN_NAME

    // ゲームの実行
    const gameResult = new GachaGame(mode).play()
    const rankingActions = this.buildRankingActions(userName, gameResult, characterKey, mode, comment)

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
    userName: string,
    gameResult: GameResult,
    characterKey: string,
    mode: string,
    comment?: OmikenCommentType
  ): PostActionType[] {
    if (!comment) return []

    const logResult = this.logRank.run({
      userId: comment.data.userId,
      name: userName,
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

    const ranking = RankingMessageSchema.parse({
      scriptKey: RANKING_KEY,
      name: stats.name,
      scoreText: String(gameResult.points),
      scoreValue: currentRecord.score,
      symbol: mode,
      timestamp: Date.now(),
      isRank: !logResult.isOverLimit,
    })

    return [
      ...logResult.postActions,
      PostActionMessageSchema.parse({
        delaySeconds: 3.5,
        characterKey,
        message: {
          bubble: `${userName}の得点は${gameResult.points}!`,
          ranking,
        },
        sound: 'decision',
      }),
    ]
  }
}

// プリセット用エクスポート
export default new ExecuteScript()
