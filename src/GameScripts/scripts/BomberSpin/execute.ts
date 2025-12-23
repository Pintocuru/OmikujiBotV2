// src\common\GameScripts\scripts\BomberSpin\execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, RankingMessageSchema, PostActionMessageSchema } from '@/types/'
import { playSlot } from './game'
import { LogRankScript } from '@/GameScripts/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@/GameScripts/parseQueryString'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

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
  run(queryString: string, characterKey: string, omiken?: OmikenCommentType): PostActionType[] {
    const params = this.parseParams(queryString)
    const userName = omiken?.userName ?? UNKNOWN_NAME

    // ゲームの実行
    const gameResult = playSlot(userName, params.symbol)

    // ランキングの生成
    const rankingResult = omiken ? this.createRanking(gameResult, characterKey, userName, omiken) : null

    return this.buildPostActions(gameResult, characterKey, rankingResult)
  }

  /**
   * サンプルラン
   */
  sampleRun(queryString: string): string {
    const { symbol } = this.parseParams(queryString)
    const gameResult = playSlot('[ユーザー名]', symbol)
    return gameResult.message
  }

  /**
   * ゲームデータを返す
   */
  getGameState(): GameStateType {
    return this.logRank.getGameState()
  }

  /**
   * パラメータ
   */
  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse(paramsObject)
  }

  /**
   * ランキング生成
   */
  private createRanking(
    gameResult: ReturnType<typeof playSlot>,
    characterKey: string,
    userName: string,
    omiken: OmikenCommentType
  ) {
    const logResult = this.logRank.run({
      userId: omiken.userId,
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
    const record = logResult.currentRecord

    const ranking = RankingMessageSchema.parse({
      scriptKey: RANKING_KEY,
      name: stats.name,
      scoreText: String(gameResult.payout),
      scoreValue: record.score,
      symbol: gameResult.symbol,
      isRank: !logResult.isOverLimit,
    })

    return {
      ranking,
      postActions: logResult.postActions,
    }
  }

  /**
   * 投稿
   */
  private buildPostActions(
    gameResult: ReturnType<typeof playSlot>,
    characterKey: string,
    rankingResult: {
      ranking: unknown
      postActions: PostActionType[]
    } | null
  ): PostActionType[] {
    return [
      ...(rankingResult?.postActions ?? []),
      { actionType: 'wordParty', delaySeconds: 1, wordParty: 'BomberSpinBack' },
      { actionType: 'wordParty', delaySeconds: 1.1, wordParty: gameResult.party },
      { actionType: 'wordParty', delaySeconds: 2.8, wordParty: 'CommonBombFire' },
      PostActionMessageSchema.parse({
        delaySeconds: 3.5,
        characterKey,
        message: {
          bubble: gameResult.message,
          ranking: rankingResult?.ranking,
        },
        sound: 'decision',
      }),
    ]
  }
}

export default new ExecuteScript()
